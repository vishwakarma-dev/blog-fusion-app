const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  profile_picture: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bookmark' }]
}, 
{ 
   timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'} 
});

module.exports = mongoose.model('User', UserSchema);
