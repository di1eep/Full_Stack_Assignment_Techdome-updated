import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AllLoansListTable from "./AllLoansListTable";
function AdminDashboard() {
  const [loans, setLoans] = useState([]);
  const token = localStorage.getItem("loanAppToken");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/loans/admin",
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
  return (
    <>
      <div>
        <p className="my-6">CustomerDashboard</p>
        {loans.length > 0 ? (
          <AllLoansListTable loans={loans} />
        ) : (
          "No Loans to show"
        )}
      </div>
    </>
  );
}

export default AdminDashboard;
