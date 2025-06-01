import BaseService from './base-service';
import { API_CONFIG } from '../api-config';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  store: {
    _id: string;
    name: string;
  };
  category: string;
  subcategory?: string;
  images: Array<{
    url: string;
    isDefault: boolean;
  }>;
  stock: {
    quantity: number;
    lowStockThreshold: number;
    trackInventory: boolean;
  };
  variants?: Array<{
    name: string;
    options: Array<{
      label: string;
      value: string;
      priceAdjustment: number;
      stock: number;
    }>;
  }>;
  attributes?: Array<{
    name: string;
    value: string;
  }>;
  tax: {
    rate: number;
    type: 'percentage' | 'fixed';
  };
  isAvailable: boolean;
  isFeatured: boolean;
  rating: {
    average: number;
    count: number;
  };
  tags: string[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

class ProductService extends BaseService {
  async getProducts(params?: {
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
  }): Promise<ProductListResponse> {
    return this.get<ProductListResponse>(API_CONFIG.endpoints.product.list, { params });
  }

  async getProductById(id: string): Promise<Product> {
    return this.get<Product>(API_CONFIG.endpoints.product.details(id));
  }

  async searchProducts(query: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
    subcategory?: string;
    store?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ProductListResponse> {
    return this.get<ProductListResponse>(API_CONFIG.endpoints.product.search, {
      params: {
        ...params,
        q: query
      }
    });
  }

  async getCategories(): Promise<string[]> {
    return this.get<string[]>(API_CONFIG.endpoints.product.categories);
  }

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    return this.get<Product[]>(API_CONFIG.endpoints.product.list, {
      params: {
        featured: true,
        limit
      }
    });
  }

  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    return this.get<Product[]>(`${API_CONFIG.endpoints.product.details(productId)}/related`, {
      params: { limit }
    });
  }
}

export const productService = new ProductService(); 