export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      refresh: '/api/auth/refresh',
      me: '/api/auth/me'
    },
    customer: {
      profile: '/api/customer/profile',
      orders: '/api/customer/orders',
      addresses: '/api/customer/addresses',
      favorites: '/api/customer/favorites'
    },
    merchant: {
      profile: '/api/merchant/profile',
      stores: '/api/merchant/stores',
      products: '/api/merchant/products',
      orders: '/api/merchant/orders'
    },
    delivery: {
      profile: '/api/delivery/profile',
      orders: '/api/delivery/orders',
      earnings: '/api/delivery/earnings'
    },
    store: {
      list: '/api/stores',
      details: (id: string) => `/api/stores/${id}`,
      products: (id: string) => `/api/stores/${id}/products`,
      reviews: (id: string) => `/api/stores/${id}/reviews`
    },
    product: {
      list: '/api/products',
      details: (id: string) => `/api/products/${id}`,
      search: '/api/products/search',
      categories: '/api/products/categories'
    },
    order: {
      create: '/api/orders',
      details: (id: string) => `/api/orders/${id}`,
      status: (id: string) => `/api/orders/${id}/status`,
      cancel: (id: string) => `/api/orders/${id}/cancel`
    }
  }
}; 