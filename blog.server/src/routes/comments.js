const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:post_id', authMiddleware, commentController.addComment);
router.put('/:id', authMiddleware, commentController.editComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);
router.get('/:post_id', commentController.getCommentsByPost);

module.exports = router;
