import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Card, InputGroup } from "react-bootstrap";
import { Send } from "react-bootstrap-icons";

const ChatRoom = ({ room }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [message, setMessage] = useState("");
  const [messageLog, setMessageLog] = useState([]);

  // Reference for scrolling
  const chatContainerRef = useRef(null);

  const updateMessageLog = (newMessage) => {
    setMessageLog((prevMessageLog) => [...prevMessageLog, newMessage]);
  };

  const [ws, setWs] = useState(null);

  const getMessages = async () => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const res = await fetch(apiUrl + "chat/messages/" + room.code, options);

    try {
      const data = await res.json();
      let newMessageLog = [];

      for (const item of data) {
        newMessageLog.push({
          message: item.content,
          username: item.sender,
        });
      }
      setMessageLog(newMessageLog);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMessages();
    setMessageLog([]);
    setMessage("");

    const ws = new WebSocket(
      "ws://127.0.0.1:8000/ws/chat/" +
        room.code.toString() +
        "/" +
        localStorage.getItem("USERNAME") +
        "/"
    );
    setWs(ws);

    ws.onopen = () => console.log("WebSocket connection opened!");
    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        updateMessageLog(parsedData);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    };
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket connection closed!");

    return () => {
      ws.close();
    };
  }, [room]);

  useEffect(() => {
    // Scroll to bottom when messageLog changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messageLog]);

  const handleSend = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const messageToSend = { message: message };
    ws.send(JSON.stringify(messageToSend));
    setMessage("");
  };

  return (
    <Card
      style={{
        width: "70%",
        minHeight: "75vh",
        maxHeight: "75vh",
        margin: "auto",
      }}
    >
      <Card.Header>
        <h5>{room.name}</h5>
        <h6>Code: {room.code}</h6>
      </Card.Header>
      <Card.Body
        ref={chatContainerRef} // Assign the ref here
        style={{ flex: "1 0 auto", overflowY: "auto", maxHeight: "60vh" }}
      >
        {messageLog.map((message, index) => (
          <div
            style={{
              display: "flex",
              justifyContent:
                message.username === localStorage.getItem("USERNAME")
                  ? "flex-end"
                  : "flex-start",
              marginBottom: "10px",
            }}
            key={index}
          >
            <div style={{ maxWidth: "70%", textAlign: "right" }}>
              <Card
                className={
                  message.username === localStorage.getItem("USERNAME")
                    ? "bg-primary text-white"
                    : "bg-secondary text-white"
                }
                style={{
                  display: "inline-block",
                  padding: "10px",
                  paddingBottom: "0px",
                  maxWidth: "100%",
                  wordWrap: "break-word",
                }}
              >
                <p>{message.message}</p>
              </Card>
              <p style={{ margin: "5px 0", fontSize: "12px" }}>
                {message.username === localStorage.getItem("USERNAME")
                  ? "You"
                  : message.username}
              </p>
            </div>
          </div>
        ))}
      </Card.Body>

      <Card.Footer>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Send a message"
            required
            value={message}
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
