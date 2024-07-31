import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [authenticated, setAuthenticated] = useState(null);

  const navigate = useNavigate();

  const refreshToken = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: localStorage.getItem("REFRESH_TOKEN"),
      }),
    };

    try {
      const res = await fetch(apiUrl + "/token/refresh/", options);
      const data = await res.json();
      localStorage.setItem("ACCESS_TOKEN", data.access);
      const decoded = jwtDecode(data.access);
      setAuthenticated(true);
      console.log(
        "Access token successfully refreshed and will expire at " +
          new Date(decoded.exp * 1000)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const authenticate = () => {
    const access = localStorage.getItem("ACCESS_TOKEN");

    try {
      const decoded = jwtDecode(access);
      if (Date.now() >= decoded.exp * 1000) {
        console.log("token expired! refreshing token...");
        refreshToken();
      } else {
        setAuthenticated(true);
      }
    } catch {
      console.log("no access token");
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
