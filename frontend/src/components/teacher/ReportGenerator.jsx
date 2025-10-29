import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import Loader from '../common/Loader';

const ReportGenerator = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    setLoading(true);
    try {
      const response = await reportsAPI.getCourseReport();
      setReport(response.data);
    } catch (error) {
      console.error('Ошибка загрузки отчета:', error);
      alert('❌ Ошибка загрузки отчета');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!report) return;

    let csv = 'Студент,Всего заданий,Выполнено,Средний балл\n';
    report.student_reports.forEach(sr => {
      csv += `${sr.student.full_name},${sr.total_assignments},${sr.completed_assignments},${sr.average_score}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📈 Генерация отчётов</h2>
        <div style={styles.buttons}>
          <button onClick={loadReport} style={styles.generateButton} disabled={loading}>
            {loading ? 'Загрузка...' : '🔄 Сгенерировать отчёт'}
          </button>
          {report && (
            <button onClick={exportToCSV} style={styles.exportButton}>
              📥 Экспорт CSV
            </button>
          )}
        </div>
      </div>

      {loading && <Loader message="Генерация отчёта..." />}

      {report && !loading && (
        <div style={styles.report}>
          <div style={styles.summary}>
            <h3 style={styles.summaryTitle}>📊 Общая статистика курса</h3>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryCard}>
                <div style={styles.summaryValue}>{report.total_students}</div>
                <div style={styles.summaryLabel}>Студентов</div>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryValue}>{report.total_assignments}</div>
                <div style={styles.summaryLabel}>Заданий</div>
              </div>
              <div style={styles.summaryCard}>
                <div style={styles.summaryValue}>{report.average_score}</div>
                <div style={styles.summaryLabel}>Средний балл</div>
              </div>
            </div>
          </div>

          <div style={styles.students}>
            <h3 style={styles.studentsTitle}>👥 Подробная статистика по студентам</h3>
            {report.student_reports.map((sr) => (
              <div key={sr.student.id} style={styles.studentCard}>
                <div style={styles.studentHeader}>
                  <h4 style={styles.studentName}>{sr.student.full_name}</h4>
                  <div style={styles.studentStats}>
                    <span style={styles.statBadge}>
                      Выполнено: {sr.completed_assignments}/{sr.total_assignments}
                    </span>
                    <span style={{ ...styles.statBadge, background: '#43e97b' }}>
                      Средний балл: {sr.average_score}
                    </span>
                  </div>
                </div>
                
                {sr.grades.length > 0 && (
                  <div style={styles.gradesList}>
                    <strong style={styles.gradesTitle}>Оценки:</strong>
                    <div style={styles.grades}>
                      {sr.grades.map((grade) => (
                        <div key={grade.id} style={styles.gradeItem}>
                          <span style={styles.gradeName}>{grade.assignment.title}</span>
                          <span style={styles.gradeScore}>{grade.score} баллов</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!report && !loading && (
        <div style={styles.empty}>
          <p>Нажмите "Сгенерировать отчёт" для просмотра статистики</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#333' },
  buttons: { display: 'flex', gap: '0.5rem' },
  generateButton: { padding: '0.75rem 1.5rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '500' },
  exportButton: { padding: '0.75rem 1.5rem', background: '#43e97b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '500' },
  report: { display: 'flex', flexDirection: 'column', gap: '2rem' },
  summary: { background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  summaryTitle: { fontSize: '1.25rem', fontWeight: 'bold', color: '#333', marginBottom: '1.5rem' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' },
  summaryCard: { background: '#f5f5f5', padding: '1.5rem', borderRadius: '10px', textAlign: 'center' },
  summaryValue: { fontSize: '2rem', fontWeight: 'bold', color: '#667eea', marginBottom: '0.5rem' },
  summaryLabel: { fontSize: '0.875rem', color: '#666' },
  students: { background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  studentsTitle: { fontSize: '1.25rem', fontWeight: 'bold', color: '#333', marginBottom: '1.5rem' },
  studentCard: { background: '#f9f9f9', padding: '1.5rem', borderRadius: '10px', marginBottom: '1rem' },
  studentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' },
  studentName: { fontSize: '1.125rem', fontWeight: '600', color: '#333' },
  studentStats: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  statBadge: { background: '#667eea', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem' },
  gradesList: { marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd' },
  gradesTitle: { display: 'block', marginBottom: '0.75rem', color: '#666', fontSize: '0.875rem' },
  grades: { display: 'grid', gap: '0.5rem' },
  gradeItem: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'white', borderRadius: '5px' },
  gradeName: { color: '#333' },
  gradeScore: { fontWeight: '600', color: '#43e97b' },
  empty: { background: 'white', padding: '3rem', borderRadius: '10px', textAlign: 'center', color: '#999', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
};

export default ReportGenerator;