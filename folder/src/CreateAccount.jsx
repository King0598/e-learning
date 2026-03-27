import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateAccount.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateAccount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    university: "Bahir Dar University",
    campus: "Poly(BiT)",
    faculty: "Electrical & Computer Engineering",
    department: "Electrical Engineering",
    program: "BSc",
    firstName: "",
    lastName: "",
    userId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Campus → Faculties mapping
  const facultiesByCampus = {
    "Poly(BiT)": [
      "Electrical & Computer Engineering",
      "Computing",
      "Mechanical & Industrial Engineering",
      "Civil & Water Resource Engineering",
      "Food & Chemical Engineering",
      "Material Science & Engineering",
    ],
    Selam: ["Textile Engineering", "Fashion Design", "Apparel Technology"],
    Peda: [
      "Social Sciences",
      "Business & Economics",
      "Education",
      "Law & Governance",
      "Languages & Communication",
    ],
    Zenzelima: [
      "Plant Science",
      "Animal & Veterinary Science",
      "Natural Resources & Environment",
      "Agricultural Economics & Agribusiness",
      "Food Science & Technology",
    ],
    Yibab: [
      "Medicine",
      "Nursing & Midwifery",
      "Pharmacy & Pharmaceutical Sciences",
      "Apllied Health Sciences",
      "Dental & Oral Health",
      "Health Management / Public Health",
    ],
    Sebatamit: [],
  };

  // Faculty → Departments mapping
  const departmentsByFaculty = {
    "Electrical & Computer Engineering": ["Electrical Engineering", "Computer Engineering"],
    Computing: [
      "Software Engineering",
      "Computer Science",
      "Information System",
      "Information Technology",
      "Cyber Security",
    ],
    "Mechanical & Industrial Engineering": ["Mechanical Engineering", "Industrial Engineering"],
    "Civil & Water Resource Engineering": [
      "Civil Engineering",
      "Irrigation & Water Resource Engineering",
      "Hydraulic & Water Resource Engineering",
    ],
    "Food & Chemical Engineering": ["Food Engineering", "Chemical Engineering"],
    "Material Science & Engineering": ["Material Science & Engineering"],
    "Textile Engineering": ["Textile Production", "Textile Technology"],
    "Fashion Design": ["Garment Design", "Accessory Design"],
    "Apparel Technology": ["Clothing Construction", "Pattern Making"],
    "Social Sciences": ["Sociology", "Political Science", "Anthropology", "Psychology"],
    "Business & Economics": ["Economics", "Accounting", "Management", "Marketing"],
    Education: ["Primary Education", "Secondary Education"],
    "Law & Governance": ["Law", "Public Administration"],
    "Languages & Communication": ["English", "Journalism", "Media Studies"],
    "Plant Science": ["Agronomy", "Horticulture", "Plant Protection"],
    "Animal & Veterinary Science": ["Animal Science", "Veterinary Science"],
    "Natural Resources & Environment": ["Soil Science", "Forestry", "Water Resource Management"],
    "Agricultural Economics & Agribusiness": [
      "Agricultural Economics",
      "Agribusiness Management",
    ],
    "Food Science & Technology": ["Food Processing", "Nutrition", "Post-Harvest Technology"],
    Medicine: ["General Medicine", "Surgery", "Pediatrics", "Public Health"],
    "Nursing & Midwifery": ["Nursing Science", "Midwifery"],
    "Pharmacy & Pharmaceutical Sciences": ["Pharmacy", "Clinical Pharmacy", "Pharmacology"],
    "Allied Health Sciences": [
      "Medical Lab",
      "Physiotherapy",
      "Radiology",
      "Nutrition & Dietetics",
    ],
    "Dental & Oral Health": ["Dentistry", "Oral Hygiene"],
    "Health Management / Public Health": [
      "Health Policy",
      "Epidemiology",
      "Community Health",
    ],
  };

  const campuses = Object.keys(facultiesByCampus);
  const programs = ["BSc", "MSc", "PhD"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "campus") {
      const firstFaculty = facultiesByCampus[value][0] || "";
      const firstDepartment = firstFaculty
        ? departmentsByFaculty[firstFaculty][0]
        : "";
      setFormData({
        ...formData,
        campus: value,
        faculty: firstFaculty,
        department: firstDepartment,
      });
      setErrors({ ...errors, campus: "", faculty: "", department: "" });
      return;
    }

    if (name === "faculty") {
      const firstDepartment = departmentsByFaculty[value][0] || "";
      setFormData({ ...formData, faculty: value, department: firstDepartment });
      setErrors({ ...errors, faculty: "", department: "" });
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.userId.trim()) newErrors.userId = "User ID is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 REAL BACKEND REQUEST (NO MOCK, NO LOCALSTORAGE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      userId: formData.userId,
      email: formData.email,
      password: formData.password,
      university: formData.university,
      campus: formData.campus,
      faculty: formData.faculty,
      department: formData.department,
      program: formData.program,
    };

    try {
      await axios.post(
        "http://localhost:8080/api/auth/user",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);

    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Email already exists!");
      } else {
        toast.error("Registration failed. Try again.");
      }
    }
  };

  return (
    <div className="create-account-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <form className="create-account-form" onSubmit={handleSubmit}>
        <h1>Create Your Account</h1>

        <h2>Institutional Information</h2>
        <input type="text" value={formData.university} readOnly />

        <select name="campus" value={formData.campus} onChange={handleChange}>
          {campuses.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        {errors.campus && <span className="error">{errors.campus}</span>}

        <select name="faculty" value={formData.faculty} onChange={handleChange}>
          {(facultiesByCampus[formData.campus] || []).map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        {errors.faculty && <span className="error">{errors.faculty}</span>}

        <select name="department" value={formData.department} onChange={handleChange}>
          {(departmentsByFaculty[formData.faculty] || []).map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        {errors.department && <span className="error">{errors.department}</span>}

        <div className="radio-group">
          {programs.map((p) => (
            <label key={p}>
              <input
                type="radio"
                name="program"
                value={p}
                checked={formData.program === p}
                onChange={handleChange}
              />
              {p}
            </label>
          ))}
        </div>
        {errors.program && <span className="error">{errors.program}</span>}

        <h2>Personal Information</h2>

        <input name="firstName" placeholder="First Name" onChange={handleChange} />
        {errors.firstName && <span className="error">{errors.firstName}</span>}

        <input name="lastName" placeholder="Last Name" onChange={handleChange} />
        {errors.lastName && <span className="error">{errors.lastName}</span>}

        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}

        <input name="userId" placeholder="User ID" onChange={handleChange} />
        {errors.userId && <span className="error">{errors.userId}</span>}

        <input name="email" placeholder="Email" onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}

        <button type="submit">Create Account</button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default CreateAccount;
