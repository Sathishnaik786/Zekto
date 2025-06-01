export const API_BASE_URLS = {
  AUTH: process.env.NEXT_PUBLIC_API_URL_AUTH || 'http://localhost:4002',
  PRODUCTS: process.env.NEXT_PUBLIC_API_URL_PRODUCTS || 'http://localhost:4003',
  MERCHANTS: process.env.NEXT_PUBLIC_API_URL_MERCHANTS || 'http://localhost:4004',
  ORDERS: process.env.NEXT_PUBLIC_API_URL_ORDERS || 'http://localhost:4005',
  DELIVERY: process.env.NEXT_PUBLIC_API_URL_DELIVERY || 'http://localhost:4006',
  ADMIN: process.env.NEXT_PUBLIC_API_URL_ADMIN || 'http://localhost:4007'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    VERIFY_OTP: '/api/auth/verify-otp',
    PROFILE: '/api/auth/profile'
  },
  PRODUCTS: {
    LIST: '/api/products',
    DETAILS: '/api/products/:id',
    CATEGORIES: '/api/products/categories'
  },
  MERCHANTS: {
    LIST: '/api/merchants',
    DETAILS: '/api/merchants/:id',
    PRODUCTS: '/api/merchants/:id/products'
  },
  ORDERS: {
    CREATE: '/api/orders',
    LIST: '/api/orders',
    DETAILS: '/api/orders/:id',
    TRACK: '/api/orders/:id/track'
  },
  DELIVERY: {
    TASKS: '/api/delivery/tasks',
    ACCEPT: '/api/delivery/tasks/:id/accept',
    COMPLETE: '/api/delivery/tasks/:id/complete'
  },
  ADMIN: {
    USERS: '/api/admin/users',
    MERCHANTS: '/api/admin/merchants',
    ORDERS: '/api/admin/orders',
    ANALYTICS: '/api/admin/analytics'
  }
}; 