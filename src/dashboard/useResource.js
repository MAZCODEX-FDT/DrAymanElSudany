import { useCallback, useEffect, useState } from 'react';
import * as api from '@/lib/api';

export function useResource(r) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api.list(r));
    } finally {
      setLoading(false);
    }
  }, [r]);
  useEffect(() => {
    reload();
  }, [reload]);
  const create = async (x) => {
    const rec = await api.create(r, x);
    setItems((s) => [rec, ...s]);
    return rec;
  };
  const update = async (id, patch) => {
    setItems((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    await api.update(r, id, patch);
  };
  const remove = async (id) => {
    setItems((s) => s.filter((x) => x.id !== id));
    await api.remove(r, id);
  };
  return { items, loading, reload, create, update, remove };
}
