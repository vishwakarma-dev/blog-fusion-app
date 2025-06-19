const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  post_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'BlogPost', 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// To avoid duplicate bookmarks for the same user and post
bookmarkSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
