const express = require('express');
require('module-alias/register');
const app = express();
app.use(express.json());
app.get('/', (req, res) => res.send('Product Service Running'));
module.exports = app;
if (require.main === module) {
  app.listen(process.env.PORT || 4003, () => console.log('Product service running'));
} 