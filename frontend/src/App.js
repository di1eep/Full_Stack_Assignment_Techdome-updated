import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import CustomerDashboard from "./Pages/Customer/CustomerDashboard";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import LoanPaymentListTable from "./Pages/Customer/LoanPaymentListTable";
import 'bootstrap/dist/css/bootstrap.css';
import MainPage from "./Pages/MainPage";

function App() {
  return (
    <>
      <MainPage/>
  

      <Routes>
        <Route path="customer/login" Component={LoginPage} />
        <Route path="admin/login" Component={LoginPage} />
        <Route path="customer/signup" Component={SignupPage} />
        <Route path="customer/dashboard" Component={CustomerDashboard}></Route>
        <Route path="admin/dashboard" Component={AdminDashboard}></Route>

        <Route path="customer/loan/:id" Component={LoanPaymentListTable} />
        <Route path="admin/loan/:id" Component={LoanPaymentListTable} />
      </Routes>
    </>
  );
}

export default App;
