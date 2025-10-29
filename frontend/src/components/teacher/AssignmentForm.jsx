import React, { useState, useEffect } from 'react';
import { assignmentsAPI } from '../../services/api';
import Loader from '../common/Loader';

const AssignmentForm = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    max_score: 100,
    deadline: '',
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await assignmentsAPI.getAll();
      setAssignments(response.data);
    } catch (error) {
      console.error('Ошибка загрузки заданий:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignmentsAPI.create(formData);
      setFormData({ title: '', description: '', max_score: 100, deadline: '' });
      setShowForm(false);
      loadAssignments();
      alert('✅ Задание создано успешно!');
    } catch (error) {
      alert('❌ Ошибка создания задания');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить задание?')) {
      try {
        await assignmentsAPI.delete(id);
        loadAssignments();
        alert('✅ Задание удалено');
      } catch (error) {
        alert('❌ Ошибка удаления');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📝 Управление заданиями</h2>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          {showForm ? '✕ Отмена' : '+ Создать задание'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Название задания *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ ...styles.input, minHeight: '100px' }}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Максимальный балл *</label>
              <input
                type="number"
                value={formData.max_score}
                onChange={(e) => setFormData({ ...formData, max_score: Number(e.target.value) })}
                style={styles.input}
                min="1"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Срок сдачи</label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" style={styles.submitButton}>
            Создать задание
          </button>
        </form>
      )}

      <div style={styles.list}>
        {assignments.length === 0 ? (
          <p style={styles.empty}>Заданий пока нет</p>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{assignment.title}</h3>
                <button onClick={() => handleDelete(assignment.id)} style={styles.deleteButton}>
                  🗑️
                </button>
              </div>
              <p style={styles.description}>{assignment.description}</p>
              <div style={styles.cardFooter}>
                <span style={styles.badge}>Макс. балл: {assignment.max_score}</span>
                {assignment.deadline && (
                  <span style={styles.badge}>
                    Срок: {new Date(assignment.deadline).toLocaleDateString('ru-RU')}
                  </span>
                )}
              </div>
            </div>
          ))
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
  inputGroup: { marginBottom: '1rem', flex: 1 },
  label: { display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: '0.875rem' },
  input: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1rem' },
  row: { display: 'flex', gap: '1rem' },
  submitButton: { width: '100%', padding: '0.75rem', background: '#43e97b', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: '500', cursor: 'pointer', marginTop: '1rem' },
  list: { display: 'grid', gap: '1rem' },
  card: { background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' },
  cardTitle: { fontSize: '1.125rem', fontWeight: 'bold', color: '#333' },
  deleteButton: { background: 'transparent', border: 'none', fontSize: '1.25rem', cursor: 'pointer' },
  description: { color: '#666', marginBottom: '1rem', lineHeight: '1.5' },
  cardFooter: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  badge: { background: '#f5f5f5', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', color: '#666' },
  empty: { textAlign: 'center', color: '#999', padding: '2rem' },
};

export default AssignmentForm;