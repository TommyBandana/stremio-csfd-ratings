const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'cs,en;q=0.9',
};

export async function searchCsfd(title, year) {
    const url = `https://www.csfd.cz/hledat/?q=${encodeURIComponent(title)}`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`CSFD search returned ${res.status}`);
    const html = await res.text();

    // Match all film results: extract href and year
    const articleRegex = /<article[^>]*class="[^"]*article-poster-50[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
    let match;
    let bestMatch = null;
    let firstMatch = null;

    while ((match = articleRegex.exec(html)) !== null) {
        const article = match[1];
        const hrefMatch = article.match(/href="(\/film\/\d+-[^"]*\/prehled\/)"/);
        if (!hrefMatch) continue;

        const href = hrefMatch[1];
        if (!firstMatch) firstMatch = href;

        const yearMatch = article.match(/\((\d{4})\)/);
        const filmYear = yearMatch ? parseInt(yearMatch[1]) : null;

        if (filmYear && Math.abs(filmYear - year) <= 1) {
            bestMatch = href;
            break;
        }
    }

    return bestMatch || firstMatch || null;
}

export async function getCsfdRating(filmPath) {
    const url = `https://www.csfd.cz${filmPath}`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`CSFD page returned ${res.status}`);
    const html = await res.text();

    // Extract JSON-LD
    const ldRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
    let match;
    while ((match = ldRegex.exec(html)) !== null) {
        try {
            const data = JSON.parse(match[1]);
            if (data.aggregateRating && data.aggregateRating.ratingValue != null) {
                return {
                    rating: Math.round(data.aggregateRating.ratingValue),
                    url,
                };
            }
        } catch {}
    }

    return null;
}
