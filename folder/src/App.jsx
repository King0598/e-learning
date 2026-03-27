import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { initAuth } from "./utils/auth";
import Login from "./pages/Login";

// Teacher dashboard pages
import TeacherDashboard from "./pages/TeacherDashboard";
import UploadMaterial from "./pages/UploadMaterial";
import UploadVideo from "./pages/UploadVideo";
import QuizResults from "./pages/Marksheet";
import Marksheet from "./pages/Marksheet";
// admin dashboard

import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import CreateAccount from "./CreateAccount";

import { AuthProvider, useAuth } from './contexts/AuthContext';
import API from './services/api';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

const AppContent = () => {
  useEffect(() => {
    initAuth();
  }, []);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-content">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />

          {/* Teacher Dashboard routes */}
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/upload-material" 
            element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <UploadMaterial />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/upload-video" 
            element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <UploadVideo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/marksheet" 
            element={
              <ProtectedRoute allowedRoles={['TEACHER']}>
                <Marksheet />
              </ProtectedRoute>
            } 
          />

          {/* Admin Dashboard route - Allow admin access without redirect */}
          <Route 
            path="/admin/dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Student Dashboard route */}
          <Route 
            path="/student/dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback/Generic Dashboard */}
          <Route path="/dashboard" element={<div style={{ padding: "2rem" }}><h2>Welcome to the Dashboard</h2><p>Please contact admin if you are not redirected correctly.</p></div>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
