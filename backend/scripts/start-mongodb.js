const { spawn } = require('child_process');
const path = require('path');

// MongoDB data directory
const dataDir = path.join(__dirname, '../data/db');

// Start MongoDB
const mongod = spawn('mongod', [
  '--dbpath', dataDir,
  '--port', '27017'
]);

mongod.stdout.on('data', (data) => {
  console.log(`MongoDB stdout: ${data}`);
});

mongod.stderr.on('data', (data) => {
  console.error(`MongoDB stderr: ${data}`);
});

mongod.on('close', (code) => {
  console.log(`MongoDB process exited with code ${code}`);
}); 