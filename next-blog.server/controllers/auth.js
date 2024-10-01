const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
// Register new user
exports.register = async (req, res) => {
    const { first_name, last_name, email_id, password, mobile_number } = req.body;
  
    try {
      let user = await User.findOne({ email_id });
      if (user) {
        return res.status(400).json({ msg: 'User already exists!' });
      }
  
      user = await User.findOne({ mobile_number });
      if (user) {
        return res.status(400).json({ msg: 'Mobile number already in use' });
      }
  
      user = new User({
        first_name,
        last_name,
        email_id,
        mobile_number,  // Include mobile number
        password: await bcrypt.hash(password, 10), // Hash password
      });
  
      await user.save();
  
      const payload = {
        user: {
          id: user.id,
        },
      };
  
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  };
  
// Login user
exports.login = async (req, res) => {
    const { email_id, mobile_number, password } = req.body;
  
    try {
      // Find by email or mobile number
      const user = await User.findOne({ $or: [{ email_id }, { mobile_number }] });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const payload = {
        user: {
          id: user.id,
        },
      };
  
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  };
  