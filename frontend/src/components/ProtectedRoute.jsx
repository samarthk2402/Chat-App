import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [authenticated, setAuthenticated] = useState(null);

  const navigate = useNavigate();

  const refreshToken = () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: localStorage.getItem("REFRESH_TOKEN"),
      }),
    };

    fetch(apiUrl + "/token/refresh", options)
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
        } else {
          window.alert("Error refreshing access token...");
        }
      })
      .catch((err) => console.log(err));
  };

  const authenticate = () => {
    const access = localStorage.getItem("ACCESS_TOKEN");

    if (access != null) {
      const decoded = jwtDecode(access);
      if (Date.now() >= decoded.exp * 1000) {
        console.log("token expired! refreshing token...");
        refreshToken();
      } else {
        setAuthenticated(true);
      }
    } else {
      setAuthenticated(false);
      navigate("/signup");
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  return authenticated ? children : <div>Loading</div>;
};

export default ProtectedRoute;
