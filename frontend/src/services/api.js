import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
};


export const usersAPI = {
  getMe: () => api.get('/users/me'),
  getAll: (role) => api.get('/users/', { params: { role } }),
  getStudents: () => api.get('/users/students'),
  getById: (id) => api.get(`/users/${id}`),
};

export const assignmentsAPI = {
  getAll: () => api.get('/assignments/'),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (data) => api.post('/assignments/', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
};


export const gradesAPI = {
  getAll: (params) => api.get('/grades/', { params }),
  getById: (id) => api.get(`/grades/${id}`),
  create: (data) => api.post('/grades/', data),
  update: (id, data) => api.put(`/grades/${id}`, data),
  delete: (id) => api.delete(`/grades/${id}`),
};


export const reportsAPI = {
  getStudentReport: (studentId) => api.get(`/reports/student/${studentId}`),
  getCourseReport: () => api.get('/reports/course'),
};

export default api;