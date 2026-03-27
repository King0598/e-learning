import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../services/api";

export default function ManageStudent() {
    const [students, setStudents] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        id: "", // Database ID (hidden or used for update)
        userId: "", // Student ID (e.g. STU001)
        firstName: "",
        lastName: "",
        department: "",
        email: "",
    });

    // Load students from API on mount
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await API.get("/users/students");
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
            toast.error("Failed to fetch students.");
        }
    };

    // Handle Form Submit (Update only for now, or re-enable Add if needed)
    const handleSubmit = async () => {
        if (!form.userId || !form.firstName) {
            toast.error("Please fill required fields!");
            return;
        }

        try {
            if (isEditing) {
                // UPDATE
                await API.put(`/users/${form.id}`, form);
                toast.success("Student updated successfully!");
                setIsEditing(false);
            } else {
                // ADD (Optional, if we want to add students here, otherwise just clear)
                toast.info("To add students, use the registration page.");
                return;
            }

            setForm({ id: "", userId: "", firstName: "", lastName: "", department: "", email: "" });
            fetchStudents(); // Refresh list
        } catch (error) {
            console.error("Error saving student:", error);
            toast.error("Failed to save student.");
        }
    };

    // Delete student
    const deleteStudent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;

        try {
            await API.delete(`/users/${id}`);
            setStudents(students.filter((s) => s.id !== id));
            toast.success("Student deleted.");
        } catch (error) {
            console.error("Error deleting student:", error);
            toast.error("Failed to delete student.");
        }
    };

    // Edit student
    const editStudent = (student) => {
        setForm({
            id: student.id,
            userId: student.userId,
            firstName: student.firstName,
            lastName: student.lastName,
            department: student.department || "",
            email: student.email,
        });
        setIsEditing(true);
    };

    return (
        <div>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="form-container">
                <h2>{isEditing ? "Edit Student" : "Manage Students"}</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <input
                        placeholder="Student ID"
                        value={form.userId}
                        onChange={(e) => setForm({ ...form, userId: e.target.value })}
                        disabled={!isEditing} // ID usually immutable or managed strictly
                    />
                    <input
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                    <input
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                    <input
                        placeholder="Department"
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        style={{ gridColumn: "span 2" }}
                    />
                </div>

                {isEditing && (
                    <div style={{ marginTop: "10px" }}>
                        <button className="save-btn" onClick={handleSubmit}>Update Student</button>
                        <button className="delete-btn" onClick={() => { setIsEditing(false); setForm({ id: "", userId: "", firstName: "", lastName: "", department: "", email: "" }); }} style={{ marginLeft: "10px", backgroundColor: "#666" }}>Cancel</button>
                    </div>
                )}
            </div>

            <br />

            {/* Table Display */}
            <div className="table-container">
                <h3>Student List</h3>

                <div style={{ overflowX: "auto" }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>University</th>
                                <th>Campus</th>
                                <th>Faculty</th>
                                <th>Department</th>
                                <th>Program</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: "center" }}>
                                        No students found
                                    </td>
                                </tr>
                            ) : (
                                students.map((s) => (
                                    <tr key={s.id}>
                                        <td>{s.userId}</td>
                                        <td>{s.firstName} {s.lastName}</td>
                                        <td>{s.email}</td>
                                        <td>{s.phoneNumber || "-"}</td>
                                        <td>{s.university || "-"}</td>
                                        <td>{s.campus || "-"}</td>
                                        <td>{s.faculty || "-"}</td>
                                        <td>{s.department || "-"}</td>
                                        <td>{s.program || "-"}</td>
                                        <td style={{ minWidth: "150px" }}>
                                            <button
                                                onClick={() => editStudent(s)}
                                                style={{ marginRight: "10px", padding: "5px 10px", cursor: "pointer" }}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => deleteStudent(s.id)}
                                                className="delete-btn"
                                            >
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
        </div>
    );
}
