const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const { getMetaFromImdb } = require('./lib/cinemeta');
const { searchCsfd, getCsfdRating } = require('./lib/csfd');
const cache = require('./lib/cache');

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

const builder = new addonBuilder(manifest);

builder.defineMetaHandler(async ({ type, id }) => {
    try {
        const cached = cache.get(id);
        if (cached) {
            console.log(`[cache hit] ${id} → CSFD: ${cached.rating}%`);
            return { meta: buildMeta(id, type, cached) };
        }

        const { name, year } = await getMetaFromImdb(type, id);
        console.log(`[cinemeta] ${id} → ${name} (${year})`);

        const filmPath = await searchCsfd(name, year);
        if (!filmPath) {
            console.log(`[csfd] No results for "${name}"`);
            return { meta: { id, type } };
        }

        const result = await getCsfdRating(filmPath);
        if (!result) {
            console.log(`[csfd] No rating found at ${filmPath}`);
            return { meta: { id, type } };
        }

        console.log(`[csfd] ${name} → ${result.rating}% (${result.url})`);
        const data = { name, rating: result.rating, url: result.url };
        cache.set(id, data);
        return { meta: buildMeta(id, type, data) };
    } catch (err) {
        console.error(`[error] ${id}:`, err.message);
        return { meta: { id, type } };
    }
});

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

serveHTTP(builder.getInterface(), { port: 7000 });
console.log('CSFD Ratings addon running on http://localhost:7000');
