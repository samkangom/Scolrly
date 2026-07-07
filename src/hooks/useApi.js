import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

// Fetches a server resource, preferring live data but never blocking the UI:
// callers render `fallback` until (and unless) the server responds.
export function useApi(path, fallback, deps = []) {
  const [data, setData] = useState(fallback);
  const [live, setLive] = useState(false);

  const refresh = useCallback(async () => {
    const r = await api.get(path);
    if (r) { setData(r); setLive(true); }
    return !!r;
  }, [path]);

  useEffect(() => {
    let mounted = true;
    api.get(path).then((r) => {
      if (mounted && r) { setData(r); setLive(true); }
    });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps]);

  return { data, live, refresh };
}
