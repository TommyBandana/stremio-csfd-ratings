import { getMetaFromImdb } from './cinemeta.js';
import { searchCsfd, getCsfdRating } from './csfd.js';

const manifest = {
    id: 'community.csfd.ratings',
    version: '1.0.0',
    name: 'CSFD Ratings',
    description: 'Shows CSFD.cz ratings for movies and series',
    resources: ['meta'],
    types: ['movie', 'series'],
    idPrefixes: ['tt'],
    catalogs: [],
};

function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Content-Type': 'application/json',
    };
}

function jsonResponse(data) {
    return new Response(JSON.stringify(data), { headers: corsHeaders() });
}

function buildMeta(id, type, { name, rating, url }) {
    return {
        id,
        type,
        name,
        description: `⭐ CSFD: ${rating}% | ${url}`,
        imdbRating: (rating / 10).toFixed(1),
        links: [{ name: 'CSFD.cz', category: 'csfd', url }],
    };
}

async function handleMeta(type, id, cache) {
    try {
        // Check KV cache
        const cached = await cache.get(id, { type: 'json' });
        if (cached) {
            return jsonResponse({ meta: buildMeta(id, type, cached) });
        }

        const { name, year } = await getMetaFromImdb(type, id);

        const filmPath = await searchCsfd(name, year);
        if (!filmPath) {
            return jsonResponse({ meta: { id, type } });
        }

        const result = await getCsfdRating(filmPath);
        if (!result) {
            return jsonResponse({ meta: { id, type } });
        }

        const data = { name, rating: result.rating, url: result.url };

        // Cache in KV with 24h TTL
        await cache.put(id, JSON.stringify(data), { expirationTtl: 86400 });

        return jsonResponse({ meta: buildMeta(id, type, data) });
    } catch (err) {
        console.error(`[error] ${id}:`, err.message);
        return jsonResponse({ meta: { id, type } });
    }
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders() });
        }

        // Manifest
        if (path === '/manifest.json') {
            return jsonResponse(manifest);
        }

        // Meta handler: /meta/:type/:id.json
        const metaMatch = path.match(/^\/meta\/(movie|series)\/([^/]+)\.json$/);
        if (metaMatch) {
            const [, type, id] = metaMatch;
            return handleMeta(type, id, env.CACHE);
        }

        return new Response('Not found', { status: 404 });
    },
};
