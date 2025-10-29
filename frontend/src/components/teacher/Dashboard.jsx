import React, { useState, useEffect } from 'react';
import { assignmentsAPI, gradesAPI, usersAPI } from '../../services/api';
import Loader from '../common/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAssignments: 0,
    totalStudents: 0,
    totalGrades: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [assignmentsRes, studentsRes, gradesRes] = await Promise.all([
        assignmentsAPI.getAll(),
        usersAPI.getStudents(),
        gradesAPI.getAll(),
      ]);

      const grades = gradesRes.data;
      const avgScore = grades.length > 0
        ? grades.reduce((sum, g) => sum + g.score, 0) / grades.length
        : 0;

      setStats({
        totalAssignments: assignmentsRes.data.length,
        totalStudents: studentsRes.data.length,
        totalGrades: grades.length,
        averageScore: avgScore.toFixed(2),
      });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Панель управления</h2>
      
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, ...styles.card1 }}>
          <div style={styles.statIcon}>📝</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.totalAssignments}</div>
            <div style={styles.statLabel}>Заданий</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.card2 }}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.totalStudents}</div>
            <div style={styles.statLabel}>Студентов</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.card3 }}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.totalGrades}</div>
            <div style={styles.statLabel}>Оценок</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.card4 }}>
          <div style={styles.statIcon}>📈</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.averageScore}</div>
            <div style={styles.statLabel}>Средний балл</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    background: 'white',
    borderRadius: '10px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  card1: { borderLeft: '4px solid #667eea' },
  card2: { borderLeft: '4px solid #f093fb' },
  card3: { borderLeft: '4px solid #4facfe' },
  card4: { borderLeft: '4px solid #43e97b' },
  statIcon: {
    fontSize: '2.5rem',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f5',
    borderRadius: '10px',
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#666',
    marginTop: '0.25rem',
  },
};

export default Dashboard;