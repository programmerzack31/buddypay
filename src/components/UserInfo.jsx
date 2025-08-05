import React from "react";
import './UserInfo.css'; // Link the CSS file

const UserInfo = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null;

  return (
    <div className="user-info-card">
      {user.profilePic && (
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/${user.profilePic}`}
          alt="Profile"
          className="user-avatar"
        />
      )}
      <div>
        <p className="user-name">{user.username}</p>
        <p className="user-email">{user.email}</p>
      </div>
    </div>
  );
};

export default UserInfo;
