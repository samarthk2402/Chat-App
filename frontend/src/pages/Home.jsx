import React from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Container, Navbar } from "react-bootstrap";
import "../styles/Navbar.css";
import { BoxArrowLeft, PlusLg, Search } from "react-bootstrap-icons";

const Home = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem("USERNAME");
  const email = localStorage.getItem("EMAIL");

  const logout = () => {
    localStorage.setItem("ACCESS_TOKEN", null);
    localStorage.setItem("REFRESH_TOKEN", null);
    navigate("/login");
  };

  return (
    <>
      <Nav className="flex-column vertical-nav">
        <Navbar.Brand style={{ marginLeft: "auto", marginRight: "auto" }}>
          <h5>{username}</h5>
        </Navbar.Brand>
        <Nav.Link href="#" className="text-white">
          <PlusLg style={{ marginRight: "10px" }} />
          New room
        </Nav.Link>
        <Nav.Link href="#" className="text-white">
          <Search style={{ marginRight: "10px" }} />
          Join Room
        </Nav.Link>
        <Nav.Link
          href="#"
          className="text-white mt-auto logout-link"
          onClick={logout}
        >
          <BoxArrowLeft style={{ marginRight: "10px" }} /> Log out
        </Nav.Link>
      </Nav>
      <Container>
        <h3 style={{ textAlign: "center" }}>
          Join a Chat Room to get started!
        </h3>
      </Container>
    </>
  );
};

export default Home;
