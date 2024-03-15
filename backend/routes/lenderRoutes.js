const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Lender = require('../models/Lender');
const Loan = require('../models/Loan');
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

// Lender approves or rejects a loan application
router.put('/approve-loan/:loanId', authMiddleware, async (req, res) => {
  const lenderId = req.lender.id;
  const { loanId } = req.params;
  const { action } = req.body; // 'approve' or 'reject'

  try {
    // Check if the loan exists
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ msg: 'Loan not found' });
    }

    // Check if the lender is authorized to approve/reject this loan
    if (loan.lenderId.toString() !== lenderId) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    // Check if the loan is pending approval
    if (loan.status !== 'pending') {
      return res.status(400).json({ msg: 'Loan is not pending approval' });
    }

    // Update loan status based on lender action
    if (action === 'approve') {
      loan.status = 'approved';
    } else if (action === 'reject') {
      loan.status = 'rejected';
    } else {
      return res.status(400).json({ msg: 'Invalid action' });
    }

    await loan.save();

    res.json({ msg: 'Loan updated successfully', loan });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
