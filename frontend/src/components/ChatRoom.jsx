import React, { useState, useEffect } from "react";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import { Send } from "react-bootstrap-icons";

const ChatRoom = ({ room }) => {
  const [message, setMessage] = useState("");
  const [messageLog, setMessageLog] = useState([]);

  const updateMessageLog = (newMessage) => {
    setMessageLog((prevMessageLog) => [...prevMessageLog, newMessage]);
  };

  const [ws, setWs] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(
      "ws://127.0.0.1:8000/ws/chat/" + room.code.toString() + "/"
    );
    setWs(ws);

    ws.onopen = () => console.log("WebSocket connection opened!");
    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        updateMessageLog(parsedData.message);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    };
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket connection closed!");

    return () => {
      ws.close();
    };
  }, []);

  const handleSend = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const messageToSend = { message: message };
    ws.send(JSON.stringify(messageToSend));
  };

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
        {messageLog.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </Card.Body>
      <Card.Footer>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Send a message"
            required
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant={message === "" ? "secondary" : "primary"}
            onClick={handleSend}
          >
            <Send />
          </Button>
        </InputGroup>
      </Card.Footer>
    </Card>
  );
};

export default ChatRoom;
