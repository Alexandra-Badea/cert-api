const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const upload = require('../config/multerConfig');

router.get('/blog', blogController.getAllBlogPosts);
router.get('/blog/:id', blogController.getBlogPostsById);
router.post('/blogposts', upload, blogController.createBlogPost);
router.delete('/blog/:id', blogController.deleteBlogPost);
router.delete('/blog/remove-image/:id', blogController.removeImageBlogPost);
router.put('/blog/:id', upload, blogController.editBlogPost);

module.exports = router;