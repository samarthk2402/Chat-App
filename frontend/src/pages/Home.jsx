import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Container, Navbar, Collapse, Card } from "react-bootstrap";
import "../styles/Navbar.css";
import {
  BoxArrowLeft,
  PlusLg,
  Search,
  PeopleFill,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";
import CreateRoom from "../components/CreateRoom";
import ChatRoom from "../components/ChatRoom";
import JoinRoom from "../components/JoinRoom";

const Home = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [page, setPage] = useState("none");
  const [rooms, setRooms] = useState([{ name: "Loading..." }]);
  const [navActive, setNavActive] = useState(true);

  const username = localStorage.getItem("USERNAME");

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
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const res = await fetch(apiUrl + "api/rooms", options);
    try {
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  useEffect(() => console.log(navActive), [navActive]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Collapse in={navActive} dimension="width">
        <div id="example-collapse-text" style={{ width: "200px" }}>
          <Nav
            className="flex-column vertical-nav"
            style={{ width: "100%", position: "static" }}
          >
            <Navbar.Brand
              key="username"
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                whiteSpace: "nowrap",
              }}
            >
              <h5>{username}</h5>
            </Navbar.Brand>

            <Nav.Link
              key="newroom"
              className="text-white"
              onClick={() => setPage("newroom")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: "150px",
                }}
              >
                <PlusLg
                  style={{
                    marginRight: "10px",
                    fontSize: "24px",
                    flexShrink: 0,
                  }}
                />
                <span style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                  New room
                </span>
              </div>
            </Nav.Link>

            <Nav.Link
              key="joinroom"
              className="text-white"
              onClick={() => setPage("joinroom")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: "150px",
                }}
              >
                <Search
                  style={{
                    marginRight: "10px",
                    fontSize: "24px",
                    flexShrink: 0,
                  }}
                />
                <span style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                  Join Room
                </span>
              </div>
            </Nav.Link>

            {rooms.map((room) => (
              <Nav.Link
                key={room.id}
                href="#"
                className="text-white"
                onClick={() => setPage(room)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "150px",
                  }}
                >
                  <PeopleFill
                    style={{
                      marginRight: "10px",
                      fontSize: "24px",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                    {room.name}
                  </span>
                </div>
              </Nav.Link>
            ))}

            <Nav.Link
              key="logout"
              href="#"
              className="text-white mt-auto logout-link"
              onClick={logout}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: "150px",
                }}
              >
                <BoxArrowLeft
                  style={{
                    marginRight: "10px",
                    fontSize: "24px",
                    flexShrink: 0,
                  }}
                />
                <span style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                  Log out
                </span>
              </div>
            </Nav.Link>
          </Nav>
        </div>
      </Collapse>
      <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
        {navActive ? (
          <ChevronLeft
            style={{
              fontSize: "40px",
              cursor: "pointer",
              position: "relative",
              top: "50%",
            }}
            onClick={() => setNavActive(false)}
          />
        ) : (
          <ChevronRight
            style={{
              fontSize: "40px",
              cursor: "pointer",
              position: "relative",
              top: "50%",
            }}
            onClick={() => setNavActive(true)}
          />
        )}
        <Container
          style={{
            flex: 1,
            height: "100%",
            paddingTop: "50px",
            paddingBottom: "50px",
            paddingLeft: "0px",
          }}
        >
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
      </div>
    </div>
  );
};

export default Home;
