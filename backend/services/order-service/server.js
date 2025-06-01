const express = require('express');
require('module-alias/register');
const app = express();
app.use(express.json());
app.get('/', (req, res) => res.send('Order Service Running'));
module.exports = app;
if (require.main === module) {
  app.listen(process.env.PORT || 4005, () => console.log('Order service running'));
} 