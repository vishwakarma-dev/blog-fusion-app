const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  tags: [String],
  image_URL: { type: String, default: '' }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'} 
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
