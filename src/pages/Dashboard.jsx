import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { FiLogOut, FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import "../components/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const defaultAvatar = "/defaultavatar.png"; 
  // Balance animation
  function useCountUp(targetValue, duration = 1.5) {
    const [value, setValue] = useState(0);
    const motionValue = useMotionValue(0);

    useEffect(() => {
      const controls = animate(motionValue, targetValue, {
        duration,
        onUpdate: (v) => setValue(v.toFixed(2)),
      });
      return controls.stop;
    }, [targetValue]);

    return value;
  }

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/buddypay/me`)
      .then((res) => setUser(res.data))
      .catch(() => toast.error("Failed to fetch user"));

    axios.get(`${import.meta.env.VITE_API_URL}/api/buddypay/history`)
      .then((res) => setTransactions(res.data))
      .catch(() => toast.error("Failed to load transactions"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    toast.info("Logged out");
  };

  const animatedBalance = useCountUp(user?.balance || 0);

  return (
    <div className="dashboard-container">
      <ToastContainer />

      {/* Top Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="top-bar"
      >
        <div className="user-info">
          {loading ? (
            <Skeleton circle width={48} height={48} />
          ) : (
            <img
              src={
                user?.profilePic
                  ? `${import.meta.env.VITE_API_URL}/${user.profilePic}`
                  : defaultAvatar
              }
              alt="Profile"
              className="profile-pic"
            />
          )}
          <div>
            <p className="username">{user?.username || <Skeleton width={100} />}</p>
            <p className="email">{user?.email || <Skeleton width={150} />}</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLogoutConfirm(true)}
          className="logout-btn"
        >
          <FiLogOut /> Logout
        </motion.button>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="balance-card"
      >
        <h3>Balance</h3>
        {user ? (
          <span className="balance-amount">₹ {animatedBalance}</span>
        ) : (
          <Skeleton width={100} />
        )}
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <h3 style={{ marginBottom: "10px" }}>Transaction History</h3>
        {loading ? (
          <Skeleton count={3} height={40} className="mb-2" />
        ) : transactions.length === 0 ? (
          <p className="empty-text">No transactions yet.</p>
        ) : (
          <ul className="txn-list">
            {transactions.map((txn, index) => {
              const isSent = txn.fromUser._id === user._id;
              const otherParty = isSent ? txn.toUser : txn.fromUser;

              return (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={`txn-item ${isSent ? "sent" : "received"}`}
                >
                  <div className="txn-left">
                    <motion.div
                      className="txn-icon"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {isSent ? (
                        <FiArrowUpRight className="icon-sent" />
                      ) : (
                        <FiArrowDownLeft className="icon-received" />
                      )}
                    </motion.div>
                    <div>
                      <span className="txn-text">
                        {isSent ? "Sent to" : "Received from"} {otherParty.username}
                      </span>
                      <p className="txn-date">{new Date(txn.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <span className="txn-amount">
                    {isSent ? `- ₹${txn.amount}` : `+ ₹${txn.amount}`}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        )}
      </motion.div>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              className="modal"
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Are you sure you want to logout?</h2>
              <div className="modal-actions">
                <button onClick={() => setShowLogoutConfirm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleLogout} className="logout-confirm-btn">
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
