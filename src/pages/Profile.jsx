import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit3, FiMail, FiPhone } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobilenum: "",
    upiKey: "", // Added UPI ID
  });
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultAvatar = "/defaultavatar.png";

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/buddypay/me`);
        setUser(res.data);
        setFormData({
          username: res.data.username || "",
          email: res.data.email || "",
          mobilenum: res.data.mobilenum || "",
          upiKey: res.data.upiKey || "", // Set UPI ID from response
        });
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // File change handler
  const handleFileChange = (e) => setProfilePic(e.target.files[0]);

  // Save handler
  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobilenum", formData.mobilenum);
      formDataToSend.append("upiKey", formData.upiKey); //  Send UPI ID
      if (profilePic) formDataToSend.append("profilePic", profilePic);

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/buddypay/update`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUser(res.data.updatedUser);
      toast.success("Profile updated successfully");
      setEditMode(false);
      setProfilePic(null);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="profile-container">
      <ToastContainer />

      <AnimatePresence>
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {loading ? (
            <>
              <Skeleton circle width={120} height={120} className="mb-3" />
              <Skeleton width={150} height={20} className="mb-2" />
              <Skeleton width={200} height={20} className="mb-2" />
              <Skeleton width={180} height={20} />
            </>
          ) : (
            <>
              {/* Profile Picture */}
              <div className="profile-pic-container">
                <img
                  src={
                    profilePic
                      ? URL.createObjectURL(profilePic)
                      : user?.profilePic
                      ? `${import.meta.env.VITE_API_URL}/${user.profilePic}`
                      : defaultAvatar
                  }
                  alt="Profile"
                  className="profile-pic"
                />
                {editMode && (
                  <>
                    <label htmlFor="profilePic" className="edit-icon">
                      <FiEdit3 />
                    </label>
                    <input
                      type="file"
                      id="profilePic"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </>
                )}
              </div>

              {/* Profile Info */}
              <motion.div
                key={editMode ? "edit" : "view"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="profile-info"
              >
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Enter username"
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email"
                    />
                    <input
                      type="text"
                      value={formData.mobilenum}
                      onChange={(e) => setFormData({ ...formData, mobilenum: e.target.value })}
                      placeholder="Enter mobile number"
                    />
                    <input
                      type="text"
                      value={formData.upiKey}
                      onChange={(e) => setFormData({ ...formData, upiKey: e.target.value })}
                      placeholder="Enter UPI ID"
                    />
                  </>
                ) : (
                  <>
                    <h2>{user?.username}</h2>
                    <p className="profile-detail"><FiMail /> {user?.email}</p>
                    <p className="profile-detail"><FiPhone /> {user?.mobilenum || "Not Provided"}</p>
                    <p className="profile-detail">🪙 UPI ID: {user?.upiKey || "Not Provided"}</p>
                  </>
                )}
              </motion.div>

              {/* Actions */}
              <div className="profile-actions">
                {editMode ? (
                  <>
                    <button className="save-btn" onClick={handleSave}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                  </>
                ) : (
                  <button className="edit-btn" onClick={() => setEditMode(true)}>
                    Edit Profile
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Profile;
