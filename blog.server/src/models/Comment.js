const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  replies: [{ 
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    created_at: { type: Date, default: Date.now }
  }]
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

module.exports = mongoose.model('Comment', CommentSchema);
