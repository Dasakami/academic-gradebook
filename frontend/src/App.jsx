import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import TeacherPanel from './pages/TeacherPanel';
import StudentPanel from './pages/StudentPanel';
import Loader from './components/common/Loader';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader message="Проверка авторизации..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />;
  }

  return children;
};


const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader message="Загрузка..." />;
  }

  if (user) {
    return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />;
  }

  return children;
};

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherPanel />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentPanel />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;