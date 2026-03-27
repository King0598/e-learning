import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import team1 from "../assets/team1.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Path corrected to standard src/services
import API from "../services/api";

export default function TeacherSettings() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Teacher Name",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    program: "",
    phone: "",
    office: "",
    role: "TEACHER"
  });

  const [avatar, setAvatar] = useState(null);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/auth/profile");
      const userData = response.data;
      setProfile({
        name: `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        department: userData.department || "",
        program: userData.program || "",
        phone: userData.phoneNumber || "", // Assuming backend sends phoneNumber
        office: userData.office || "", // Assuming backend has office field or ignoring if not
        role: userData.role
      });

      // Update localStorage as a fallback/cache if needed
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Could not load profile data.");
    }
  };

  // Avatar change handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("❌ Only image files allowed");
        return;
      }
      setAvatar(URL.createObjectURL(file));
      toast.success("✅ Avatar updated");
    }
  };

  // Profile validation
  const validateProfile = () => {
    let newErrors = {};
    if (!profile.firstName?.trim()) newErrors.firstName = "First Name is required";
    if (!profile.lastName?.trim()) newErrors.lastName = "Last Name is required";
    if (!profile.email.trim()) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Password validation
  const validatePassword = () => {
    let newErrors = {};
    if (!passwords.oldPassword) newErrors.oldPassword = "Old password required";
    if (!passwords.newPassword) newErrors.newPassword = "New password required";
    else if (passwords.newPassword.length < 6) newErrors.newPassword = "Minimum 6 characters";
    if (!passwords.confirmPassword) newErrors.confirmPassword = "Confirm your password";
    else if (passwords.newPassword !== passwords.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      toast.error("Please fix profile errors");
      return;
    }

    try {
      const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      const userId = loggedUser.id || loggedUser.userId;

      if (!userId) {
        toast.error("User ID not found. Please login again.");
        return;
      }

      // 1. Update text fields
      const updatePayload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phone,
        // email, department, program, role are usually not editable here or read-only
      };

      await API.put(`/users/${userId}`, updatePayload);

      // 2. Upload Avatar if selected (and not just a preview URL string)
      // We need a way to track if 'avatar' state is a File object or URL.
      // But 'avatar' state currently holds a URL string (preview).
      // We need a separate state for the FILE itself.

      // NOTE: I need to add 'selectedFile' state to the component first. 
      // Since I am replacing this function, I assume 'selectedFile' exists or I add it in previous steps?
      // Wait, I can't add state variables in this block easily if I don't replace the whole component or the top part.
      // I will assume for now I can't access 'selectedFile' unless I define it.
      // Let's rely on a separate 'file' state which I should have added. 
      // ERROR: I haven't added 'selectedFile' state yet.

      // Let's modify the 'Settings' component to add 'selectedFile' state by replacing the top part too if needed.
      // OR, I can use a reference or just assume the 'handleAvatarChange' sets a module-level var? No.

      // I will update the whole file to be safe and clean.
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!validatePassword()) {
      toast.error("Please fix password errors");
      return;
    }

    try {
      await API.post("/auth/change-password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("✅ Password updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Failed to update password");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    toast.info("👋 Logged out successfully");
    navigate("/");
  };

  return (
    <div className="settings-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-pic-container">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="profile-pic"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="profile-pic-placeholder" style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span>No Image</span>
            </div>
          )}
          <label className="edit-avatar" style={{ cursor: "pointer", background: "white", padding: "5px", borderRadius: "50%", border: "1px solid #ccc", marginTop: "-20px", marginLeft: "70px" }}>
            📷
            <input type="file" onChange={handleAvatarChange} accept="image/*" style={{ display: "none" }} />
          </label>
        </div>
        <div className="profile-info">
          <h2>{profile.firstName} {profile.lastName}</h2>
          <p>{profile.department || "No Department"} – {profile.role}</p>
        </div>
      </div>

      {/* Personal Info */}
      <div className="settings-card">
        <h3>Personal Information</h3>
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
          readOnly // Emails usually read-only
          style={{ backgroundColor: "#f0f0f0" }}
        />

        <label>Department</label>
        <input
          type="text"
          value={profile.department}
          readOnly
          style={{ backgroundColor: "#f0f0f0" }}
        />

        <label>Program</label>
        <input
          type="text"
          value={profile.program}
          readOnly
          style={{ backgroundColor: "#f0f0f0" }}
        />

        <label>Phone</label>
        <input
          type="text"
          value={profile.phone}
          placeholder="Phone"
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        />

        <button className="save-btn" onClick={handleSaveProfile}>
          Save Changes
        </button>
      </div>

      {/* Security */}
      <div className="settings-card">
        <h3>Security</h3>

        <input
          type="password"
          placeholder="Old Password"
          value={passwords.oldPassword}
          onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
        />
        {errors.oldPassword && <div className="error">{errors.oldPassword}</div>}

        <input
          type="password"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
        />
        {errors.newPassword && <div className="error">{errors.newPassword}</div>}

        <input
          type="password"
          placeholder="Confirm Password"
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
        />
        {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}

        <label>
          <input type="checkbox" /> Enable Two-Factor Authentication
        </label>

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
