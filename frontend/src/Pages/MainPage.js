import React from 'react';
import { Link, useLocation } from "react-router-dom";

function MainPage() {
  const location = useLocation();
  const currentPathname = location.pathname;
  const dummyText = "This is a loan app estrablished on a date which is very reputable from so and so online sources and backed by backs and ours is a nbfc under rbi so take loans haselfree and stay free."; // Define the dummy text


  return (
    <div>
      <nav>
        <ul className="nav nav-pills">
          <li className="nav-item">
            <Link className={`nav-link ${currentPathname === "/" ? "active" : ""}`} aria-disabled="true" to="/"> Loan App </Link>
          </li>

          <li className="nav-item"> <Link className={`nav-link ${currentPathname === "/customer/login" ? "active" : ""}`} aria-current="page" to="customer/login" >Customer Login </Link> </li>

          <li className="nav-item"> <Link className={`nav-link ${currentPathname === "/admin/login" ? "active" : ""}`} to="admin/login"> Admin Login </Link>

          </li> <li className="nav-item"> <Link className="nav-link" to="/">About Loan App</Link> </li>
          
        </ul>
      </nav>
      <p>{currentPathname === "/" && dummyText}</p>
    </div>
  );
}

export default MainPage;
