import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.title}>📚 Academic Gradebook</h1>
        <div style={styles.userInfo}>
          <span style={styles.userName}>{user?.full_name}</span>
          <span style={styles.role}>
            {user?.role === 'teacher' ? '👨‍🏫 Преподаватель' : '👨‍🎓 Студент'}
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Выход
          </button>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    fontSize: '1rem',
    fontWeight: '500',
  },
  role: {
    background: 'rgba(255,255,255,0.2)',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'background 0.3s',
  },
};

export default Header;