import BaseService from './base-service';
import { API_CONFIG } from '../api-config';

export interface Store {
  _id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
  };
  businessHours: Array<{
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
  rating: {
    average: number;
    count: number;
  };
  status: string;
  isVerified: boolean;
}

export interface StoreListResponse {
  stores: Store[];
  total: number;
  page: number;
  limit: number;
}

class StoreService extends BaseService {
  async getStores(params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    search?: string;
    sort?: string;
  }): Promise<StoreListResponse> {
    return this.get<StoreListResponse>(API_CONFIG.endpoints.store.list, { params });
  }

  async getStoreById(id: string): Promise<Store> {
    return this.get<Store>(API_CONFIG.endpoints.store.details(id));
  }

  async getStoreProducts(id: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  }) {
    return this.get(API_CONFIG.endpoints.store.products(id), { params });
  }

  async getStoreReviews(id: string, params?: {
    page?: number;
    limit?: number;
    sort?: string;
  }) {
    return this.get(API_CONFIG.endpoints.store.reviews(id), { params });
  }

  async searchStores(query: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    sort?: string;
  }): Promise<StoreListResponse> {
    return this.get<StoreListResponse>(API_CONFIG.endpoints.store.list, {
      params: {
        ...params,
        search: query
      }
    });
  }

  async getNearbyStores(location: { lat: number; lng: number }, radius: number = 5): Promise<Store[]> {
    return this.get<Store[]>(API_CONFIG.endpoints.store.list, {
      params: {
        lat: location.lat,
        lng: location.lng,
        radius
      }
    });
  }
}

export const storeService = new StoreService(); 