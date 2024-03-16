const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Lender = require("../schemas/lenderSchema"); // Ensure correct path to Lender schema
const Loan = require("../schemas/loanSchema");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Signup Lender ✅
router.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingLender = await Lender.findOne({ email });
    if (existingLender) {
      return res.status(400).send("Lender already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const lender = new Lender({
      username,
      password: hashedPassword,
      email,
    });
    await lender.save();
    res.status(201).send("Lender created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating lender");
  }
});

// Login Lender ✅
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const lender = await Lender.findOne({ email });
    if (!lender) {
      return res.status(404).send("Lender not found");
    }
    const isMatch = await bcrypt.compare(password, lender.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    const token = jwt.sign(
      { id: lender._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
});

// Loans Route
router.get("/loans", authenticateToken, async (req, res) => {
  try {
    const loans = await Loan.find({})
      .populate({
        path: "lender",
        select: "username email", // Update to fields needed from Lender schema
      });

    const loansWithDetails = loans.map((loan) => ({
      loanId: loan._id.toString(),
      loanDate: loan.appliedAt,
      lender: { username: loan.lender.username, email: loan.lender.email },
      amount: loan.amount,
      tenure: loan.tenure,
      interestRate: loan.interestRate,
      status: loan.status,
    }));

    res.status(200).send(loansWithDetails);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching loans");
  }
});

// Approve or Reject Loan
router.patch("/loans/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const loan = await Loan.findById(id);
    if (!loan) return res.status(404).send("Loan not found");
    loan.status = status;
    await loan.save();
    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating loan status");
  }
});

module.exports = router;
