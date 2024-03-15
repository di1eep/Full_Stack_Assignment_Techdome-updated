const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../schemas/customerSchema');

// Customer Registration
router.post('/register', async (req, res) => {
  const { username, mobileNumber, email, password } = req.body;

  try {
    let customer = await Customer.findOne({ email });

    if (customer) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    customer = new Customer({
      username,
      mobileNumber,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(password, salt);

    await customer.save();

    res.status(201).json({ msg: 'Customer registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Customer Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the customer exists
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create and send a JWT token
    const token = jwt.sign({ customerId: customer._id }, 'your-secret-key', {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// apply loan 



module.exports = router;
