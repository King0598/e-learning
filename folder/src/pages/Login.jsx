import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../index.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const result = await login(formData);

      if (result.success) {
        toast.success(`✅ Welcome, ${result.data.fullName}`, { autoClose: 2000 });

        // Role-based redirection
        const user = result.data;
        setTimeout(() => {
          if (user.role === "STUDENT") navigate("/student/dashboard", { state: { user } });
          else if (user.role === "TEACHER") navigate("/teacher/dashboard", { state: { user } });
          else if (user.role === "ADMIN") navigate("/admin/dashboard", { state: { user } });
          else navigate("/dashboard", { state: { user } });
        }, 1500);
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login critical error:", error);
      toast.error(`Login failed: ${error.message || "An unexpected error occurred."}`);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <button type="submit">Login</button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
