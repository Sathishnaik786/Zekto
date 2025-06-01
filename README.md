# QuickApp

A full-stack application with frontend and backend services.

## Environment Variables Setup

### Frontend Environment Variables (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_VERSION=v1

# Authentication
REACT_APP_AUTH_TOKEN_KEY=auth_token
REACT_APP_REFRESH_TOKEN_KEY=refresh_token

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_NOTIFICATIONS=true

# Third Party Services
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Backend Environment Variables (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/quickapp
MONGODB_URI_TEST=mongodb://localhost:27017/quickapp_test

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=noreply@quickapp.com

# Redis Configuration (if using)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AWS Configuration (if using)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name

# Payment Gateway (if using)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Logging
LOG_LEVEL=debug
```

### Auth Service Environment Variables (.env)
```env
# Service Configuration
AUTH_SERVICE_PORT=5001
AUTH_SERVICE_NAME=auth-service

# Database
AUTH_DB_URI=mongodb://localhost:27017/quickapp_auth

# JWT Configuration
AUTH_JWT_SECRET=your_auth_service_jwt_secret
AUTH_JWT_EXPIRES_IN=24h
AUTH_REFRESH_TOKEN_SECRET=your_auth_service_refresh_secret
AUTH_REFRESH_TOKEN_EXPIRES_IN=7d

# Password Reset
PASSWORD_RESET_TOKEN_EXPIRES_IN=1h
PASSWORD_RESET_URL=http://localhost:3000/reset-password

# Email Verification
EMAIL_VERIFICATION_TOKEN_EXPIRES_IN=24h
EMAIL_VERIFICATION_URL=http://localhost:3000/verify-email

# Rate Limiting
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX_REQUESTS=100
```

### Delivery Service Environment Variables (.env)
```env
# Service Configuration
DELIVERY_SERVICE_PORT=5002
DELIVERY_SERVICE_NAME=delivery-service

# Database
DELIVERY_DB_URI=mongodb://localhost:27017/quickapp_delivery

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Delivery Configuration
MAX_DELIVERY_RADIUS_KM=10
DELIVERY_FEE_BASE=5.00
DELIVERY_FEE_PER_KM=1.50

# Real-time Updates
SOCKET_IO_PORT=5003
SOCKET_IO_CORS_ORIGIN=http://localhost:3000

# Location Updates
LOCATION_UPDATE_INTERVAL_MS=30000
```

### Order Service Environment Variables (.env)
```env
# Service Configuration
ORDER_SERVICE_PORT=5004
ORDER_SERVICE_NAME=order-service

# Database
ORDER_DB_URI=mongodb://localhost:27017/quickapp_orders

# Payment Gateway
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Order Processing
ORDER_PROCESSING_TIMEOUT_MS=300000
MAX_ORDER_ITEMS=50
MIN_ORDER_AMOUNT=10.00

# Notifications
ORDER_NOTIFICATION_TOPIC=order-updates
```

### Notification Service Environment Variables (.env)
```env
# Service Configuration
NOTIFICATION_SERVICE_PORT=5005
NOTIFICATION_SERVICE_NAME=notification-service

# Database
NOTIFICATION_DB_URI=mongodb://localhost:27017/quickapp_notifications

# Firebase Cloud Messaging
FCM_SERVER_KEY=your_fcm_server_key
FCM_SENDER_ID=your_fcm_sender_id

# Email Service
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=noreply@quickapp.com

# Push Notifications
PUSH_NOTIFICATION_BATCH_SIZE=100
PUSH_NOTIFICATION_INTERVAL_MS=5000
```

### Payment Service Environment Variables (.env)
```env
# Service Configuration
PAYMENT_SERVICE_PORT=5006
PAYMENT_SERVICE_NAME=payment-service

# Database
PAYMENT_DB_URI=mongodb://localhost:27017/quickapp_payments

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_CURRENCY=usd

# Payment Processing
PAYMENT_TIMEOUT_MS=300000
MAX_PAYMENT_AMOUNT=10000.00
MIN_PAYMENT_AMOUNT=1.00

# Refund Configuration
REFUND_WINDOW_DAYS=30
AUTO_REFUND_THRESHOLD=100.00
```

## Project Setup

1. Clone the repository
```bash
git clone <repository-url>
cd quickapp
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables
- Copy the example environment variables above
- Create `.env` files in both frontend and backend directories
- Fill in the appropriate values for your environment

4. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm start
```

## Project Structure

```
quickapp/
├── frontend/                           # React frontend application
│   ├── public/                        # Public assets
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   │
│   ├── src/
│   │   ├── assets/                    # Static assets
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── styles/
│   │   │
│   │   ├── components/               # Reusable components
│   │   │   ├── common/              # Shared components
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Modal/
│   │   │   │   └── Loading/
│   │   │   │
│   │   │   ├── layout/              # Layout components
│   │   │   │   ├── Header/
│   │   │   │   ├── Footer/
│   │   │   │   ├── Sidebar/
│   │   │   │   └── Navigation/
│   │   │   │
│   │   │   └── features/            # Feature-specific components
│   │   │       ├── auth/
│   │   │       ├── orders/
│   │   │       ├── delivery/
│   │   │       └── payments/
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Dashboard/
│   │   │   ├── Orders/
│   │   │   ├── Profile/
│   │   │   └── Settings/
│   │   │
│   │   ├── services/               # API services
│   │   │   ├── api.js
│   │   │   ├── auth.service.js
│   │   │   ├── order.service.js
│   │   │   └── delivery.service.js
│   │   │
│   │   ├── utils/                 # Utility functions
│   │   │   ├── helpers.js
│   │   │   ├── validators.js
│   │   │   └── constants.js
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useOrders.js
│   │   │   └── useDelivery.js
│   │   │
│   │   ├── context/             # React Context
│   │   │   ├── AuthContext.js
│   │   │   └── AppContext.js
│   │   │
│   │   ├── routes/             # Route configurations
│   │   │   ├── PrivateRoute.js
│   │   │   └── PublicRoute.js
│   │   │
│   │   ├── App.js
│   │   ├── index.js
│   │   └── setupTests.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── backend/                      # Node.js backend services
│   ├── common/                  # Shared code and utilities
│   │   ├── config/             # Configuration files
│   │   │   ├── database.js
│   │   │   ├── redis.js
│   │   │   └── logger.js
│   │   │
│   │   ├── errors/            # Custom error classes
│   │   │   ├── AppError.js
│   │   │   └── ErrorHandler.js
│   │   │
│   │   ├── middleware/        # Shared middleware
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   └── error.js
│   │   │
│   │   ├── utils/            # Utility functions
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   │
│   │   └── constants/        # Shared constants
│   │       └── index.js
│   │
│   ├── services/            # Microservices
│   │   ├── auth-service/
│   │   │   ├── src/
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── authController.js
│   │   │   │   │   └── userController.js
│   │   │   │   │
│   │   │   │   ├── models/
│   │   │   │   │   ├── User.js
│   │   │   │   │   └── Token.js
│   │   │   │   │
│   │   │   │   ├── routes/
│   │   │   │   │   ├── auth.js
│   │   │   │   │   └── user.js
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   ├── authService.js
│   │   │   │   │   └── emailService.js
│   │   │   │   │
│   │   │   │   ├── utils/
│   │   │   │   │   └── validators.js
│   │   │   │   │
│   │   │   │   ├── app.js
│   │   │   │   └── server.js
│   │   │   │
│   │   │   ├── tests/
│   │   │   ├── .env
│   │   │   └── package.json
│   │   │
│   │   ├── delivery-service/
│   │   │   ├── src/
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── deliveryController.js
│   │   │   │   │   └── locationController.js
│   │   │   │   │
│   │   │   │   ├── models/
│   │   │   │   │   ├── Delivery.js
│   │   │   │   │   └── Location.js
│   │   │   │   │
│   │   │   │   ├── routes/
│   │   │   │   │   ├── delivery.js
│   │   │   │   │   └── location.js
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   ├── deliveryService.js
│   │   │   │   │   └── mapsService.js
│   │   │   │   │
│   │   │   │   ├── utils/
│   │   │   │   │   └── distance.js
│   │   │   │   │
│   │   │   │   ├── app.js
│   │   │   │   └── server.js
│   │   │   │
│   │   │   ├── tests/
│   │   │   ├── .env
│   │   │   └── package.json
│   │   │
│   │   ├── order-service/
│   │   │   ├── src/
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── orderController.js
│   │   │   │   │   └── paymentController.js
│   │   │   │   │
│   │   │   │   ├── models/
│   │   │   │   │   ├── Order.js
│   │   │   │   │   └── Payment.js
│   │   │   │   │
│   │   │   │   ├── routes/
│   │   │   │   │   ├── order.js
│   │   │   │   │   └── payment.js
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   ├── orderService.js
│   │   │   │   │   └── paymentService.js
│   │   │   │   │
│   │   │   │   ├── utils/
│   │   │   │   │   └── calculations.js
│   │   │   │   │
│   │   │   │   ├── app.js
│   │   │   │   └── server.js
│   │   │   │
│   │   │   ├── tests/
│   │   │   ├── .env
│   │   │   └── package.json
│   │   │
│   │   ├── notification-service/
│   │   │   ├── src/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── notificationController.js
│   │   │   │   │
│   │   │   │   ├── models/
│   │   │   │   │   └── Notification.js
│   │   │   │   │
│   │   │   │   ├── routes/
│   │   │   │   │   └── notification.js
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   ├── emailService.js
│   │   │   │   │   └── pushService.js
│   │   │   │   │
│   │   │   │   ├── utils/
│   │   │   │   │   └── templates.js
│   │   │   │   │
│   │   │   │   ├── app.js
│   │   │   │   └── server.js
│   │   │   │
│   │   │   ├── tests/
│   │   │   ├── .env
│   │   │   └── package.json
│   │   │
│   │   └── payment-service/
│   │       ├── src/
│   │       │   ├── controllers/
│   │       │   │   ├── paymentController.js
│   │       │   │   └── refundController.js
│   │       │   │
│   │       │   ├── models/
│   │       │   │   ├── Payment.js
│   │       │   │   └── Refund.js
│   │       │   │
│   │       │   ├── routes/
│   │       │   │   ├── payment.js
│   │       │   │   └── refund.js
│   │       │   │
│   │       │   ├── services/
│   │       │   │   ├── stripeService.js
│   │       │   │   └── refundService.js
│   │       │   │
│   │       │   ├── utils/
│   │       │   │   └── validators.js
│   │       │   │
│   │       │   ├── app.js
│   │       │   └── server.js
│   │       │
│   │       ├── tests/
│   │       ├── .env
│   │       └── package.json
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
└── README.md
```

## Development Guidelines

1. Always use environment variables for sensitive information
2. Never commit `.env` files to version control
3. Keep the `.env.example` files updated with any new variables
4. Use meaningful names for environment variables
5. Document any new environment variables in this README

## Security Notes

- Keep your environment variables secure and never commit them to version control
- Use strong, unique values for secrets and keys
- Regularly rotate sensitive credentials
- Use different environment variables for development and production
- Consider using a secrets management service for production deployments

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Update documentation if needed
4. Submit a pull request

## License

[Your License Here] 