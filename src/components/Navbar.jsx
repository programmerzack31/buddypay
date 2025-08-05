import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode"; 
import "./Navbar.css";
import logo from "/buddypaylogo.png"; // Apna transparent logo import karein

const socket = io(`${import.meta.env.VITE_API_URL}`, { transports: ["websocket"] });

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  //  Auto logout if token expired
  useEffect(() => {
    if (!token) {
      handleLogout();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        handleLogout();
      } else {
        const timeout = decoded.exp * 1000 - Date.now() + 1000;
        const timer = setTimeout(() => handleLogout(), timeout);
        return () => clearTimeout(timer);
      }
    } catch (err) {
      handleLogout();
    }
  }, [token]);

  //  Socket setup
  useEffect(() => {
    if (!user?._id || !token) return;

    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.emit("register", user._id);

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, [user, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="navbar">
        {/* ✅ Logo replace */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="BuddyPay Logo" className="logo-img" />
        </Link>

        {/* Hamburger Menu */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={menuOpen ? "bar rotate1" : "bar"}></div>
          <div className={menuOpen ? "bar fade" : "bar"}></div>
          <div className={menuOpen ? "bar rotate2" : "bar"}></div>
        </div>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>Home</Link>

          {token ? (
            <>
              <Link to="/dashboard" className="navbar-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/transfer" className="navbar-link" onClick={() => setMenuOpen(false)}>Transfer</Link>
              <Link to="/profile" className="navbar-link" onClick={() => setMenuOpen(false)}>Profile</Link>
              <Link to="/notifications" className="navbar-link" onClick={() => setMenuOpen(false)}>Notifications</Link>

              <button
                onClick={() => { setShowLogoutConfirm(true); setMenuOpen(false); }}
                className="logout-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="navbar-link" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure you want to logout?</h3>
            <div className="logout-buttons">
              <button onClick={() => setShowLogoutConfirm(false)} className="cancel-btn">Cancel</button>
              <button onClick={handleLogout} className="confirm-btn">Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
