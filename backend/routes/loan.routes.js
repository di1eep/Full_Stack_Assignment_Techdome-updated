const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/AuthMiddleware");
const loanControllers = require("../controllers/loan.controllers");

router.post("/", authMiddleware, loanControllers.createLoan);
router.get("/customer", authMiddleware, loanControllers.getLoansByCustomer);
router.post(
  "/customer/pay/:loanId",
  authMiddleware,
  loanControllers.makeLoanPayment
);

router.get("/admin", authMiddleware, loanControllers.listLoans);
router.put("/:loanId/approve", authMiddleware, loanControllers.approveLoan);

router.get("/:loanId", authMiddleware, loanControllers.getLoanById);

module.exports = router;
