import React, { useState, useEffect } from 'react';
import { gradesAPI, assignmentsAPI } from '../../services/api';
import Loader from '../common/Loader';

const StudentDashboard = () => {
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    averageScore: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gradesRes, assignmentsRes] = await Promise.all([
        gradesAPI.getAll(),
        assignmentsAPI.getAll(),
      ]);

      const myGrades = gradesRes.data;
      const allAssignments = assignmentsRes.data;

      const avgScore = myGrades.length > 0
        ? myGrades.reduce((sum, g) => sum + g.score, 0) / myGrades.length
        : 0;

      setGrades(myGrades);
      setAssignments(allAssignments);
      setStats({
        completed: myGrades.length,
        total: allAssignments.length,
        averageScore: avgScore.toFixed(2),
      });
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📚 Моя успеваемость</h2>

      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #667eea' }}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.completed}/{stats.total}</div>
            <div style={styles.statLabel}>Выполнено заданий</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderLeft: '4px solid #43e97b' }}>
          <div style={styles.statIcon}>⭐</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.averageScore}</div>
            <div style={styles.statLabel}>Средний балл</div>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderLeft: '4px solid #f093fb' }}>
          <div style={styles.statIcon}>📝</div>
          <div style={styles.statInfo}>
            <div style={styles.statValue}>{stats.total - stats.completed}</div>
            <div style={styles.statLabel}>Осталось заданий</div>
          </div>
        </div>
      </div>

      <div style={styles.sections}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>✅ Мои оценки</h3>
          {grades.length === 0 ? (
            <p style={styles.empty}>Оценок пока нет</p>
          ) : (
            <div style={styles.gradesList}>
              {grades.map((grade) => (
                <div key={grade.id} style={styles.gradeCard}>
                  <div style={styles.gradeHeader}>
                    <h4 style={styles.gradeName}>{grade.assignment.title}</h4>
                    <span style={styles.gradeScore}>{grade.score} баллов</span>
                  </div>
                  {grade.comment && (
                    <p style={styles.gradeComment}>💬 {grade.comment}</p>
                  )}
                  <div style={styles.gradeFooter}>
                    <span style={styles.gradeDate}>
                      📅 {new Date(grade.graded_at || grade.submitted_at).toLocaleDateString('ru-RU')}
                    </span>
                    <span style={styles.gradeMaxScore}>
                      Макс: {grade.assignment.max_score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📋 Все задания</h3>
          <div style={styles.assignmentsList}>
            {assignments.map((assignment) => {
              const myGrade = grades.find(g => g.assignment_id === assignment.id);
              const isCompleted = !!myGrade;
              
              return (
                <div key={assignment.id} style={{
                  ...styles.assignmentCard,
                  borderLeft: isCompleted ? '4px solid #43e97b' : '4px solid #ffa500'
                }}>
                  <div style={styles.assignmentHeader}>
                    <h4 style={styles.assignmentName}>{assignment.title}</h4>
                    {isCompleted ? (
                      <span style={styles.completedBadge}>✓ Выполнено</span>
                    ) : (
                      <span style={styles.pendingBadge}>⏳ Ожидает</span>
                    )}
                  </div>
                  <p style={styles.assignmentDesc}>{assignment.description}</p>
                  <div style={styles.assignmentFooter}>
                    <span style={styles.assignmentScore}>
                      Макс. балл: {assignment.max_score}
                    </span>
                    {assignment.deadline && (
                      <span style={styles.assignmentDeadline}>
                        Срок: {new Date(assignment.deadline).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem' },
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '2rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  statCard: { background: 'white', borderRadius: '10px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  statIcon: { fontSize: '2.5rem', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '10px' },
  statInfo: { flex: 1 },
  statValue: { fontSize: '2rem', fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' },
  sections: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' },
  section: { background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  sectionTitle: { fontSize: '1.25rem', fontWeight: 'bold', color: '#333', marginBottom: '1.5rem' },
  gradesList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  gradeCard: { background: '#f9f9f9', padding: '1.5rem', borderRadius: '10px' },
  gradeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' },
  gradeName: { fontSize: '1rem', fontWeight: '600', color: '#333' },
  gradeScore: { background: '#43e97b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600' },
  gradeComment: { color: '#666', fontSize: '0.875rem', marginBottom: '0.75rem', fontStyle: 'italic' },
  gradeFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#999' },
  gradeDate: {},
  gradeMaxScore: {},
  assignmentsList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  assignmentCard: { background: '#f9f9f9', padding: '1.5rem', borderRadius: '10px' },
  assignmentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' },
  assignmentName: { fontSize: '1rem', fontWeight: '600', color: '#333' },
  completedBadge: { background: '#43e97b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem' },
  pendingBadge: { background: '#ffa500', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem' },
  assignmentDesc: { color: '#666', fontSize: '0.875rem', marginBottom: '0.75rem' },
  assignmentFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#999' },
  assignmentScore: {},
  assignmentDeadline: {},
  empty: { textAlign: 'center', color: '#999', padding: '2rem' },
};

export default StudentDashboard;