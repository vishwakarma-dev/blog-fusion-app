const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/user/', authMiddleware, likeController.getUserLikedPosts);
router.post('/:post_id', authMiddleware, likeController.likePost);
router.delete('/:post_id', authMiddleware, likeController.unlikePost);
router.get('/:post_id', likeController.getLikesByPost);

module.exports = router;
