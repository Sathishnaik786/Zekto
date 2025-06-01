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
├── frontend/           # React frontend application
├── backend/           # Node.js backend services
│   ├── services/     # Microservices
│   │   ├── auth-service/
│   │   ├── delivery-service/
│   │   └── order-service/
│   └── common/       # Shared code and utilities
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