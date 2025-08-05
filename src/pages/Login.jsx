import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `https://buddypayback.onrender.com/api/buddypay/login`,
        credentials
      );

      // Validate response structure
      if (!res.data?.token || !res.data?.user?._id) {
        throw new Error("Invalid response from server: missing token or _id");
      }

      const { token, user } = res.data;

      //Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      //Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success("Login successful!");

      // Redirect to notifications or dashboard
      navigate("/dashboard"); // ya "/notifications" bhi kar sakte ho
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue to BuddyPay</p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
          className="login-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
          className="login-input"
        />

        <button type="submit" className="login-button">Login</button>

        <p className="login-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
