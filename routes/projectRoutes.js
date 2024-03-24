const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const upload = require('../config/multerConfig');

router.get('/projects/:projectType', projectController.getAllProjectsPosts);
router.get('/projects/:projectType/:projectId', projectController.getProjectPostsById);
router.post('/projectposts', upload, projectController.createProjectPost);
router.delete('/projects/:id', projectController.deleteProjectPost);
router.delete('/projects/remove-image/:id', projectController.removeImageBlogPost);
router.put('/projects/:id', upload, projectController.editProjectPost);

module.exports = router;