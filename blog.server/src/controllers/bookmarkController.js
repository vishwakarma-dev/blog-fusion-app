const Bookmark = require('../models/Bookmark');

// Add bookmark
exports.addBookmark = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { post_id } = req.params;

    const existingBookmark = await Bookmark.findOne({ user_id, post_id });
    if (existingBookmark) return res.status(400).json({ message: 'Already bookmarked' });

    const bookmark = new Bookmark({ user_id, post_id });
    await bookmark.save();

    res.status(201).json({ message: 'Bookmark added', bookmark });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove bookmark
exports.removeBookmark = async (req, res) => {
  try {
    const user_id = req.user._id;
    const { post_id } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({ user_id, post_id });
    if (!bookmark) return res.status(404).json({ message: 'Bookmark not found' });

    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all bookmarks for user
exports.getUserBookmarks = async (req, res) => {
  try {
    const user_id = req.user._id;
    const bookmarks = await Bookmark.find({ user_id }).populate('post_id');
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
