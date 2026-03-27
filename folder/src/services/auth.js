import API from './api';

export const authService = {
    // Register new user
    async register(userData) {
        try {
            const response = await API.post('/auth/register', userData);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: response.data.id,
                    userId: response.data.userId || response.data.studentId,
                    email: response.data.email,
                    fullName: response.data.fullName,
                    role: response.data.role,
                    department: response.data.department,
                    program: response.data.program,
                    campus: response.data.campus,
                    university: response.data.university,
                    faculty: response.data.faculty
                }));
            }

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    },

    // Login user
    async login(credentials) {
        try {
            const response = await API.post('/auth/login', credentials);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: response.data.id,
                    userId: response.data.userId || response.data.studentId,
                    email: response.data.email,
                    fullName: response.data.fullName,
                    role: response.data.role,
                    department: response.data.department,
                    program: response.data.program,
                    campus: response.data.campus,
                    university: response.data.university,
                    faculty: response.data.faculty
                }));
            }

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    },

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Do not force redirect here, let the UI or Context handle it
    },

    // Check if user is authenticated
    isAuthenticated() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Get user role
    getUserRole() {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    },

    // Validate token with backend
    async validateToken() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return { valid: false };

            // Use profile endpoint to validate token
            await API.get('/auth/profile');
            return { valid: true };
        } catch (error) {
            return { valid: false };
        }
    }
};