import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../services/api";

export default function AddTeacher() {
  // Constants for Cascading Dropdowns (Copied from CreateAccount.jsx)
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
  const programs = ["BSc", "MSc", "PhD"]; // Dropdown options

  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    userId: "",
    password: "",
    university: "Bahir Dar University",
    campus: "Poly(BiT)", // Default
    faculty: "",
    department: "",
    program: "BSc", // Default
    course: "",
  };

  const [form, setForm] = useState(initialState);
  const [teachers, setTeachers] = useState([]);

  // Set initial faculty/department based on default campus
  useEffect(() => {
    // Only run if empty to avoid overriding user input during edit (if edit logic existed)
    if (!form.faculty) {
      const firstFaculty = facultiesByCampus[form.campus][0] || "";
      const firstDepartment = firstFaculty ? departmentsByFaculty[firstFaculty][0] : "";
      setForm(prev => ({ ...prev, faculty: firstFaculty, department: firstDepartment }));
    }
  }, []); // Run once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "campus") {
      const firstFaculty = facultiesByCampus[value][0] || "";
      const firstDepartment = firstFaculty ? departmentsByFaculty[firstFaculty][0] : "";
      setForm({
        ...form,
        campus: value,
        faculty: firstFaculty,
        department: firstDepartment,
      });
      return;
    }

    if (name === "faculty") {
      const firstDepartment = departmentsByFaculty[value][0] || "";
      setForm({ ...form, faculty: value, department: firstDepartment });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await API.get("/users/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to fetch teachers.");
    }
  };

  const deleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await API.delete(`/users/${id}`);
      setTeachers(teachers.filter((t) => t.id !== id));
      toast.success("Teacher deleted successfully!");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error("Failed to delete teacher.");
    }
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.userId || !form.password) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const payload = { ...form, role: "TEACHER" };
      await API.post("/auth/user", payload); // Assuming /auth/user is the registration endpoint as per CreateAccount.jsx (Wait, CreateAccount.jsx uses /api/auth/user, AddTeacher used /auth/register? Let's check Step 422: API.post("/auth/register", ...))
      // Step 422 used /auth/register. CreateAccount used /api/auth/user.
      // AuthController (Step 401) has @PostMapping("/user") -> registerUser.
      // And @PostMapping("/login").
      // I don't see "/register". 
      // Step 422 AddTeacher code had `API.post("/auth/register")`. Wait.
      // Step 401 AuthController does NOT have "/register". Only "/user".
      // So AddTeacher WAS BROKEN effectively or using a different backend?
      // I should use `/auth/user`.

      toast.success("Teacher added successfully!");
      setForm({
        ...initialState,
        campus: "Poly(BiT)", // Reset to default
        faculty: facultiesByCampus["Poly(BiT)"][0],
        department: departmentsByFaculty[facultiesByCampus["Poly(BiT)"][0]][0],
        program: "BSc"
      });
      fetchTeachers();
    } catch (error) {
      console.error("Error adding teacher:", error);
      // CreateAccount uses axios directly to http://localhost:8080.
      // AddTeacher uses API instance. API instance probably has baseURL.
      // I'll stick to API instance but correct the endpoint to "/auth/user".
      toast.error(error.response?.data?.message || "Failed to add teacher");
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="form-container" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2>Add Teacher</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>

          {/* Personal Info */}
          <input name="firstName" placeholder="First Name *" value={form.firstName} onChange={handleChange} />
          <input name="lastName" placeholder="Last Name *" value={form.lastName} onChange={handleChange} />
          <input name="userId" placeholder="Teacher ID *" value={form.userId} onChange={handleChange} />
          <input name="email" placeholder="Email *" value={form.email} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password *" value={form.password} onChange={handleChange} />

          <input name="university" placeholder="University" value={form.university} readOnly />

          {/* Cascading Dropdowns */}
          <select name="campus" value={form.campus} onChange={handleChange}>
            <option value="" disabled>Select Campus</option>
            {campuses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select name="faculty" value={form.faculty} onChange={handleChange}>
            <option value="" disabled>Select Faculty</option>
            {(facultiesByCampus[form.campus] || []).map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          <select name="department" value={form.department} onChange={handleChange}>
            <option value="" disabled>Select Department</option>
            {(departmentsByFaculty[form.faculty] || []).map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select name="program" value={form.program} onChange={handleChange}>
            <option value="" disabled>Select Program</option>
            {programs.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <input name="course" placeholder="Assigned Course" value={form.course} onChange={handleChange} style={{ gridColumn: "span 2" }} />
        </div>
        <button className="save-btn" onClick={handleSubmit} style={{ marginTop: "20px", width: "100%" }}>
          Add Teacher
        </button>
      </div>

      <br />

      <div className="table-container" style={{ maxWidth: "100%", margin: "20px auto", overflowX: "auto" }}>
        <h3>Registered Teachers</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Course</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No teachers found</td>
              </tr>
            ) : (
              teachers.map((t) => (
                <tr key={t.id}>
                  <td>{t.userId}</td>
                  <td>{t.firstName} {t.lastName}</td>
                  <td>{t.email}</td>
                  <td>{t.department || "-"}</td>
                  <td>{t.course || "-"}</td>
                  <td>
                    <button onClick={() => deleteTeacher(t.id)} className="delete-btn">
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}