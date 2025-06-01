const { spawn } = require('child_process');
const path = require('path');

const services = [
  {
    name: 'Admin Service',
    script: path.join(__dirname, 'services/admin-service/src/server.js'),
    env: { PORT: 3001 }
  },
  {
    name: 'Customer Service',
    script: path.join(__dirname, 'services/customer-service/src/server.js'),
    env: { PORT: 3002 }
  },
  {
    name: 'Delivery Service',
    script: path.join(__dirname, 'services/delivery-service/src/server.js'),
    env: { PORT: 3003 }
  },
  {
    name: 'Merchant Service',
    script: path.join(__dirname, 'services/merchant-service/src/server.js'),
    env: { PORT: 3004 }
  },
  {
    name: 'Order Service',
    script: path.join(__dirname, 'services/order-service/src/server.js'),
    env: { PORT: 3005 }
  },
  {
    name: 'Product Service',
    script: path.join(__dirname, 'services/product-service/src/server.js'),
    env: { PORT: 3006 }
  },
  {
    name: 'Auth Service',
    script: path.join(__dirname, 'services/auth-service/src/server.js'),
    env: { PORT: 3007 }
  }
];

services.forEach(service => {
  const child = spawn('node', [service.script], {
    env: { ...process.env, ...service.env },
    stdio: 'inherit'
  });

  child.on('error', (error) => {
    console.error(`Error starting ${service.name}:`, error);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`${service.name} exited with code ${code}`);
    }
  });
});
