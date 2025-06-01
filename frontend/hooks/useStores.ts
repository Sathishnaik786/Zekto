import { useState, useEffect } from 'react';
import { storeService, Store, StoreListResponse } from '../lib/api/store-service';

interface UseStoresOptions {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  search?: string;
  sort?: string;
  location?: { lat: number; lng: number };
  radius?: number; 
}

export function useStores(options: UseStoresOptions = {}) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(options.page || 1);
  const [limit] = useState(options.limit || 10);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);

      let response: StoreListResponse;
      
      if (options.location) {
        const nearbyStores = await storeService.getNearbyStores(
          options.location,
          options.radius
        );
        response = {
          stores: nearbyStores,
          total: nearbyStores.length,
          page: 1,
          limit: nearbyStores.length
        };
      } else if (options.search) {
        response = await storeService.searchStores(options.search, {
          page,
          limit,
          type: options.type,
          category: options.category,
          sort: options.sort
        });
      } else {
        response = await storeService.getStores({
          page,
          limit,
          type: options.type,
          category: options.category,
          sort: options.sort
        });
      }

      setStores(response.stores);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stores'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [page, limit, options.type, options.category, options.search, options.sort, options.location]);

  const refetch = () => {
    fetchStores();
  };

  return {
    stores,
    loading,
    error,
    total,
    page,
    setPage,
    refetch
  };
}

export function useStore(id: string) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await storeService.getStoreById(id);
        setStore(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch store'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStore();
    }
  }, [id]);

  return { store, loading, error };
} 