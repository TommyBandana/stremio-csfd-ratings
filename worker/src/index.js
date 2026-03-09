import { searchCsfd, getCsfdRating } from './csfd.js';

const manifest = {
    id: 'community.csfd.ratings',
    version: '1.1.0',
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

async function getFullCinemeta(type, id) {
    const res = await fetch(`https://v3-cinemeta.strem.io/meta/${type}/${id}.json`);
    if (!res.ok) throw new Error(`Cinemeta returned ${res.status}`);
    const data = await res.json();
    return data.meta;
}

async function handleMeta(type, id, cache) {
    try {
        // Check KV cache for enriched meta
        const cached = await cache.get(id, { type: 'json' });
        if (cached) {
            return jsonResponse({ meta: cached });
        }

        // Fetch full Cinemeta meta
        const cinemetaMeta = await getFullCinemeta(type, id);
        const name = cinemetaMeta.name;
        const year = cinemetaMeta.releaseInfo ? parseInt(cinemetaMeta.releaseInfo) : cinemetaMeta.year;

        // Search CSFD and get rating
        const filmPath = await searchCsfd(name, year);
        if (!filmPath) {
            return jsonResponse({ meta: cinemetaMeta });
        }

        const result = await getCsfdRating(filmPath);
        if (!result) {
            return jsonResponse({ meta: cinemetaMeta });
        }

        // Enrich Cinemeta meta with CSFD data
        const enrichedMeta = { ...cinemetaMeta };
        enrichedMeta.description = `⭐ CSFD: ${result.rating}%\n\n${cinemetaMeta.description || ''}`;
        enrichedMeta.imdbRating = result.rating / 10;
        enrichedMeta.links = [
            ...(cinemetaMeta.links || []),
            { name: 'CSFD.cz', category: 'csfd', url: result.url },
        ];

        // Cache enriched meta in KV with 24h TTL
        await cache.put(id, JSON.stringify(enrichedMeta), { expirationTtl: 86400 });

        return jsonResponse({ meta: enrichedMeta });
    } catch (err) {
        console.error(`[error] ${id}:`, err.message);
        return jsonResponse({ meta: { id, type } });
    }
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders() });
        }

        if (path === '/manifest.json') {
            return jsonResponse(manifest);
        }

        const metaMatch = path.match(/^\/meta\/(movie|series)\/([^/]+)\.json$/);
        if (metaMatch) {
            const [, type, id] = metaMatch;
            return handleMeta(type, id, env.CACHE);
        }

        return new Response('Not found', { status: 404 });
    },
};
