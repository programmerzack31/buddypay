import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Import CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobilenum: "",
    password: "",
    confirmPassword: "",
    upiKey: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(null); // null = untouched, true = match, false = mismatch

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // live password match check
    if (name === "confirmPassword" || name === "password") {
      setPasswordMatch(
        name === "password"
          ? value === formData.confirmPassword && formData.confirmPassword !== ""
          : value === formData.password
      );
    }
  };

  const handleGenerateUPI = () => {
    if (!formData.username || !formData.email) {
      toast.warning("Enter username and email first");
      return;
    }
    const upi = `${formData.username.toLowerCase().replace(/\s+/g, "")}@buddypay`;
    setFormData({ ...formData, upiKey: upi });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/buddypay/signup`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <form onSubmit={handleSubmit} className="signup-form" encType="multipart/form-data">
        <h2 className="signup-title">Sign Up</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="signup-input"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="signup-input"
        />

        <input
          type="tel"
          name="mobilenum"
          placeholder="Mobile Number"
          value={formData.mobilenum}
          onChange={handleChange}
          required
          className="signup-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="signup-input"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="signup-input"
        />

        {passwordMatch !== null && (
          <p
            style={{
              color: passwordMatch ? "green" : "red",
              fontSize: "14px",
              marginTop: "-8px",
              marginBottom: "8px",
            }}
          >
            {passwordMatch ? "Passwords match " : "Passwords do not match "}
          </p>
        )}

        <div className="upi-row">
          <input
            type="text"
            name="upiKey"
            placeholder="UPI ID"
            value={formData.upiKey}
            readOnly
            className="signup-input"
          />
          <button type="button" onClick={handleGenerateUPI} className="generate-button">
            Generate
          </button>
        </div>

        <button type="submit" className="submit-button">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
