import React, { useState } from 'react';
import Header from '../components/common/Header';
import Dashboard from '../components/teacher/Dashboard';
import AssignmentForm from '../components/teacher/AssignmentForm';
import GradeTable from '../components/teacher/GradeTable';
import ReportGenerator from '../components/teacher/ReportGenerator';

const TeacherPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: '📊 Панель', component: Dashboard },
    { id: 'assignments', label: '📝 Задания', component: AssignmentForm },
    { id: 'grades', label: '📊 Оценки', component: GradeTable },
    { id: 'reports', label: '📈 Отчёты', component: ReportGenerator },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || Dashboard;

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.activeTab : {})
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        <ActiveComponent />
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
  },
  tabs: {
    background: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
    padding: '1rem',
  },
  tab: {
    padding: '0.75rem 1.5rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.3s',
  },
  activeTab: {
    background: '#667eea',
    color: 'white',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
};

export default TeacherPanel;