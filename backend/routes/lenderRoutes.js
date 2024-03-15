const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Lender = require('../models/Lender');
const authMiddleware = require('../middleware/authMiddleware');

// Lender Registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let lender = await Lender.findOne({ email });

    if (lender) {
      return res.status(400).json({ msg: 'Lender already exists' });
    }

    lender = new Lender({
      username,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    lender.password = await bcrypt.hash(password, salt);

    await lender.save();

    res.status(201).json({ msg: 'Lender registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Lender Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let lender = await Lender.findOne({ email });

    if (!lender) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, lender.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      lender: {
        id: lender.id,
      },
    };

    jwt.sign(
      payload,
      'jwtSecret',
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get Lender Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const lender = await Lender.findById(req.lender.id).select('-password');
    res.json(lender);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
