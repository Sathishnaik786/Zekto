const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'auth ok' }));

module.exports = router; 