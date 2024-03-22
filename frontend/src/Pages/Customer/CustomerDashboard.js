import React, { useState, useEffect } from "react";
import LoansListTable from "./LoansListTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import NewLoanModal from "./NewLoanModal";

function CustomerDashboard() {
  const [loans, setLoans] = useState([]);
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("loanAppToken");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/loans/customer",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setLoans(response.data.loans);
      } catch (error) {
        console.error("Error fetching data:", error.response.status);
        if (error.response.status === 401) {
          navigate("/customer/login");
        }
      }
    };
    fetchData();
  }, [navigate, token]);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleTenureChange = (event) => {
    setTenure(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/loans",
        {
          amount: amount,
          tenure: tenure,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("New loan request created:", response.data);
      setAmount("");
      setTenure("");
      setError("");
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      setError("Error creating loan request. Please try again.");
      console.error("Error creating loan request:", error);
    }
  };

  return (
    <div>
      <p className="my-6">Customer Dashboard</p>
      <Button onClick={() => setShowModal(true)}>New Loan</Button>
      <NewLoanModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleSubmit={handleSubmit}
        amount={amount}
        handleAmountChange={handleAmountChange}
        tenure={tenure}
        handleTenureChange={handleTenureChange}
        error={error}
      />
      {loans.length > 0 ? <LoansListTable loans={loans} /> : "No Loans to show"}
    </div>
  );
}

export default CustomerDashboard;
