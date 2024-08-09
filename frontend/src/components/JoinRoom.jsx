import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

const JoinRoom = () => {
  const [code, setCode] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(code);
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
