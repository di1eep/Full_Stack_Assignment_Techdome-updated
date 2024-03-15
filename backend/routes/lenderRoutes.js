const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Lender = require('../schemas/lenderSchema');

// Lender Registration
router.post('/register', async (req, res) => {
  // Registration logic
});

// Lender Login
router.post('/login', async (req, res) => {
  // Login logic
});

module.exports = router;
