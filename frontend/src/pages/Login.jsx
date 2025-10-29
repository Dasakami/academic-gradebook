import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      navigate(user.role === 'teacher' ? '/teacher' : '/student');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const fillTestCredentials = (role) => {
    if (role === 'teacher') {
      setEmail('teacher@example.com');
      setPassword('teacher123');
    } else {
      setEmail('student1@example.com');
      setPassword('student123');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>📚 Academic Gradebook</h1>
          <p style={styles.subtitle}>Система цифрового зачётного ведомости</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="example@mail.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div style={styles.testAccounts}>
          <p style={styles.testTitle}>Тестовые аккаунты:</p>
          <div style={styles.testButtons}>
            <button 
              onClick={() => fillTestCredentials('teacher')} 
              style={styles.testButton}
            >
              👨‍🏫 Преподаватель
            </button>
            <button 
              onClick={() => fillTestCredentials('student')} 
              style={styles.testButton}
            >
              👨‍🎓 Студент
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
  },
  card: {
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#666',
    fontSize: '0.875rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
    marginTop: '0.5rem',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '0.75rem',
    borderRadius: '5px',
    fontSize: '0.875rem',
  },
  testAccounts: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #eee',
  },
  testTitle: {
    fontSize: '0.875rem',
    color: '#666',
    textAlign: 'center',
    marginBottom: '0.75rem',
  },
  testButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  testButton: {
    flex: 1,
    padding: '0.5rem',
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};

export default Login;