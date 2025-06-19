const express = require('express');
const router = express.Router();
const postController = require('../controllers/blogPostController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/slug/:slug', postController.getPostBySlug);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;
