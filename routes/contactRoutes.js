const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/submit-contact', contactController.submitContact);

module.exports = router;