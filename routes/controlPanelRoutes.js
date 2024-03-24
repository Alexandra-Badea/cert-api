const express = require('express');
const router = express.Router();
const controlPanelController = require('../controllers/controlPanelController');

router.get('/dashboard', controlPanelController.dashboard);

module.exports = router;