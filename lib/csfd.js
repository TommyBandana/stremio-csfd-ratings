const cheerio = require('cheerio');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'cs,en;q=0.9',
};

let lastRequestTime = 0;
const MIN_DELAY = 500;

async function throttledFetch(url) {
    const now = Date.now();
    const wait = Math.max(0, MIN_DELAY - (now - lastRequestTime));
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    lastRequestTime = Date.now();
    return fetch(url, { headers: HEADERS });
}

async function searchCsfd(title, year) {
    const url = `https://www.csfd.cz/hledat/?q=${encodeURIComponent(title)}`;
    const res = await throttledFetch(url);
    if (!res.ok) throw new Error(`CSFD search returned ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    let bestMatch = null;

    $('article.article-poster-50').each((_, el) => {
        const link = $(el).find('a.film-title-name');
        const href = link.attr('href');
        if (!href || !href.startsWith('/film/')) return;

        const infoText = $(el).find('.film-title-info .info').text();
        const yearMatch = infoText.match(/\((\d{4})\)/);
        const filmYear = yearMatch ? parseInt(yearMatch[1]) : null;

        if (!bestMatch && filmYear && Math.abs(filmYear - year) <= 1) {
            bestMatch = href;
        }
    });

    // Fallback: take first film result if no year match
    if (!bestMatch) {
        const firstLink = $('article.article-poster-50 a.film-title-name').first().attr('href');
        if (firstLink && firstLink.startsWith('/film/')) {
            bestMatch = firstLink;
        }
    }

    return bestMatch;
}

async function getCsfdRating(filmPath) {
    const url = `https://www.csfd.cz${filmPath}`;
    const res = await throttledFetch(url);
    if (!res.ok) throw new Error(`CSFD page returned ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    let rating = null;
    $('script[type="application/ld+json"]').each((_, el) => {
        try {
            const data = JSON.parse($(el).html());
            if (data.aggregateRating && data.aggregateRating.ratingValue != null) {
                rating = Math.round(data.aggregateRating.ratingValue);
            }
        } catch {}
    });

    if (rating === null) return null;
    return { rating, url };
}

module.exports = { searchCsfd, getCsfdRating };
