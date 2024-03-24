const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const newsController = require('../controllers/newsController');

router.get('/news', newsController.getAllNewsPosts);
router.get('/news/:id', newsController.getNewsPostById);
router.post('/newsposts', upload, newsController.createNewsPost);
router.delete('/news/:id', newsController.deleteNewsPost);
router.delete('/news/remove-image/:id', newsController.removeImageNewsPost);
router.put('/news/:id', upload, newsController.editNewsPost);

module.exports = router;