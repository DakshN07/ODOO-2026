import React from 'react';
import { Button } from '../../components/Button';

export const Audits = () => {
  const dummyAudits = [
    { id: 1, name: 'Q2 General Hardware Audit', auditor: 'Daksh', status: 'In-Progress', date: '2026-07-10' },
    { id: 2, name: 'Software License Audit', auditor: 'Yash', status: 'Scheduled', date: '2026-07-20' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Asset Audits</h2>
        <Button onClick={() => console.log('Create new audit cycle')}>Schedule New Audit</Button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Audit Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Auditor</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Scheduled Date</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyAudits.map(audit => (
            <tr key={audit.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{audit.name}</td>
              <td style={{ padding: '10px' }}>{audit.auditor}</td>
              <td style={{ padding: '10px' }}>{audit.date}</td>
              <td style={{ padding: '10px' }}>{audit.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Audits;
