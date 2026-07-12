import React from 'react';

export const Dashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
          <h3>Total Assets</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>128</p>
        </div>
        <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
          <h3>Active Allocations</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>42</p>
        </div>
        <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
          <h3>Pending Maintenance</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>7</p>
        </div>
        <div style={{ padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
          <h3>Open Audits</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>2</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
