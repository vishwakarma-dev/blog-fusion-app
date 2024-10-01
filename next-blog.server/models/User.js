const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  mobile_number: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+\d{1,3}\d{10}$/, 'Please enter a valid mobile number!']
  },
  email_id: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('User', UserSchema);
