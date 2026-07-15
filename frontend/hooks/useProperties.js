'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchAvailableHomes } from '@/lib/supabaseClient';

export function useProperties(filters = {}) {
  const { category, sort, limit, offset } = filters;
  const [homes, setHomes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAvailableHomes({ category, sort, limit, offset });
      setHomes(result.homes);
      setTotal(result.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, sort, limit, offset]);

  useEffect(() => {
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      void refetch();
    };

    queueMicrotask(start);

    return () => {
      cancelled = true;
    };
  }, [refetch]);

  return { homes, total, loading, error, refetch };
}
