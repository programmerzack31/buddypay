import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";
import "react-toastify/dist/ReactToastify.css";
import "./MoneyTransfer.css";

const MoneyTransfer = ({ refreshTransactions }) => {
  const [form, setForm] = useState({ receiverUpi: "", amount: "", message: "" });
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [checkingUpi, setCheckingUpi] = useState(false);

  // Password Popup State
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "receiverUpi") setReceiverInfo(null);
  };

  const checkUpi = async () => {
    if (!form.receiverUpi) return;
    try {
      setCheckingUpi(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/buddypay/lookup-upi?upiKey=${form.receiverUpi}`
      );
      setReceiverInfo(res.data);
    } catch (err) {
      setReceiverInfo(null);
      toast.warn("Receiver not found");
    } finally {
      setCheckingUpi(false);
    }
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!form.receiverUpi || !form.amount) return toast.warn("Fill in all fields");
    if (parseFloat(form.amount) <= 0) return toast.error("Amount must be greater than 0");
    if (!receiverInfo?._id) return toast.error("Please validate UPI first");

    
    setShowPasswordPopup(true);
  };

  const confirmTransfer = async () => {
    if (!password) return toast.warn("Enter your password");

    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const senderName = currentUser?.username || "Unknown";

      await axios.post(`${import.meta.env.VITE_API_URL}/api/buddypay/transfer`, {
        toUser: receiverInfo._id,
        amount: parseFloat(form.amount),
        message: form.message,
        password,
      });

      //  Hide password popup
      setShowPasswordPopup(false);
      setPassword("");

      //  Show success toast instead of popup
      toast.success(`₹${form.amount} sent successfully to ${receiverInfo.username}!`);

      //  Send notification
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notifications/create`,
        {
          toUser: receiverInfo._id,
          text: `You received ₹${form.amount} from ${senderName}`,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      //  Reset form
      setForm({ receiverUpi: "", amount: "", message: "" });
      setReceiverInfo(null);
      refreshTransactions();
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  // 🔹 Password Popup JSX as Portal
  const passwordPopup = showPasswordPopup && ReactDOM.createPortal(
    <>
      <div className="popup-overlay" />
      <motion.div
        className="password-popup"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <h4>Enter Password to Confirm</h4>
        <input
          type="password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="money-input"
        />
        <div className="popup-buttons">
          <button
            className="popup-cancel"
            onClick={() => {
              setShowPasswordPopup(false);
              setPassword("");
            }}
          >
            Cancel
          </button>
          <button className="popup-confirm" onClick={confirmTransfer}>
            Confirm
          </button>
        </div>
      </motion.div>
    </>,
    document.body
  );

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="money-transfer-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleTransfer} className="money-form">
            <h3 className="money-title">Send Money</h3>

            <input
              type="text"
              name="receiverUpi"
              placeholder="Receiver's UPI ID"
              value={form.receiverUpi}
              onChange={handleChange}
              onBlur={checkUpi}
              className="money-input"
              required
            />

            {checkingUpi && <p className="money-status">Checking UPI...</p>}
            {receiverInfo && (
              <p className="money-receiver">Receiver: {receiverInfo.username}</p>
            )}

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="money-input"
              required
            />

            <input
              type="text"
              name="message"
              placeholder="Message (optional)"
              value={form.message}
              onChange={handleChange}
              className="money-input"
            />

            <motion.button
              type="submit"
              className="money-button"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              Send
            </motion.button>
          </form>
        </motion.div>
      </AnimatePresence>

    
      {passwordPopup}

    
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default MoneyTransfer;
