import React from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";

function LoansListTable({ loans }) {
  return (
    <>
      <h2>Customer Loans List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Loan ID</th>
            <th>Customer ID</th>
            <th>Amount</th>
            <th>Tenure</th>
            <th>Approval Status</th>
            <th>Loan Status</th>
            <th>Date Requested</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan._id}>
              <td>{loan._id}</td>
              <td>{loan.customer_id}</td>
              <td>{loan.amount}</td>
              <td>{loan.tenure}</td>
              <td>{loan.approval_status}</td>
              <td>{loan.loan_status}</td>
              <td>{new Date(loan.date_requested).toLocaleDateString()}</td>
              <td>
                {loan.approval_status === "APPROVED" ? (
                  <Link to={`/customer/loan/${loan._id}`}>
                    {" "}
                    {loan.loan_status === "PAID" ? "View" : "Pay"}
                  </Link>
                ) : (
                  "NA"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default LoansListTable;
