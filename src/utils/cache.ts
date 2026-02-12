const cache = new Map<string, Promise<unknown>>();

export function fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>
): Promise<T> {
    if (!cache.has(key)) {
        cache.set(key, fetcher());
    }
    return cache.get(key)!;
}

export function invalidate(key: string) {
    cache.delete(key);
}
