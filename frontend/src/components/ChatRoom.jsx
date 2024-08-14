import React, { useState } from "react";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import { Send } from "react-bootstrap-icons";

const ChatRoom = ({ room }) => {
  const [message, setMessage] = useState("");

  return (
    <Card
      style={{
        width: "70%",
        minHeight: "75vh",
        margin: "auto",
      }}
    >
      <Card.Header>
        <h5>{room.name}</h5>
        <h6>Code: {room.code}</h6>
      </Card.Header>
      <Card.Body style={{ flex: "1 0 auto" }}>
        {" "}
        {/* Takes up remaining space */}
        {/* Main content goes here */}
      </Card.Body>
      <Card.Footer>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Send a message"
            required
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant={message === "" ? "secondary" : "primary"}>
            <Send />
          </Button>
        </InputGroup>
      </Card.Footer>
    </Card>
  );
};

export default ChatRoom;
