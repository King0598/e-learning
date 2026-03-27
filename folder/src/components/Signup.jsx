import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    studentId: "",
    department: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem("mockUsers")) || [];

    // Check for duplicate email
    const exists = users.find(u => u.email === formData.email);
    if (exists) {
      alert("Email already used!");
      return;
    }

    // Save new user
    users.push(formData);
    localStorage.setItem("mockUsers", JSON.stringify(users));

    alert("Account created successfully! Please login.");
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Create Account</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          value={formData.fullName}
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select Role</option>
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
          <option value="ADMIN">Admin</option>
        </select>

        {formData.role === "STUDENT" && (
          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            onChange={handleChange}
            value={formData.studentId}
            required
          />
        )}

        {(formData.role === "STUDENT" || formData.role === "TEACHER") && (
          <input
            type="text"
            name="department"
            placeholder="Department"
            onChange={handleChange}
            value={formData.department}
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
          minLength="6"
        />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;
