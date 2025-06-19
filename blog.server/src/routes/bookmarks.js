const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:post_id', authMiddleware, bookmarkController.addBookmark);
router.delete('/:post_id', authMiddleware, bookmarkController.removeBookmark);
router.get('/', authMiddleware, bookmarkController.getUserBookmarks);

module.exports = router;
