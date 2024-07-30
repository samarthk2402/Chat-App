import { useState } from "react";
import "./App.css";
import { Container } from "react-bootstrap";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <h1
        style={{ textAlign: "center", marginTop: "50px", marginBottom: "50px" }}
      >
        Chat App
      </h1>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
