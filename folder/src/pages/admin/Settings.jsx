import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminPic from "../../assets/admin.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../services/api";

export default function AdminSettings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // office field removed as it's not in backend
  });

  const [avatar, setAvatar] = useState(null);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load profile from API
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/auth/profile");
      const data = response.data;
      setProfile({
        id: data.id,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phoneNumber || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.");
      setLoading(false);
    }
  };

  // Avatar upload (Mock for now, or implement backend upload if supported)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("❌ Only image files allowed");
        return;
      }
      setAvatar(URL.createObjectURL(file));
      toast.success("✅ Avatar updated (Local only)");
    }
  };

  // Profile validation
  const validateProfile = () => {
    if (!profile.firstName || !profile.lastName || !profile.email) {
      toast.error("Name and Email are required!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      toast.error("Please enter a valid email address!");
      return false;
    }
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    try {
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNumber: profile.phone,
      };

      await API.put(`/users/${profile.id}`, payload);
      toast.success("✅ Profile updated successfully");

      // Update local storage user info just in case
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
      const updatedUser = { ...loggedInUser, ...payload, fullName: payload.firstName + " " + payload.lastName };
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  // Password validation
  const handleUpdatePassword = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    try {
      // Backend expects query params: ?oldPassword=...&newPassword=...
      const params = new URLSearchParams();
      params.append("oldPassword", oldPassword);
      params.append("newPassword", newPassword);

      await API.post(`/auth/change-password?${params.toString()}`);

      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("✅ Password updated successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. check old password.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    toast.info("👋 Logged out successfully");
    navigate("/");
  };

  if (loading) return <div>Loading Profile...</div>;

  return (
    <div className="settings-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-pic-container">
          <img src={avatar || adminPic} alt="Admin Avatar" className="profile-pic" />
          <label className="edit-avatar">
            ✏️
            <input type="file" onChange={handleAvatarChange} />
          </label>
        </div>

        <div className="profile-info">
          <h2>{profile.firstName} {profile.lastName}</h2>
          <p>System Administrator</p>
        </div>
      </div>

      {/* Admin Info */}
      <div className="settings-card">
        <h3>Admin Information</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              value={profile.firstName}
              placeholder="First Name"
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              placeholder="Last Name"
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
          </div>
        </div>

        <label>Email</label>
        <input
          type="email"
          value={profile.email}
          placeholder="Email"
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />

        <label>Phone Number</label>
        <input
          type="text"
          value={profile.phone}
          placeholder="Phone Number"
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        />

        <button className="save-btn" onClick={handleSaveProfile} style={{ marginTop: "10px" }}>
          Save Changes
        </button>
      </div>

      {/* Security Settings */}
      <div className="settings-card">
        <h3>Security</h3>

        <input
          type="password"
          placeholder="Old Password"
          value={passwords.oldPassword}
          onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
        />

        <input
          type="password"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
        />

        <div className="security-buttons">
          <button className="save-btn" onClick={handleUpdatePassword}>
            Update Password
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
