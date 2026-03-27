import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import studentPic from "../../assets/student.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import "./Settings.css"; // Make sure to create this CSS file

export default function Settings() {
  const navigate = useNavigate();

  // State for user profile
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userId: "",
    campus: "",
    faculty: "",
    department: "",
    program: "",
    role: "",
    phoneNumber: "",
  });

  const [avatar, setAvatar] = useState(studentPic);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Helper function to get token from storage
  const getToken = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please login again.");
      navigate("/login");
      return null;
    }
    return token;
  };

  // Helper function to get user from storage
  const getStoredUser = () => {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  // Set axios authorization header
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      setAuthHeader(token);
      
      console.log("Fetching profile with token:", token.substring(0, 20) + "...");
      
      const response = await axios.get("http://localhost:8080/api/auth/profile", {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });

      console.log("Profile response:", response.data);
      
      const userData = response.data;
      setProfile({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        userId: userData.userId || "",
        campus: userData.campus || "",
        faculty: userData.faculty || "",
        department: userData.department || "",
        program: userData.program || "",
        role: userData.role || "",
        phoneNumber: userData.phoneNumber || "",
      });
      
      toast.success("✅ Profile loaded successfully");
      
    } catch (error) {
      console.error("Error fetching profile:", error);
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          toast.error("Session expired. Please login again.");
          handleLogout();
        } else if (status === 404) {
          toast.error("Profile endpoint not found. Check backend.");
        } else {
          toast.error(`Error ${status}: ${data?.error || "Failed to load profile"}`);
        }
      } else if (error.request) {
        toast.error("Cannot connect to server. Is the backend running?");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initialize on component mount
  useEffect(() => {
    // First, try to get stored user data
    const storedUser = getStoredUser();
    if (storedUser) {
      console.log("Found stored user:", storedUser);
      setProfile(prev => ({
        ...prev,
        email: storedUser.email || "",
        firstName: storedUser.firstName || storedUser.fullName?.split(" ")[0] || "",
        lastName: storedUser.lastName || storedUser.fullName?.split(" ")[1] || "",
        role: storedUser.role || "",
      }));
    }
    
    // Then fetch fresh data from backend
    fetchUserProfile();
    
    // Cleanup function
    return () => {
      // Clean up if needed
    };
  }, []);

  // ✅ Validation function for profile
  const validateProfile = () => {
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      toast.error("❌ First name and last name are required");
      return false;
    }
    if (!profile.email.trim()) {
      toast.error("❌ Email cannot be empty");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      toast.error("❌ Invalid email format");
      return false;
    }
    return true;
  };

  // ✅ Validation function for password
  const validatePasswords = () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword.trim()) {
      toast.error("❌ Old password is required");
      return false;
    }
    if (!newPassword.trim()) {
      toast.error("❌ New password is required");
      return false;
    }
    if (newPassword.length < 6) {
      toast.error("❌ New password must be at least 6 characters");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("❌ New password and confirm password do not match");
      return false;
    }
    return true;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("❌ Only image files allowed for avatar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("❌ Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
        toast.info("✅ Avatar updated locally");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async () => {
    if (!validateProfile()) return;

    const token = getToken();
    if (!token) return;

    try {
      setUpdating(true);
      
      // Prepare update data
      const updateData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNumber: profile.phoneNumber || ""
      };

      console.log("Updating profile with data:", updateData);
      
      // Update profile on backend
      const response = await axios.put(
        "http://localhost:8080/api/auth/profile",
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );

      console.log("Update response:", response.data);

      if (response.status === 200 || response.status === 201) {
        // Update stored user data
        const storedUser = getStoredUser();
        if (storedUser) {
          const updatedUser = {
            ...storedUser,
            firstName: profile.firstName,
            lastName: profile.lastName,
            fullName: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
            phoneNumber: profile.phoneNumber,
          };
          
          // Update in storage
          if (localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify(updatedUser));
          } else if (sessionStorage.getItem("user")) {
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
          }
        }

        toast.success("✅ Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          toast.error("Session expired. Please login again.");
          handleLogout();
        } else if (status === 409) {
          toast.error("❌ Email already exists");
        } else if (status === 400) {
          toast.error(data?.error || "❌ Invalid data provided");
        } else {
          toast.error(`Error ${status}: ${data?.error || "Failed to update profile"}`);
        }
      } else if (error.request) {
        toast.error("❌ Cannot connect to server");
      } else {
        toast.error("❌ An unexpected error occurred");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!validatePasswords()) return;

    const token = getToken();
    if (!token) return;

    try {
      setUpdating(true);
      
      const passwordData = {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      };

      console.log("Changing password...");
      
      // Call backend password change endpoint
      const response = await axios.post(
        "http://localhost:8080/api/auth/change-password",
        passwordData,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );

      console.log("Password change response:", response.data);

      if (response.status === 200) {
        toast.success("✅ Password updated successfully");
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          toast.error("Session expired. Please login again.");
          handleLogout();
        } else if (status === 400) {
          toast.error(data?.error || "❌ Old password is incorrect");
        } else {
          toast.error(`Error ${status}: ${data?.error || "Failed to update password"}`);
        }
      } else if (error.request) {
        toast.error("❌ Cannot connect to server");
      } else {
        toast.error("❌ An unexpected error occurred");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    const token = getToken();
    if (token) {
      try {
        // Call logout endpoint
        await axios.post(
          "http://localhost:8080/api/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    
    // Clear all storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    
    toast.info("👋 Logged out successfully");
    navigate("/login");
  };

  // Loading state
  if (loading) {
    return (
      <div className="settings-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <div className="settings-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="profile-header">
        <div className="profile-pic-container">
          <img 
            src={avatar} 
            alt="Avatar" 
            className="profile-pic"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = studentPic;
            }}
          />
          <label className="edit-avatar" title="Change profile picture">
            ✏️
            <input 
              type="file" 
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div className="profile-info">
          <h2>{profile.firstName} {profile.lastName}</h2>
          <p className="user-role">{profile.role}</p>
          <p className="user-id">ID: {profile.userId}</p>
          <p className="user-email">{profile.email}</p>
        </div>
      </div>

      <div className="settings-card">
        <h3>📋 Personal Information</h3>
        <div className="form-row">
          <div className="form-group half-width">
            <label>First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              placeholder="First Name"
              disabled={updating}
            />
          </div>
          <div className="form-group half-width">
            <label>Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              placeholder="Last Name"
              disabled={updating}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Email"
            disabled={updating}
          />
        </div>
        
        <div className="form-group">
          <label>Phone Number (optional)</label>
          <input
            type="text"
            value={profile.phoneNumber || ""}
            onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
            placeholder="Phone Number"
            disabled={updating}
          />
        </div>
        
        <div className="form-group">
          <label>Campus</label>
          <input
            type="text"
            value={profile.campus || ""}
            placeholder="Campus"
            disabled
            className="disabled-input"
          />
        </div>
        
        <div className="form-group">
          <label>Faculty</label>
          <input
            type="text"
            value={profile.faculty || ""}
            placeholder="Faculty"
            disabled
            className="disabled-input"
          />
        </div>
        
        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            value={profile.department || ""}
            placeholder="Department"
            disabled
            className="disabled-input"
          />
        </div>
        
        <div className="form-group">
          <label>Program</label>
          <input
            type="text"
            value={profile.program || ""}
            placeholder="Program"
            disabled
            className="disabled-input"
          />
        </div>
        
        <button 
          className="save-btn" 
          onClick={handleProfileSave}
          disabled={updating}
        >
          {updating ? "🔄 Updating..." : "💾 Save Changes"}
        </button>
      </div>

      <div className="settings-card">
        <h3>🔒 Security</h3>
        
        <div className="form-group">
          <label>Old Password</label>
          <input
            type="password"
            placeholder="Enter your current password"
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
            disabled={updating}
          />
        </div>
        
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password (min 6 characters)"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            disabled={updating}
          />
        </div>
        
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm your new password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            disabled={updating}
          />
        </div>
        
        <div className="security-buttons">
          <button 
            className="save-btn" 
            onClick={handlePasswordUpdate}
            disabled={updating}
          >
            {updating ? "🔄 Updating..." : "🔐 Update Password"}
          </button>
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            disabled={updating}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="settings-card">
        <h3>⚙️ Account Settings</h3>
        <button 
          className="danger-btn" 
          onClick={() => toast.info("This feature is coming soon")}
          disabled={updating}
        >
          🗑️ Delete Account
        </button>
        <p className="help-text">
          <small>Note: Account deletion is permanent and cannot be undone.</small>
        </p>
      </div>
    </div>
  );
}