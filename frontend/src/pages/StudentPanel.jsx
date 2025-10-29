import React from 'react';
import Header from '../components/common/Header';
import StudentDashboard from '../components/student/StudentDashboard';

const StudentPanel = () => {
  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <StudentDashboard />
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
};

export default StudentPanel;