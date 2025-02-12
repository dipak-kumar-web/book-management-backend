
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookieOptions } from '../config/cookieConfig.js';
import { User } from '../models/user.model.js';

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
      if(!username || !password) {
        return res.status(400).json({ error: 'Please fill in all fields' });
      }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create new user
    const user = new User({ username, password });
    await user.save();

    // Generate token and set cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token, cookieOptions);

    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.cookie('token', token, cookieOptions);
  
      res.json({ 
        message: 'Login successful',
        user: { id: user._id, username: user.username }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


  export const logout = async (req, res) => {
    try {
      res.cookie('token', '', { 
        ...cookieOptions,
        maxAge: 0 
      });
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  
  export const getCurrentUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };