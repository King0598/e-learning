# 📚 Teacher Materials Admin Guide

## 🎯 Overview

The Teacher Materials section allows admins to:
- **View all registered teachers** with their departments
- **Browse teacher courses** and uploaded materials
- **View course details** with materials and videos
- **Delete courses** and associated content
- **Monitor teacher activity** and content uploads

## 🚀 How to Access

### Step 1: Login as Admin
1. Go to: `http://localhost:5173/login`
2. Use admin credentials:
   - **Email**: admin@test.com
   - **Password**: admin123

### Step 2: Navigate to Teacher Materials
1. After login, you'll be redirected to `/admin/dashboard`
2. In the sidebar, click **"📄 Teacher Materials"**

## 📋 Features Overview

### 1. **Teachers List View**
- **Teacher Cards**: Shows each teacher with avatar, name, department
- **Statistics**: Displays courses, materials, and videos count per teacher
- **Status Indicator**: Shows if teacher account is active
- **Click to Navigate**: Click any teacher card to view their courses

### 2. **Teacher Courses View**
- **Course Cards**: Displays courses in card format similar to your reference image
- **Course Information**: Shows title, code, description, enrollment status
- **Credit Hours**: Displays course duration and credit information
- **Statistics**: Shows materials and videos count per course
- **Actions**: View details and delete buttons for each course

### 3. **Course Details View**
- **Course Overview**: Complete course information and instructor details
- **Materials List**: All uploaded materials with file types and dates
- **Videos List**: All uploaded videos with file types and dates
- **Navigation**: Breadcrumb navigation between views

## 🎨 UI Design (Matching Your Reference)

The course cards are designed to match your reference image:

```
┌─────────────────────────────────────┐
│ Course Title                        │
│ COURSE-CODE                         │
│                                     │
│ 📚 Open Enrollment  📅 Semester X   │
│ ⏱️ Credit Hours     X Hours         │
│                                     │
│ Materials: X    Videos: X           │
│                                     │
│ [📋 View Details] [🗑️ Delete]      │
└─────────────────────────────────────┘
```

## 🔧 Backend API Endpoints

### Get All Teachers
```
GET /api/admin/teachers
```
Returns list of teachers with statistics.

### Get Teacher Courses
```
GET /api/admin/teachers/{teacherId}/courses
```
Returns teacher's courses with materials and videos.

### Get Course Details
```
GET /api/admin/courses/{courseId}
```
Returns detailed course information.

### Delete Course
```
DELETE /api/admin/courses/{courseId}
```
Deletes course and all associated materials/videos.

## 📊 Sample Data Structure

### Teacher Response
```json
{
  "teachers": [
    {
      "id": 1,
      "userId": "TEACH001",
      "fullName": "John Doe",
      "department": "Computer Science",
      "email": "john@university.edu",
      "coursesCount": 3,
      "materialsCount": 15,
      "videosCount": 8,
      "active": true
    }
  ]
}
```

### Course Response
```json
{
  "courses": [
    {
      "id": 1,
      "code": "CS101",
      "title": "Introduction to Programming",
      "description": "Basic programming concepts",
      "credit": 3,
      "semester": 1,
      "materialsCount": 5,
      "videosCount": 3,
      "coverPage": "/uploads/course-cover.jpg"
    }
  ]
}
```

## 🛠️ Setup Instructions

### 1. Create Test Data
Run this SQL to create sample teachers and courses:

```sql
-- Create a teacher
INSERT INTO user (first_name, last_name, user_id, email, password, role, department, active, created_at, updated_at) 
VALUES ('John', 'Doe', 'TEACH001', 'john.doe@university.edu', 'teacher123', 'TEACHER', 'Computer Science', true, NOW(), NOW());

-- Create a course
INSERT INTO courses (code, title, description, credit, semester, department, teacher_id, active, created_at, updated_at)
VALUES ('CS101', 'Introduction to Programming', 'Learn basic programming concepts', 3, 1, 'Computer Science', 'TEACH001', true, NOW(), NOW());

-- Create sample materials
INSERT INTO materials (title, file_name, file_type, department, program, teacher_id, course_id, data, created_at)
VALUES ('Lecture 1 Notes', 'lecture1.pdf', 'application/pdf', 'Computer Science', 'Software Engineering', 'TEACH001', 1, 'sample data', NOW());
```

### 2. Test the Flow
1. **Login as admin** → Should redirect to admin dashboard
2. **Click Teacher Materials** → Should show teachers list
3. **Click a teacher** → Should show their courses
4. **Click View Details** → Should show course details
5. **Click Delete** → Should delete course with confirmation

## 🎯 Key Features Implemented

### ✅ **Teacher Management**
- View all registered teachers
- See teacher statistics (courses, materials, videos)
- Filter by department and status
- Teacher profile information display

### ✅ **Course Management**
- Browse courses by teacher
- View course details and content
- Delete courses with confirmation
- Course statistics and metadata

### ✅ **Content Overview**
- Materials list with file information
- Videos list with file information
- Upload dates and file types
- Content organization by course

### ✅ **Navigation & UX**
- Breadcrumb navigation
- Back buttons for easy navigation
- Loading states and error handling
- Responsive design for all devices

### ✅ **Admin Controls**
- Role-based access (admin only)
- Course deletion with cascade (removes materials/videos)
- Confirmation dialogs for destructive actions
- Real-time updates after actions

## 🔒 Security Features

- **Admin-only access** with JWT token validation
- **Role-based authorization** using Spring Security
- **CSRF protection** disabled for API endpoints
- **Input validation** on all endpoints
- **Error handling** with proper HTTP status codes

## 📱 Responsive Design

The interface works on:
- **Desktop**: Full grid layout with multiple columns
- **Tablet**: Responsive grid that adapts to screen size
- **Mobile**: Single column layout with touch-friendly buttons

## 🚨 Important Notes

### For Development
- Debug endpoints are enabled for testing
- Admin access is enforced through JWT roles
- File uploads are stored in database as byte arrays

### For Production
- Remove debug and migration endpoints
- Implement proper file storage (cloud storage)
- Add rate limiting and additional security measures
- Enable HTTPS and secure headers

## 📞 Troubleshooting

### Common Issues

**"Access Denied" Error**:
- Ensure you're logged in as admin
- Check JWT token contains ADMIN role
- Verify admin user exists in database

**Teachers Not Loading**:
- Check if teachers exist in database with role='TEACHER'
- Verify API endpoint is accessible
- Check browser console for errors

**Courses Not Showing**:
- Ensure courses have teacher_id field populated
- Check if teacher has uploaded any courses
- Verify course-teacher relationship in database

### Quick Fixes

```sql
-- Check admin user
SELECT * FROM user WHERE role = 'ADMIN';

-- Check teachers
SELECT * FROM user WHERE role = 'TEACHER';

-- Check courses
SELECT * FROM courses WHERE teacher_id IS NOT NULL;

-- Create test teacher if needed
INSERT INTO user (first_name, last_name, user_id, email, password, role, department, active, created_at, updated_at) 
VALUES ('Test', 'Teacher', 'TEACH999', 'test.teacher@edu.com', 'teacher123', 'TEACHER', 'Computer Science', true, NOW(), NOW());
```

The Teacher Materials section is now fully functional with a modern, responsive interface that matches your design requirements! 🎉