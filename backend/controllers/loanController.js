const Customer = require('../schemas/customerSchema');
const Loan = require('../schemas/loanSchema');

// Apply for a loan
exports.applyLoan = async (req, res) => {
  const { amount, tenure } = req.body;
  const customerId = req.customer.id; // Assuming you have middleware to get customer details

  try {
    // Check if the customer has reached the maximum allowed active loans
    const activeLoansCount = await Loan.countDocuments({ customerId, status: 'active' });
    if (activeLoansCount >= 2) {
      return res.status(400).json({ msg: 'You already have the maximum allowed active loans' });
    }

    // Determine the loan amount based on the number of previous loans
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
};

// Approve or reject a loan
exports.processLoan = async (req, res) => {
  const { loanId, status } = req.body;

  try {
    let loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ msg: 'Loan not found' });
    }

    if (loan.status !== 'pending') {
      return res.status(400).json({ msg: 'Loan has already been processed' });
    }

    loan.status = status;
    await loan.save();

    res.status(200).json({ msg: `Loan ${status} successfully`, loan });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
