const { execSync } = require('child_process');
const path = require('path');

const services = [
  'admin-service',
  'customer-service',
  'delivery-service',
  'merchant-service',
  'order-service',
  'product-service',
  'auth-service'
];

const commonDependencies = [
  'express',
  'mongoose',
  'cors',
  'dotenv'
];

services.forEach(service => {
  console.log(`Installing dependencies for ${service}...`);
  try {
    const servicePath = path.join(__dirname, 'services', service);
    execSync(`cd ${servicePath} && npm install ${commonDependencies.join(' ')}`, { stdio: 'inherit' });
    console.log(`✅ Dependencies installed for ${service}`);
  } catch (error) {
    console.error(`❌ Failed to install dependencies for ${service}:`, error);
  }
}); 