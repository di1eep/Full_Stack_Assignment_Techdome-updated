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
router.post('/apply-loan', authMiddleware, async (req, res) => {
  const { amount, tenure } = req.body;
  const customerId = req.customer.id; // Assuming you have middleware to get customer details

  try {
    // Check if amount and tenure are provided
    if (!amount || !tenure) {
      return res.status(400).json({ msg: 'Please provide both amount and tenure' });
    }

    // Check if the customer is eligible for a loan (Add your eligibility conditions here)
    // For example, if the customer has reached the maximum allowed active loans
    const activeLoansCount = await Loan.countDocuments({ customerId, status: 'approved' });
    if (activeLoansCount >= 2) {
      return res.status(400).json({ msg: 'You already have the maximum allowed active loans' });
    }

    // Determine the maximum allowed loan amount based on the number of previous loans
    let maxLoanAmount = 10000 + (activeLoansCount * 5000);
    maxLoanAmount = Math.min(maxLoanAmount, 50000); // Maximum allowed loan amount
    if (amount > maxLoanAmount) {
      return res.status(400).json({ msg: `Loan amount cannot exceed $${maxLoanAmount}` });
    }

    // Calculate interest rate based on tenure
    const interestRate = 42 * (tenure / 52);

    // Record the loan application
    const loan = new Loan({
      customerId,
      amount,
      tenure,
      interestRate,
      appliedAt: new Date(),
      status: 'pending',
    });

    await loan.save();

    res.status(201).json({ msg: 'Loan application submitted successfully', loan });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
