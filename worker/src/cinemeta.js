export async function getMetaFromImdb(type, imdbId) {
    const res = await fetch(`https://v3-cinemeta.strem.io/meta/${type}/${imdbId}.json`);
    if (!res.ok) throw new Error(`Cinemeta returned ${res.status}`);
    const data = await res.json();
    const meta = data.meta;
    const year = meta.releaseInfo ? parseInt(meta.releaseInfo) : meta.year;
    return { name: meta.name, year };
}
