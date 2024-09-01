import express from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';

import User from '../models/User.js';

const router = express.Router();

router.route('/').get(async(req, res) => {

  try {
      const posts = await User.find({});

      res.status(200).json({ success: true, data: posts});
  } catch (error) {
      res.status(500).json({ success: false, message: error});
  }
  
});

// Create an API endpoint to handle user registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!email || !password) {
      throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
      throw Error('Email not valid');
    }
    /*if (!validator.isStrongPassword(password)) {
      throw Error('Password not strong enough');
    }*/

    const exists = await User.findOne({ email });

    if (exists) {
      throw Error('Email already in use');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ success: true, message: 'User registered successfully', name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

// Create an API endpoint to handle user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw Error('All fields must be filled');
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });

    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    res.json({ success: true, message: 'User logged in successfully', name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

export default router;