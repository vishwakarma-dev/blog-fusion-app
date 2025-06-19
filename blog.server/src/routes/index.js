const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const postRoutes = require('./posts');
const likeRoutes = require('./likes');
const commentRoutes = require('./comments');
const bookmarkRoutes = require('./bookmarks');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/bookmarks', bookmarkRoutes);
router.use('/likes', likeRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
