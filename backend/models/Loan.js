const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: Number, required: true },
  tenure: { type: Number, required: true },
  date_requested: { type: Date, default: Date.now },
  approval_status: {
    type: String,
    enum: ["PENDING", "APPROVED"],
    default: "PENDING",
  },
  loan_payments: [
    {
      repayment_date: { type: Date },
      amount: { type: Number },
      paid: { type: Number },
      status: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" },
    },
  ],
  loan_status: {
    type: String,
    enum: ["NA","PENDING", "PAID"],
    default: "NA",
  },
});

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
