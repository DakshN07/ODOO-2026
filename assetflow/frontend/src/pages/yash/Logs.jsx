import React from 'react';

export const Logs = () => {
  const dummyLogs = [
    { id: 1, user: 'Admin', action: 'Created Asset', details: 'Added MacBook Pro Serial # MBP2026', timestamp: '2026-07-12 10:00 AM' },
    { id: 2, user: 'Daksh', action: 'Started Audit', details: 'Initialized Audit Cycle FY26-Q2', timestamp: '2026-07-12 09:30 AM' },
    { id: 3, user: 'Ayush', action: 'Allocated Resource', details: 'Meeting Room A allocated to Marketing', timestamp: '2026-07-12 09:00 AM' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Activity Logs</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>User</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Action</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Details</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {dummyLogs.map(log => (
            <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{log.user}</td>
              <td style={{ padding: '10px' }}>{log.action}</td>
              <td style={{ padding: '10px' }}>{log.details}</td>
              <td style={{ padding: '10px' }}>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;
