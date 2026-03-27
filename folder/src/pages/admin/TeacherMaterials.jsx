import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export default function TeacherMaterials({ type = "materials" }) {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("teachers"); // "teachers", "courses", "courseDetails"
  const { user } = useAuth();

  const isVideos = type === "videos";
  const title = isVideos ? "Teacher Videos" : "Teacher Materials";
  const icon = isVideos ? "🎥" : "📄";

  useEffect(() => {
    // Only fetch teachers if user is admin
    if (user && user.role === 'ADMIN') {
      fetchTeachers();
    }
  }, [user]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      console.log("Fetching teachers...");
      console.log("Current user:", user);
      console.log("Token:", localStorage.getItem('token'));
      
      const response = await API.get("/admin/teachers");
      console.log("Teachers response:", response.data);
      setTeachers(response.data.teachers || []);
      
      if (!response.data.teachers || response.data.teachers.length === 0) {
        toast.info("No teachers found in the system");
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      console.error("Error response:", error.response);
      
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Admin privileges required.");
      } else {
        toast.error("Failed to fetch teachers. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherCourses = async (teacherId) => {
    setLoading(true);
    try {
      const response = await API.get(`/admin/teachers/${teacherId}/courses`);
      console.log("Teacher courses response:", response.data);
      setSelectedTeacher(response.data.teacher);
      setTeacherCourses(response.data.courses || []);
      setView("courses");
    } catch (error) {
      console.error("Error fetching teacher courses:", error);
      toast.error("Failed to fetch teacher courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    setLoading(true);
    try {
      const response = await API.get(`/admin/courses/${courseId}`);
      console.log("Course details response:", response.data);
      setSelectedCourse(response.data);
      setView("courseDetails");
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete the course "${courseTitle}"? This will also delete all associated materials and videos.`)) {
      return;
    }

    setLoading(true);
    try {
      await API.delete(`/admin/courses/${courseId}`);
      toast.success("Course deleted successfully");
      
      // Refresh the courses list
      if (selectedTeacher) {
        fetchTeacherCourses(selectedTeacher.userId);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (view === "courseDetails") {
      setView("courses");
      setSelectedCourse(null);
    } else if (view === "courses") {
      setView("teachers");
      setSelectedTeacher(null);
      setTeacherCourses([]);
    }
  };

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  const renderBreadcrumb = () => (
    <div className="breadcrumb">
      <span 
        className={view === "teachers" ? "active" : "link"}
        onClick={() => view !== "teachers" && setView("teachers")}
      >
        Teachers
      </span>
      {selectedTeacher && (
        <>
          <span className="separator"> / </span>
          <span 
            className={view === "courses" ? "active" : "link"}
            onClick={() => view === "courseDetails" && setView("courses")}
          >
            {selectedTeacher.fullName}
          </span>
        </>
      )}
      {selectedCourse && (
        <>
          <span className="separator"> / </span>
          <span className="active">{selectedCourse.title}</span>
        </>
      )}
    </div>
  );

  const renderTeachersList = () => (
    <div className="teachers-list">
      <div className="page-header">
        <h1>{icon} {title}</h1>
        <p>Manage courses and {isVideos ? 'videos' : 'materials'} uploaded by teachers</p>
        
        {/* Debug info */}
        <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
          <strong>Debug Info:</strong><br/>
          User: {user ? `${user.fullName} (${user.role})` : 'Not logged in'}<br/>
          Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}<br/>
          Teachers loaded: {teachers.length}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading teachers...</div>
      ) : (
        <div className="teachers-grid">
          {teachers.map((teacher) => (
            <div 
              key={teacher.id} 
              className="teacher-card"
              onClick={() => fetchTeacherCourses(teacher.userId)}
            >
              <div className="teacher-header">
                <div className="teacher-avatar">
                  {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                </div>
                <div className="teacher-info">
                  <h3>{teacher.fullName}</h3>
                  <p className="department">{teacher.department}</p>
                  <p className="email">{teacher.email}</p>
                </div>
              </div>
              
              <div className="teacher-stats">
                <div className="stat">
                  <span className="count">{teacher.coursesCount}</span>
                  <span className="label">Courses</span>
                </div>
                <div className="stat">
                  <span className="count">{teacher.materialsCount}</span>
                  <span className="label">Materials</span>
                </div>
                <div className="stat">
                  <span className="count">{teacher.videosCount}</span>
                  <span className="label">Videos</span>
                </div>
              </div>

              <div className="teacher-status">
                <span className={`status ${teacher.active ? 'active' : 'inactive'}`}>
                  {teacher.active ? '✅ Active' : '❌ Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {teachers.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No teachers found</h3>
          <p>No teachers have been registered yet.</p>
        </div>
      )}
    </div>
  );

  const renderTeacherCourses = () => (
    <div className="teacher-courses">
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          ← Back to Teachers
        </button>
        <div className="teacher-info-header">
          <h1>📚 {selectedTeacher.fullName}'s Courses</h1>
          <p>{selectedTeacher.department} Department</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <div className="courses-grid">
          {teacherCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                {course.coverPage && (
                  <div className="course-cover">
                    <img src={course.coverPage} alt={course.title} />
                  </div>
                )}
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p className="course-code">{course.code}</p>
                  <p className="course-description">{course.description}</p>
                </div>
              </div>

              <div className="course-details">
                <div className="detail-row">
                  <span className="label">📚 Open Enrollment</span>
                  <span className="value">📅 {course.semester ? `Semester ${course.semester}` : 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">⏱️ Credit Hours</span>
                  <span className="value">{course.credit} Hours</span>
                </div>
              </div>

              <div className="course-stats">
                <div className="stat">
                  <span className="count">{course.materialsCount}</span>
                  <span className="label">Materials</span>
                </div>
                <div className="stat">
                  <span className="count">{course.videosCount}</span>
                  <span className="label">Videos</span>
                </div>
              </div>

              <div className="course-actions">
                <button 
                  className="btn-view"
                  onClick={() => fetchCourseDetails(course.id)}
                >
                  📋 View Details
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => deleteCourse(course.id, course.title)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {teacherCourses.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No courses found</h3>
          <p>{selectedTeacher.fullName} hasn't uploaded any courses yet.</p>
        </div>
      )}
    </div>
  );

  const renderCourseDetails = () => (
    <div className="course-details-view">
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          ← Back to Courses
        </button>
        <div className="course-info-header">
          <h1>📖 {selectedCourse.title}</h1>
          <p>{selectedCourse.code} - {selectedCourse.department}</p>
        </div>
      </div>

      <div className="course-content">
        <div className="course-overview">
          <div className="overview-card">
            <h3>Course Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Course Code:</span>
                <span className="value">{selectedCourse.code}</span>
              </div>
              <div className="info-item">
                <span className="label">Credit Hours:</span>
                <span className="value">{selectedCourse.credit}</span>
              </div>
              <div className="info-item">
                <span className="label">Semester:</span>
                <span className="value">{selectedCourse.semester}</span>
              </div>
              <div className="info-item">
                <span className="label">Department:</span>
                <span className="value">{selectedCourse.department}</span>
              </div>
              {selectedCourse.teacher && (
                <div className="info-item">
                  <span className="label">Instructor:</span>
                  <span className="value">{selectedCourse.teacher.fullName}</span>
                </div>
              )}
            </div>
            {selectedCourse.description && (
              <div className="description">
                <h4>Description</h4>
                <p>{selectedCourse.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="course-materials">
          <div className="materials-section">
            <h3>📄 Materials ({selectedCourse.materials?.length || 0})</h3>
            {selectedCourse.materials && selectedCourse.materials.length > 0 ? (
              <div className="materials-list">
                {selectedCourse.materials.map((material) => (
                  <div key={material.id} className="material-item">
                    <div className="material-icon">📄</div>
                    <div className="material-info">
                      <h4>{material.title}</h4>
                      <p>{material.fileName}</p>
                      <span className="file-type">{material.fileType}</span>
                    </div>
                    <div className="material-date">
                      {new Date(material.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-content">No materials uploaded</p>
            )}
          </div>

          <div className="videos-section">
            <h3>🎥 Videos ({selectedCourse.videos?.length || 0})</h3>
            {selectedCourse.videos && selectedCourse.videos.length > 0 ? (
              <div className="videos-list">
                {selectedCourse.videos.map((video) => (
                  <div key={video.id} className="video-item">
                    <div className="video-icon">🎥</div>
                    <div className="video-info">
                      <h4>{video.title}</h4>
                      <p>{video.fileName}</p>
                      <span className="file-type">{video.fileType}</span>
                    </div>
                    <div className="video-date">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-content">No videos uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="teacher-materials">
      {renderBreadcrumb()}
      
      {view === "teachers" && renderTeachersList()}
      {view === "courses" && renderTeacherCourses()}
      {view === "courseDetails" && renderCourseDetails()}

      <ToastContainer position="top-right" autoClose={3000} />

      <style jsx>{`
        .teacher-materials {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .breadcrumb {
          margin-bottom: 2rem;
          font-size: 1rem;
          color: #666;
        }

        .breadcrumb .link {
          color: #3498db;
          cursor: pointer;
          text-decoration: underline;
        }

        .breadcrumb .active {
          color: #2c3e50;
          font-weight: 500;
        }

        .breadcrumb .separator {
          margin: 0 0.5rem;
          color: #999;
        }

        .page-header {
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .back-btn {
          padding: 0.5rem 1rem;
          background: #95a5a6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .back-btn:hover {
          background: #7f8c8d;
        }

        .page-header h1 {
          color: #2c3e50;
          margin: 0;
        }

        .page-header p {
          color: #7f8c8d;
          margin: 0;
        }

        .loading, .empty-state {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .teachers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .teacher-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #e1e8ed;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .teacher-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }

        .teacher-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .teacher-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .teacher-info h3 {
          margin: 0 0 0.25rem 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .teacher-info .department {
          color: #3498db;
          font-weight: 500;
          margin: 0;
          font-size: 0.9rem;
        }

        .teacher-info .email {
          color: #7f8c8d;
          margin: 0;
          font-size: 0.8rem;
        }

        .teacher-stats {
          display: flex;
          justify-content: space-around;
          margin: 1rem 0;
          padding: 1rem 0;
          border-top: 1px solid #ecf0f1;
          border-bottom: 1px solid #ecf0f1;
        }

        .stat {
          text-align: center;
        }

        .stat .count {
          display: block;
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .stat .label {
          font-size: 0.8rem;
          color: #7f8c8d;
        }

        .teacher-status {
          text-align: center;
        }

        .status.active {
          color: #27ae60;
          font-weight: 500;
        }

        .status.inactive {
          color: #e74c3c;
          font-weight: 500;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
        }

        .course-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #e1e8ed;
          transition: transform 0.3s ease;
        }

        .course-card:hover {
          transform: translateY(-2px);
        }

        .course-header {
          padding: 1.5rem;
          border-bottom: 1px solid #ecf0f1;
        }

        .course-cover {
          width: 100%;
          height: 120px;
          margin-bottom: 1rem;
          border-radius: 8px;
          overflow: hidden;
        }

        .course-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .course-info h3 {
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
          font-size: 1.2rem;
        }

        .course-code {
          color: #3498db;
          font-weight: 500;
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
        }

        .course-description {
          color: #7f8c8d;
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .course-details {
          padding: 1rem 1.5rem;
          background: #f8f9fa;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .detail-row:last-child {
          margin-bottom: 0;
        }

        .detail-row .label {
          font-size: 0.9rem;
          color: #666;
        }

        .detail-row .value {
          font-size: 0.9rem;
          color: #2c3e50;
          font-weight: 500;
        }

        .course-stats {
          display: flex;
          justify-content: space-around;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #ecf0f1;
        }

        .course-actions {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
        }

        .btn-view, .btn-delete {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .btn-view {
          background: #3498db;
          color: white;
        }

        .btn-view:hover {
          background: #2980b9;
        }

        .btn-delete {
          background: #e74c3c;
          color: white;
        }

        .btn-delete:hover {
          background: #c0392b;
        }

        .course-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }

        .overview-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #e1e8ed;
          height: fit-content;
        }

        .overview-card h3 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }

        .info-grid {
          display: grid;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #ecf0f1;
        }

        .info-item .label {
          color: #666;
          font-weight: 500;
        }

        .info-item .value {
          color: #2c3e50;
          font-weight: 500;
        }

        .description h4 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .description p {
          color: #666;
          line-height: 1.6;
        }

        .materials-section, .videos-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #e1e8ed;
          margin-bottom: 2rem;
        }

        .materials-section h3, .videos-section h3 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }

        .materials-list, .videos-list {
          display: grid;
          gap: 1rem;
        }

        .material-item, .video-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e1e8ed;
        }

        .material-icon, .video-icon {
          font-size: 2rem;
          width: 50px;
          text-align: center;
        }

        .material-info, .video-info {
          flex: 1;
        }

        .material-info h4, .video-info h4 {
          margin: 0 0 0.25rem 0;
          color: #2c3e50;
          font-size: 1rem;
        }

        .material-info p, .video-info p {
          margin: 0 0 0.25rem 0;
          color: #666;
          font-size: 0.9rem;
        }

        .file-type {
          background: #3498db;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .material-date, .video-date {
          color: #999;
          font-size: 0.8rem;
        }

        .no-content {
          text-align: center;
          color: #999;
          font-style: italic;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .teacher-materials {
            padding: 1rem;
          }
          
          .teachers-grid, .courses-grid {
            grid-template-columns: 1fr;
          }
          
          .course-content {
            grid-template-columns: 1fr;
          }
          
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}