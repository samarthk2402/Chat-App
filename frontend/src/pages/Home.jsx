import React from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Container } from "react-bootstrap";
import "../styles/Navbar.css";

const Home = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.setItem("ACCESS_TOKEN", null);
    localStorage.setItem("REFRESH_TOKEN", null);
    navigate("/login");
  };

  return (
    <>
      <Nav className="flex-column vertical-nav">
        <Nav.Link href="#" className="text-white">
          Home
        </Nav.Link>
        <Nav.Link href="#" className="text-white">
          About
        </Nav.Link>
        <Nav.Link href="#" className="text-white">
          Services
        </Nav.Link>
        <Nav.Link href="#" className="text-white">
          Contact
        </Nav.Link>
        <Nav.Link
          href="#"
          className="text-white mt-auto logout-link"
          onClick={logout}
        >
          Log out
        </Nav.Link>
      </Nav>
      <Container>
        <h1>Home</h1>
      </Container>
    </>
  );
};

export default Home;
