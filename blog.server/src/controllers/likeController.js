const Like = require('../models/Like');

// Like a post
exports.likePost = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { post_id } = req.params;

    // Check if already liked
    const existingLike = await Like.findOne({ user_id, post_id });
    if (existingLike) return res.status(400).json({ message: 'Already liked' });

    const like = new Like({ user_id, post_id });
    await like.save();

    res.status(201).json({ message: 'Post liked', like });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error!', error: error.message });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { post_id } = req.params;

    const like = await Like.findOneAndDelete({ user_id, post_id });
    if (!like) return res.status(404).json({ message: 'Like not found!' });

    res.json({ message: 'Post unliked' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error!', error: error.message });
  }
};

// Get all likes on a post
exports.getLikesByPost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const likes = await Like.find({ post_id }).populate('user_id', 'full_name');
    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error!', error: error.message });
  }
};


exports.getUserLikedPosts = async (req, res) => {
  try {
    const user_id = req.user._id;
    const likes = await Like.find({ user_id });
    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server error!', error: error.message });
  }
};
