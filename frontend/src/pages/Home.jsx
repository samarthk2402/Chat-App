import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Container, Navbar } from "react-bootstrap";
import "../styles/Navbar.css";
import {
  BoxArrowLeft,
  PlusLg,
  Search,
  PeopleFill,
} from "react-bootstrap-icons";
import CreateRoom from "../components/CreateRoom";
import ChatRoom from "../components/ChatRoom";
import JoinRoom from "../components/JoinRoom";

const Home = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [page, setPage] = useState("none");
  const [rooms, setRooms] = useState([{ name: "Loading..." }]);

  const username = localStorage.getItem("USERNAME");
  //const email = localStorage.getItem("EMAIL");

  const logout = () => {
    localStorage.setItem("ACCESS_TOKEN", null);
    localStorage.setItem("REFRESH_TOKEN", null);
    navigate("/login");
  };

  const getRooms = async () => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    const options = {
      method: "GET",
      headers: {
        // prettier-ignore
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const res = await fetch(apiUrl + "/rooms", options);
    try {
      const data = await res.json();
      setRooms(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <>
      <Nav className="flex-column vertical-nav">
        <Navbar.Brand style={{ marginLeft: "auto", marginRight: "auto" }}>
          <h5>{username}</h5>
        </Navbar.Brand>
        <Nav.Link className="text-white" onClick={() => setPage("newroom")}>
          <PlusLg style={{ marginRight: "10px" }} />
          New room
        </Nav.Link>
        <Nav.Link className="text-white" onClick={() => setPage("joinroom")}>
          <Search style={{ marginRight: "10px" }} />
          Join Room
        </Nav.Link>

        {rooms.map((room) => (
          <Nav.Link
            key={room.id}
            href="#"
            className="text-white"
            onClick={() => setPage(room)}
          >
            <PeopleFill style={{ marginRight: "10px" }} />
            {room.name}
          </Nav.Link>
        ))}

        <Nav.Link
          href="#"
          className="text-white mt-auto logout-link"
          onClick={logout}
        >
          <BoxArrowLeft style={{ marginRight: "10px" }} /> Log out
        </Nav.Link>
      </Nav>
      <Container>
        {page === "none" ? (
          <h3 style={{ textAlign: "center" }}>
            Join or create a Chat Room to get started!
          </h3>
        ) : page === "newroom" ? (
          <CreateRoom callback={getRooms} />
        ) : page === "joinroom" ? (
          <JoinRoom getRooms={getRooms} openRoom={setPage} />
        ) : rooms.includes(page) ? (
          <ChatRoom room={page} />
        ) : null}
      </Container>
    </>
  );
};

export default Home;
