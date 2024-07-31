import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const CredentialsForm = ({ root, method }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
      }),
    };

    try {
      const res = await fetch(apiUrl + "/signup", options);
      if (!res.ok) {
        // Handle HTTP errors
        const errorData = await res.json();
        const userNameTaken =
          errorData.username && errorData.username[0].code === "unique";
        const emailTaken = errorData.msg === "email taken";
        if (userNameTaken && emailTaken) {
          window.alert(
            "The email you entered already has an account with the same username!"
          );
          return;
        } else if (userNameTaken) {
          window.alert("That username is taken!");
          return;
        } else if (emailTaken) {
          window.alert("An account with that email already exists!");
          return;
        }
      }

      const data = await res.json();

      localStorage.setItem("ACCESS_TOKEN", data.access);
      localStorage.setItem("REFRESH_TOKEN", data.refresh);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };

    try {
      const res = await fetch(apiUrl + "/token/", options);
      if (res.ok) {
        const token = await res.json();
        localStorage.setItem("ACCESS_TOKEN", token.access);
        localStorage.setItem("REFRESH_TOKEN", token.refresh);
        navigate("/");
      } else if (res.status === 401) {
        window.alert("Invalid login credentials!");
      } else {
        const error = await res.json();
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container style={{ maxWidth: "300px" }}>
      <Card style={{ padding: "20px" }}>
        <Form
          onSubmit={(e) =>
            method === "login" ? handleLogin(e) : handleSignup(e)
          }
        >
          <h3 style={{ marginBottom: "20px", textAlign: "center" }}>
            {method === "login" ? "Log In" : "Create an account"}
          </h3>

          {method === "signup" && (
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="primary" type="submit">
              {method === "login" ? "Log In" : "Create"}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default CredentialsForm;
