// cache/cacheService.js
export class CacheService {
    constructor(ttl = 1800000) {
        this.cache = new Map();
        this.ttl = ttl;
        this.hits = 0;
        this.misses = 0;
    }
  
    set(key, value) {
        console.log(`Cache set: ${key}`);
        this.cache.set(key, {
            value: value.value || value,
            timestamp: value.timestamp || Date.now()
        });
    }
  
    get(key) {
        const data = this.cache.get(key);
        if (!data) {
            console.log(`Cache miss: ${key}`);
            this.misses++;
            return null;
        }

        console.log(`Cache hit: ${key}`, data);
        this.hits++;
        return data; 
    }

    getStats() {
        return {
            hits: this.hits,
            misses: this.misses,
            size: this.cache.size,
            items: Array.from(this.cache.entries()).map(([key, data]) => ({
                key,
                age: Math.round((Date.now() - data.timestamp) / 1000) + 's',
                value: data.value
            }))
        };
    }
}