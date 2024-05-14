import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.js";
import "./styles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    console.log("Login component: Token from URL:", token); // 로그 추가
    if (token) {
      console.log("Login component: Storing token to localStorage:", token); // 로그 추가
      localStorage.setItem("accessToken", token);
      login(token);
      navigate("/", { replace: true });
    }
  }, [login, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3002/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.token) {
        console.log("Login component: Token from login:", data.token); // 로그 추가
        login(data.token);
        localStorage.setItem("accessToken", data.token); // Store token locally
        alert("Login success");
        navigate("/", { replace: true });
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login error");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login component: Redirecting to Google login"); // 로그 추가
    window.location.href = "http://localhost:3002/api/auth/google";
  };

  return (
    <div className="container c-login">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-danger"
          style={{ marginLeft: "10px" }}
        >
          Login with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
