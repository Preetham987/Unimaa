const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UIser');

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send({ error: 'User already exists.' });
    }

    user = new User({ username, password, role });
    await user.save();

    const token = jwt.sign({ _id: user._id, role: user.role }, 'your_jwt_secret');
    res.send({ token });
  } catch (err) {
    res.status(500).send({ error: 'Server error.' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, 'your_jwt_secret');
    res.send({ token });
  } catch (err) {
    res.status(500).send({ error: 'Server error.' });
  }
});

module.exports = router;
