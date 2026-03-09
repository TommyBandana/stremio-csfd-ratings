const TTL = 24 * 60 * 60 * 1000; // 24 hours
const cache = new Map();

function get(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > TTL) {
        cache.delete(key);
        return null;
    }
    return entry.value;
}

function set(key, value) {
    cache.set(key, { value, timestamp: Date.now() });
}

module.exports = { get, set };
