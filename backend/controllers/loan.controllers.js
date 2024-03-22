const Loan = require("../models/Loan");
const User = require("../models/User");

// for customers
const createLoan = async (req, res) => {
  try {
    const customer_id = req.userId;
    const customer = await User.findOne({ _id: customer_id, role: "customer" });
    if (!customer) {
      return res.status(401).json({ message: "Invalid Customer" });
    }
    const { amount, tenure } = req.body;
    const loan = new Loan({ customer_id, amount, tenure });

    const repaymentAmount = amount / tenure;

    const currentDate = new Date();
    for (let i = 0; i < tenure; i++) {
      const nextRepaymentDate = new Date(
        currentDate.getTime() + 7 * (i + 1) * 24 * 60 * 60 * 1000
      );
      loan.loan_payments.push({
        repayment_date: nextRepaymentDate,
        amount: repaymentAmount,
        paid: 0,
        status: "PENDING",
      });
    }

    await loan.save();
    return res.status(201).json({ message: "Loan created successfully", loan });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create loan" });
  }
};
const getLoansByCustomer = async (req, res) => {
  try {
    const customer_id = req.userId;
    const loans = await Loan.find({ customer_id: customer_id });
    return res.status(200).json({ loans });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get loans" });
  }
};
const makeLoanPayment = async (req, res) => {
  try {
    const { userId } = req;
    const { loanId } = req.params;
    let { amount } = req.body;
    let recievedAmount = amount;
    if (!loanId || !userId || !amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid input values" });
    }

    const loan = await Loan.findOne({ _id: loanId, customer_id: userId });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found for this user" });
    }

    let totalOutstandingAmount = 0;
    for (const payment of loan.loan_payments) {
      if (payment.status === "PENDING") {
        totalOutstandingAmount += payment.amount;
      }
    }

    if (totalOutstandingAmount === 0) {
      return res
        .status(400)
        .json({ message: "No pending payments for this loan" });
    }

    if (amount >= totalOutstandingAmount) {
      for (let i = 0; i < loan.loan_payments.length; i++) {
        const payment = loan.loan_payments[i];
        if (payment.status === "PENDING") {
          payment.status = "PAID";
          amount -= payment.amount;
          payment.status = "PAID";
          payment.paid = recievedAmount;
          recievedAmount = 0;
        }
      }

      if (amount > 0) {
        for (let i = 0; i < loan.loan_payments.length; i++) {
          const payment = loan.loan_payments[i];
          if (payment.status === "PENDING") {
            if (amount >= payment.amount) {
              payment.status = "PAID";
              payment.paid = recievedAmount;
              recievedAmount = 0;
              amount -= payment.amount;
            } else {
              payment.amount -= amount;
              payment.paid = recievedAmount;
              recievedAmount = 0;
              break;
            }

          }
        }
      }
      const allPaymentsDone = loan.loan_payments.every(
        (payment) => payment.status === "PAID"
      );
      if (allPaymentsDone) {
        loan.loan_status = "PAID";
      }
      await loan.save();
      return res.status(200).json({
        message:
          "Loan payment successful & Extra amount will be refunded to your account",
        loan,
      });
    } else {
      for (let i = 0; i < loan.loan_payments.length; i++) {
        const payment = loan.loan_payments[i];
        if (payment.status === "PENDING") {
          if (amount >= payment.amount) {
            payment.status = "PAID";
            amount -= payment.amount;
          } else {
            payment.amount -= amount;
            break;
          }
          payment.paid = recievedAmount;
          recievedAmount = 0;
        }
      }
    }

    await loan.save();
    return res.status(200).json({ message: "Loan payment successful", loan });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to process loan payment" });
  }
};

const getLoanById = async (req, res) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    return res.status(200).json({ loan });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get loan" });
  }
};

// for admins
const listLoans = async (req, res) => {
  try {
    const admin_id = req.userId;
    const admin = await User.findOne({ _id: admin_id, role: "admin" });
    if (!admin) {
      return res.status(401).json({ message: "You are unauthorized" });
    }
    const loans = await Loan.find().populate("customer_id");
    return res.status(200).json({ loans });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get loans" });
  }
};
const approveLoan = async (req, res) => {
  try {
    const admin_id = req.userId;
    const admin = await User.findOne({ _id: admin_id, role: "admin" });
    if (!admin) {
      return res.status(401).json({ message: "You are unauthorized" });
    }
    const { loanId } = req.params;
    const loan = await Loan.findByIdAndUpdate(loanId, {
      approval_status: "APPROVED",
      loan_status: "PENDING",
    });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    return res
      .status(200)
      .json({ message: "Loan approved successfully", loan });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to approve loan" });
  }
};

module.exports = {
  createLoan,
  approveLoan,
  makeLoanPayment,
  getLoanById,
  listLoans,
  getLoansByCustomer,
};
