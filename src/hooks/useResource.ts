import { useEffect, useState, useRef } from 'react';
import type { APIResponse } from '../types';

const cache = new Map<string, any>();

type UseResourceReturn<T> = {
  data: T[] | null;
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export function useResource<T>(
  fetcher: (page?: number, search?: string) => Promise<APIResponse<T>>,
  resourceKey: string,
  page: number,
  search = '',
): UseResourceReturn<T> {
  const cacheKey = `${resourceKey}|page:${page}|q:${search}`;
  const mountedRef = useRef(true);

  const [data, setData] = useState<T[] | null>(() => {
    return cache.get(cacheKey)?.results ?? null;
  });
  const [count, setCount] = useState<number>(() => cache.get(cacheKey)?.count ?? 0);
  const [next, setNext] = useState<string | null>(() => cache.get(cacheKey)?.next ?? null);
  const [previous, setPrevious] = useState<string | null>(() => cache.get(cacheKey)?.previous ?? null);
  const [loading, setLoading] = useState<boolean>(!cache.has(cacheKey));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      const cached = cache.get(cacheKey);
      if (cached) {
        setData(cached.results);
        setCount(cached.count);
        setNext(cached.next);
        setPrevious(cached.previous);
        setLoading(false);
        return;
      }

      try {
        const res = await fetcher(page, search);
        if (cancelled) return;
        cache.set(cacheKey, {
          results: res.results,
          count: res.count,
          next: res.next,
          previous: res.previous,
        });
        if (!mountedRef.current) return;
        setData(res.results);
        setCount(res.count);
        setNext(res.next);
        setPrevious(res.previous);
      } catch (err: any) {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, [cacheKey, fetcher, page, search]);

  const refetch = async () => {
    cache.delete(cacheKey);
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher(page, search);
      cache.set(cacheKey, {
        results: res.results,
        count: res.count,
        next: res.next,
        previous: res.previous,
      });
      setData(res.results);
      setCount(res.count);
      setNext(res.next);
      setPrevious(res.previous);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { data, count, next, previous, loading, error, refetch };
}
