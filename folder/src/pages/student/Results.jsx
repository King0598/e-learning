// Results.jsx
import React, { useState, useEffect } from "react";
import "../../index.css"; // Optional: use your existing styles

export default function Results({ studentId }) {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    fetch("http://localhost:5000/api/marks")
      .then((res) => res.json())
      .then((data) => {
        // Filter marks only for this student
        const studentMarks = data.filter((m) => m.studentId === studentId);
        setMarks(studentMarks);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [studentId]);

  if (loading) return <p>Loading your results...</p>;
  if (marks.length === 0) return <p>No results found for your ID.</p>;

  return (
    <div className="marksheet-page">
      <h2>Your Results</h2>
      <table className="marksheet-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Mid (25%)</th>
            <th>Final (50%)</th>
            <th>Assignment (15%)</th>
            <th>Project (10%)</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((m) => (
            <tr key={m.id}>
              <td>{m.studentId}</td>
              <td>{m.name}</td>
              <td>{m.mid}</td>
              <td>{m.final}</td>
              <td>{m.assignment}</td>
              <td>{m.project}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
