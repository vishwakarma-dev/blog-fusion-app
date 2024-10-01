const mongoose = require('mongoose');

// Define the Blog schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
  },
  header_image: {
    type: String, // Store the path or filename of the uploaded image
    required: true, // You can set this to false if the image is optional
  },
  // Audit fields
  created_by: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a user model
    ref: 'User',
    required: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a user model
    ref: 'User'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // This will automatically add createdAt and updatedAt fields
});

// Add a pre-save hook for additional auditing logic if necessary
blogSchema.pre('save', function(next) {
  if (this.isNew) {
    this.created_by = this.created_by || this.updated_by; // Initial creator
  } else {
    this.updated_by = this.updated_by; // Set the user who last updated the post
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
