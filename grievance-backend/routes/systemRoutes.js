const express = require('express');
const router = express.Router();
const { getPublicStats } = require('../controllers/systemController');

// Public route - no protection
router.get('/stats', getPublicStats);

module.exports = router;
