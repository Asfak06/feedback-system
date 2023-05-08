import React, { useState } from "react";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "password") {
      setCookie("loggedIn", true, { path: "/" });
      router.push("/admin/dashboard");
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <h1 className="text-center mb-4">Admin Login</h1>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
