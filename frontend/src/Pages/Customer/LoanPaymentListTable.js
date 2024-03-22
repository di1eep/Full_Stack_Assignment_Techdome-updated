import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";

function LoanPaymentListTable() {
  const [loan, setLoan] = useState({});
  const [paymentAmount, setPaymentAmount] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("loanAppToken");
  let { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/loans/" + id, {
          headers: {
            Authorization: token,
          },
        });

        setLoan(response.data.loan);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [token, id]);

  const handleInputChange = (event) => {
    setPaymentAmount(event.target.value);
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/loans/customer/pay/${loan._id}`,
        { amount: paymentAmount },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Payment successful:", response.data);
      window.alert("Payment successful:");
      window.location.reload();
    } catch (error) {
      setError("Error processing payment. Please try again.");
      console.error("Error making payment:", error);
    }
  };

  return (
    <div>
      <h2>Loan Payments</h2>
      {error && <div className="error">{error}</div>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Repayment Date</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loan.loan_payments && loan.loan_payments.length > 0 ? (
            loan.loan_payments.map((payment) => (
              <tr key={payment._id}>
                <td>{new Date(payment.repayment_date).toLocaleDateString()}</td>
                <td>{payment.amount}</td>
                <td>{payment.paid}</td>
                <td>{payment.status}</td>
              </tr>
            ))
          ) : (
            <tr key={loan._id + "_no_payments"}>
              <td colSpan="4">No payments data found for this loan</td>
            </tr>
          )}
        </tbody>
      </Table>
      {loan.loan_status !== "PAID" && (
        <div className="d-flex gap-2">
          <label htmlFor="paymentAmount">Enter Payment Amount:</label>
          <input
            type="number"
            id="paymentAmount"
            name="paymentAmount"
            value={paymentAmount}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="btn btn-success"
            onClick={handlePayment}
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}

export default LoanPaymentListTable;
