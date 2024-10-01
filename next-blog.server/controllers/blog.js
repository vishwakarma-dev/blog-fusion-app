const Blog = require('../models/Blog'); // Adjust the path as necessary

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, content, header_image, created_by } = req.body; // Assuming createdBy is passed in the request body
    const new_blog = new Blog({ title, content, header_image, created_by });
    
    await new_blog.save();
    return res.status(201).json({ message: 'Blog created successfully', blog: new_blog });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Get all blog posts (with optional search query)
exports.getBlogs = async (req, res) => {
  try {
    const { search } = req.query; // Assuming search parameter is passed in the query
    const filter = search ? { title: new RegExp(search, 'i') } : {};
    
    const blogs = await Blog.find(filter).populate('created_by updated_by');
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a specific blog post by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.query.id).populate('created_by updated_by');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a blog PUT
exports.editBlog = async (req, res) => {
  try {
    const updated_blog = await Blog.findByIdAndUpdate(
      req.query.id,
      { ...req.body, updated_by: req.body.updated_by }, // Assuming updatedBy is passed in the request body
      { new: true, runValidators: true }
    );

    if (!updated_blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    return res.status(200).json({ message: 'Blog updated successfully', blog: updated_blog });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Patch a blog post (for partial updates)
exports.updateBlog = async (req, res) => {
  try {
    const updated_blog = await Blog.findByIdAndUpdate(
      req.query.id,
      { ...req.body, updated_by: req.body.updated_by }, // Assuming updatedBy is passed in the request body
      { new: true, runValidators: true }
    );

    if (!updated_blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    return res.status(200).json({ message: 'Blog patched successfully', blog: updated_blog });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const deleted_blog = await Blog.findByIdAndDelete(req.query.id);
    if (!deleted_blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
