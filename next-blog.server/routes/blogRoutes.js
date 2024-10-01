const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, getBlogById, editBlog, updateBlog, deleteBlog } = require('../controllers/blog');

// @route GET /blogs/all
router.get('/all', getBlogs);

// @route GET /blogs/get/:id
router.get('/get', getBlogById);

// @route POST /blogs/create
router.post('/create', createBlog);

// @route EDIT /blogs/edit/:id
router.put('/edit', editBlog);

// @route PATCH /blogs/update/:id
router.patch('/update', updateBlog);

// @route DELETE /blogs/delete/:id
router.delete('/delete', deleteBlog);

module.exports = router;
