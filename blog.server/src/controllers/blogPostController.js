const BlogPost = require('../models/BlogPost');
const slugify = require('slugify');

// Create new blog post
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags, image_URL } = req.body;
    const author_id = req.user._id; // assuming req.user from auth middleware

    const slug = slugify(title, { lower: true, strict: true });

    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) return res.status(400).json({ message: 'Post with this title already exists' });

    const post = new BlogPost({ author_id, title, content, tags, image_URL, slug });
    await post.save();

    res.status(201).json({ message: 'Post created.', post });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error!', error: error.message });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().populate('author_id', 'full_name profile_picture').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error!', error: error.message });
  }
};

// Get single post by slug
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug }).populate('author_id', 'full_name profile_picture');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error!', error: error.message });
  }
};

// Update post (author or admin)
exports.updatePost = async (req, res) => {
  try {
    const post_id = req.params.id;
    const updates = req.body;

    // Optional: update slug if title changed
    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    const post = await BlogPost.findById(post_id);
    if (!post) return res.status(404).json({ message: 'Post not found!' });

    // Check ownership or admin - assumes req.user populated by auth middleware
    if (!post.author_id.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(post, updates);
    await post.save();

    res.json({ message: 'Post updated', post });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error!', error: error.message });
  }
};

// Delete post (author or admin)
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await BlogPost.findById(postId);
    console.log(post)
    if (!post) return res.status(404).json({ message: 'Post not found.' });

    if (!post.author_id.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error!', error: error.message });
  }
};
