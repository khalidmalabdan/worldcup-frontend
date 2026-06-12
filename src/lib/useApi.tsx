import { useState, useEffect } from "react";

export function useApi<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fn()
      .then((res) => mounted && setData(res))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, deps);

  return { data, loading };
}
