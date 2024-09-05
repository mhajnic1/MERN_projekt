import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from 'validator';

import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const { username, email, password, friends } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields must be filled' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    /*if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ success: false, message: 'Password is not strong enough' });
    }*/

    const existsUsername = await User.findOne({ username });
    if (existsUsername) {
      return res.status(400).json({ success: false, message: 'Username already in use' });
    }

    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      friends,
    });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields must be filled' });
    }

    const user = await User.findOne({ email: email });

    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};