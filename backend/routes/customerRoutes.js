const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Customer = require("../schemas/customerSchema");
const Loan = require("../schemas/loanSchema");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const userId = new mongoose.Types.ObjectId();

// Register ✅
router.post("/register", async (req, res) => {
  try {
    const { username, email, mobileNumber, password, userType } = req.body;

    // Check if userType is customer
    if (userType !== "customer") {
      return res.status(400).send("Invalid user type");
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate random userId
    const userId = new mongoose.Types.ObjectId();

    // Create new customer with random userId
    const user = new Customer({
      userId,
      username,
      email,
      mobileNumber,
      password: hashedPassword,
      userType,
    });

    await user.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user: " + err.message);
  }
});

module.exports = router;

// Login ✅
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Customer.findOne({ email });

    // Check if user exists and is a customer
    if (!user || user.userType !== "customer") {
      return res.status(400).send("Invalid Email or Password");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid Email or Password");
    }

    const accessToken = jwt.sign(
      { email: user.email, userType: user.userType },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in: " + err.message);
  }
});


// Fetch Loans for Customer  ✅
router.get("/loans", authenticateToken, async (req, res) => {
  try {
    // Check if user is authenticated and is a customer
    if (req.user.userType !== "customer") {
      return res.status(400).send("Invalid user type");
    }

    const user = await Customer.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const loans = await Loan.find({ customerId: user._id });
    res.json(loans);
  } catch (err) {
    console.error("Error fetching loans:", err);
    res.status(500).send("Error fetching loans: " + err.message);
  }
});



// Apply for Loan  ✅
// Assuming the Loan schema is correctly defined as shown in your previous code

router.post('/apply-loan', authenticateToken, async (req, res) => {
  const { amount, tenure } = req.body;
  const customerId = req.user.userId; // Use req.user.userId to get the customer ID

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
      customerId, // Assign the customerId here
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
