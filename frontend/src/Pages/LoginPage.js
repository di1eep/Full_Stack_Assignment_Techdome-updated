import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate,useLocation ,Link } from "react-router-dom";



const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      const token = response.data.token;

      console.log("Login Successful:", token);
      window.alert("Login Successful: Redirecting to Dashboard");


      localStorage.setItem("loanAppToken",token);

      if(location.pathname === "/customer/login"){
        navigate("/customer/dashboard");
      }
      else if(location.pathname === "/admin/login"){
        navigate("/admin/dashboard");
      }
      
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
     
    <>


    <Container className="container">
        

      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2>Login</h2>
          {error && <p className="text-danger">{error}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" className="mt-2" type="submit">
              Submit
            </Button>
            <Link to="/customer/signup">
                 <p>New to Loan App ?</p> 
                <button type="button">SignUp</button>
             </Link>
          </Form>
        </Col>
      </Row>
    </Container>
    </>
    
  );
};

export default LoginPage;
