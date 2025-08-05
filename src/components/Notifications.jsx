import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./Notifications.css";


// Socket ek hi baar create karo
const socket = io(`${import.meta.env.VITE_API_URL}`, { transports: ["websocket"] });

const Notifications = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // LocalStorage safe load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?._id) {
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          console.warn("User data missing _id:", parsedUser);
          setLoading(false);
        }
      } else {
        console.warn("No user or token found in localStorage");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      setLoading(false);
    }
  }, []);

  //Socket aur Notifications fetch effect
  useEffect(() => {
    if (!user?._id || !token) return;

    //Register user to socket
    socket.emit("register", user._id);

    //Listen for new notifications
    const handleNotification = (data) => {
      console.log("🔔 New notification received:", data);
      setNotifications((prev) => [data, ...prev]);
    };

    socket.on("notification", handleNotification);

    // Fetch old notifications from backend
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/notifications/${user._id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
       

        if (!Array.isArray(data)) {
          console.error("Unexpected response from backend:", data);
          setNotifications([]);
        } else {
          const sorted = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setNotifications(sorted);
        }
      } catch (err) {
        console.error(" Error fetching notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Cleanup on unmount
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [user?._id, token]);

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      {loading ? (
        <ul className="notifications-list">
          {Array(4)
            .fill()
            .map((_, idx) => (
              <li key={idx} className="notification-item">
                <Skeleton height={20} width={`80%`} style={{ marginBottom: 6 }} />
                <Skeleton height={12} width={`40%`} />
              </li>
            ))}
        </ul>
      ) : notifications.length > 0 ? (
        <ul className="notifications-list">
          {notifications.map((n, index) => (
            <li key={n._id || index} className="notification-item">
              <p>{n.text || "No message"}</p>
              <small>
                {new Date(
                  n.createdAt || n.timestamp || Date.now()
                ).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">No notifications yet.</p>
      )}
    </div>
  );
};

export default Notifications;
