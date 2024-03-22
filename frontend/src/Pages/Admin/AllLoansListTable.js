import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import axios from "axios";

function AllLoansListTable({ loans }) {
  const token = localStorage.getItem("loanAppToken");
  const navigate = useNavigate();
  async function approveLoan(loanId) {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const response = await axios.put(
        `http://localhost:5000/loans/${loanId}/approve`,
        null, 
        config 
      );

      if (response) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error fetching data:", error.response.status);
      if (error.response.status === 401) {

        navigate("/admin/login");
      }
    }
  }


  return (
    <>
      <h2>Loans List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Loan ID</th>
            <th>Customer ID</th>
            <th>Customer Email</th>
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
              <td>{loan.customer_id._id}</td>
              <td>{loan.customer_id.email}</td>
              <td>{loan.amount}</td>
              <td>{loan.tenure}</td>
              <td>
                {loan.approval_status === "APPROVED" ? (
                  "Approved"
                ) : (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => approveLoan(loan._id)}
                  >
                    Approve Now
                  </button>
                )}
              </td>
              <td>{loan.loan_status}</td>
              <td>{new Date(loan.date_requested).toLocaleDateString()}</td>
              <td>
                {loan.approval_status === "APPROVED" ? (
                  <Link to={`/admin/loan/${loan._id}`}>View</Link>
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

export default AllLoansListTable;
