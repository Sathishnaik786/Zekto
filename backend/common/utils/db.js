const mongoose = require('mongoose');

// Database configurations
const databases = {
  main: {
    name: process.env.MONGODB_DATABASE || 'quickapp',
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/quickapp'
  },
  local: {
    name: 'quicklocal',
    uri: process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/quicklocal'
  },
  customer: {
    name: 'quickcustomer',
    uri: process.env.MONGODB_CUSTOMER_URI || 'mongodb://localhost:27017/quickcustomer'
  },
  merchant: {
    name: 'quickmerchant',
    uri: process.env.MONGODB_MERCHANT_URI || 'mongodb://localhost:27017/quickmerchant'
  },
  delivery: {
    name: 'quickdelivery',
    uri: process.env.MONGODB_DELIVERY_URI || 'mongodb://localhost:27017/quickdelivery'
  }
};

// Connection options
const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  retryReads: true
};

// Store connections
const connections = {};

// Connect to a specific database
const connectToDatabase = async (dbKey) => {
  try {
    const dbConfig = databases[dbKey];
    if (!dbConfig) {
      throw new Error(`Database configuration for ${dbKey} not found`);
    }

    const conn = await mongoose.createConnection(dbConfig.uri, options);

    // Handle connection events
    conn.on('connected', () => {
      console.log(`MongoDB Connected to ${dbConfig.name}:`, conn.host);
    });

    conn.on('error', (err) => {
      console.error(`MongoDB connection error for ${dbConfig.name}:`, err);
    });

    conn.on('disconnected', () => {
      console.log(`MongoDB disconnected from ${dbConfig.name}`);
    });

    connections[dbKey] = conn;
    return conn;
  } catch (error) {
    console.error(`Error connecting to ${databases[dbKey].name}:`, error);
    throw error;
  }
};

// Connect to all databases
const connectDB = async () => {
  try {
    // Connect to main database first
    await connectToDatabase('main');

    // Connect to other databases
    for (const dbKey of Object.keys(databases)) {
      if (dbKey !== 'main') {
        try {
          await connectToDatabase(dbKey);
        } catch (error) {
          console.error(`Failed to connect to ${databases[dbKey].name}:`, error);
          // Continue with other databases even if one fails
        }
      }
    }

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await disconnectDB();
        console.log('All MongoDB connections closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB disconnection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Error in connectDB:', error);
    process.exit(1);
  }
};

// Disconnect from all databases
const disconnectDB = async () => {
  try {
    for (const [key, conn] of Object.entries(connections)) {
      await conn.close();
      console.log(`MongoDB disconnected from ${databases[key].name}`);
    }
    connections = {};
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
};

// Get connection for a specific database
const getConnection = (dbKey) => {
  if (!connections[dbKey]) {
    throw new Error(`No connection found for database ${dbKey}`);
  }
  return connections[dbKey];
};

module.exports = {
  connectDB,
  disconnectDB,
  getConnection,
  databases
}; 