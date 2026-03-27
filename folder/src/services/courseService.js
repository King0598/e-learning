import API from './api';

export const courseService = {
    // Get all courses
    async getAllCourses() {
        try {
            const response = await API.get('/courses');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get course by ID
    async getCourseById(id) {
        try {
            const response = await API.get(`/courses/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get courses by program ID
    async getCoursesByProgram(programId) {
        try {
            const response = await API.get(`/courses/by-program/${programId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new course
    async createCourse(courseData) {
        try {
            // Check if courseData is FormData (for file uploads)
            const isFormData = courseData instanceof FormData;
            const config = isFormData ? {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            } : {};

            const response = await API.post('/courses', courseData, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update course
    async updateCourse(id, courseData) {
        try {
            const response = await API.put(`/courses/${id}`, courseData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete course
    async deleteCourse(id) {
        try {
            await API.delete(`/courses/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    }
};
