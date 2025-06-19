const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      full_name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server error!', error: err.message });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      message: 'Signin successful.',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        bio: user.bio,
        profile_picture: user.profile_picture,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server error!!', error: err.message });
  }
};


// Inside controllers/auth.js or authController.js
exports.getCurrentUser = async (req, res) => {
  try {
    const user = req.user; // You must set this in your authMiddleware
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server error!', error: err.message });
  }
};