import { useState, useEffect } from 'react';
import { productService, Product, ProductListResponse } from '../lib/api/product-service';

interface UseProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  store?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(options.page || 1);
  const [limit] = useState(options.limit || 12);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let response: ProductListResponse;
      
      if (options.search) {
        response = await productService.searchProducts(options.search, {
          page,
          limit,
          category: options.category,
          subcategory: options.subcategory,
          store: options.store,
          sort: options.sort,
          minPrice: options.minPrice,
          maxPrice: options.maxPrice
        });
      } else {
        response = await productService.getProducts({
          page,
          limit,
          category: options.category,
          subcategory: options.subcategory,
          store: options.store,
          sort: options.sort,
          minPrice: options.minPrice,
          maxPrice: options.maxPrice,
          inStock: options.inStock,
          featured: options.featured
        });
      }

      setProducts(response.products);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    page,
    limit,
    options.category,
    options.subcategory,
    options.store,
    options.search,
    options.sort,
    options.minPrice,
    options.maxPrice,
    options.inStock,
    options.featured
  ]);

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    total,
    page,
    setPage,
    refetch
  };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch product'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
}

export function useFeaturedProducts(limit: number = 10) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getFeaturedProducts(limit);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch featured products'));
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  return { products, loading, error };
}

export function useRelatedProducts(productId: string, limit: number = 4) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getRelatedProducts(productId, limit);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch related products'));
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRelatedProducts();
    }
  }, [productId, limit]);

  return { products, loading, error };
} 