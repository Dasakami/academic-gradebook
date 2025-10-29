import React, { useState, useEffect } from 'react';
import { gradesAPI, assignmentsAPI, usersAPI } from '../../services/api';
import Loader from '../common/Loader';

const GradeTable = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    assignment_id: '',
    score: '',
    comment: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gradesRes, studentsRes, assignmentsRes] = await Promise.all([
        gradesAPI.getAll(),
        usersAPI.getStudents(),
        assignmentsAPI.getAll(),
      ]);
      setGrades(gradesRes.data);
      setStudents(studentsRes.data);
      setAssignments(assignmentsRes.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await gradesAPI.create({
        ...formData,
        score: Number(formData.score),
      });
      setFormData({ student_id: '', assignment_id: '', score: '', comment: '' });
      setShowForm(false);
      loadData();
      alert('✅ Оценка добавлена');
    } catch (error) {
      alert(error.response?.data?.detail || '❌ Ошибка добавления оценки');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить оценку?')) {
      try {
        await gradesAPI.delete(id);
        loadData();
        alert('✅ Оценка удалена');
      } catch (error) {
        alert('❌ Ошибка удаления');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📊 Таблица оценок</h2>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          {showForm ? '✕ Отмена' : '+ Добавить оценку'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Студент *</label>
              <select
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                style={styles.select}
                required
              >
                <option value="">Выберите студента</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.full_name}</option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Задание *</label>
              <select
                value={formData.assignment_id}
                onChange={(e) => setFormData({ ...formData, assignment_id: e.target.value })}
                style={styles.select}
                required
              >
                <option value="">Выберите задание</option>
                {assignments.map((a) => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Оценка *</label>
              <input
                type="number"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                style={styles.input}
                min="0"
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Комментарий</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              style={{ ...styles.input, minHeight: '60px' }}
            />
          </div>

          <button type="submit" style={styles.submitButton}>Добавить оценку</button>
        </form>
      )}

      <div style={styles.tableContainer}>
        {grades.length === 0 ? (
          <p style={styles.empty}>Оценок пока нет</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Студент</th>
                <th style={styles.th}>Задание</th>
                <th style={styles.th}>Оценка</th>
                <th style={styles.th}>Комментарий</th>
                <th style={styles.th}>Дата</th>
                <th style={styles.th}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id} style={styles.row}>
                  <td style={styles.td}>{grade.student.full_name}</td>
                  <td style={styles.td}>{grade.assignment.title}</td>
                  <td style={styles.td}>
                    <span style={styles.scoreBadge}>{grade.score}</span>
                  </td>
                  <td style={styles.td}>{grade.comment || '-'}</td>
                  <td style={styles.td}>
                    {new Date(grade.graded_at || grade.submitted_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => handleDelete(grade.id)} style={styles.deleteBtn}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#333' },
  addButton: { padding: '0.75rem 1.5rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '500' },
  form: { background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '2rem' },
  row: { display: 'flex', gap: '1rem', marginBottom: '1rem' },
  inputGroup: { flex: 1 },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.875rem' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem' },
  select: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem' },
  submitButton: { width: '100%', padding: '0.75rem', background: '#43e97b', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: '500', cursor: 'pointer' },
  tableContainer: { background: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  headerRow: { background: '#f5f5f5' },
  th: { padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333', borderBottom: '2px solid #ddd' },
  td: { padding: '1rem', borderBottom: '1px solid #eee' },
  scoreBadge: { background: '#43e97b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: '500' },
  deleteBtn: { background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer' },
  empty: { textAlign: 'center', color: '#999', padding: '2rem' },
};

export default GradeTable;