import React, { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { PeopleFill } from "react-bootstrap-icons";

const CreateRoom = () => {
  const [room, setRoom] = useState({ all_admin: false });

  const updateRoom = (field, val) => {
    let updatedRoom = JSON.parse(JSON.stringify(room));

    updatedRoom[field] = val;

    setRoom(updatedRoom);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(room);
  };

  return (
    <Card style={{ maxWidth: "300px", padding: "20px", margin: "auto" }}>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        Create a room
      </h3>

      <PeopleFill size={64} style={{ margin: "auto" }} />

      <Form onSubmit={(e) => handleSubmit(e)}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Room Name</Form.Label>
          <Form.Control
            type="text"
            required
            onChange={(e) => updateRoom("name", e.target.value)}
          />
        </Form.Group>

        <Form.Group style={{ marginBottom: "10px" }}>
          <Form.Label>Room Description</Form.Label>
          <Form.Control
            as="textarea"
            required
            onChange={(e) => updateRoom("description", e.target.value)}
          />
        </Form.Group>

        <Form.Check
          style={{ marginBottom: "10px" }}
          type="switch"
          id="custom-switch"
          label="Everyone admin"
          onChange={(e) => updateRoom("all_admin", e.target.checked)}
        />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="primary" type="submit">
            Create
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default CreateRoom;
