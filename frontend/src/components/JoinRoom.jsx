import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

const JoinRoom = ({ getRooms, openRoom }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [code, setCode] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("ACCESS_TOKEN");
    const options = {
      method: "POST",
      headers: {
        // prettier-ignore
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code }),
    };

    try {
      const res = await fetch(apiUrl + "api/room/join", options);
      const data = await res.json();
      if (!res.ok) {
        window.alert(data.message);
      } else {
        getRooms();
      }
    } catch (err) {
      window.alert(err);
    }
  };

  return (
    <Card style={{ maxWidth: "300px", padding: "20px", margin: "auto" }}>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Join a room</h3>

      <Form onSubmit={(e) => handleSubmit(e)}>
        <Form.Group className="mb-3" controlId="code">
          <Form.Label>Room Code</Form.Label>
          <Form.Control
            type="text"
            required
            placeholder="XXXXXX"
            onChange={(e) => setCode(e.target.value)}
          />
        </Form.Group>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="primary" type="submit">
            Join
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default JoinRoom;
