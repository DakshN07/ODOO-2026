import React from 'react';
import { Button } from '../../components/Button';

export const Audits = () => {
  const dummyAudits = [
    { id: 1, name: 'Q2 General Hardware Audit', auditor: 'John Doe', status: 'In-Progress', date: '2026-07-10' },
    { id: 2, name: 'Software License Audit', auditor: 'Jane Smith', status: 'Scheduled', date: '2026-07-20' }
  ];

  return (
    <div style={{ padding: '2rem', color: '#f3f4f6', backgroundColor: '#111827', minHeight: '90vh', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Asset Audits</h2>
        <Button onClick={() => console.log('Create new audit cycle')}>Schedule New Audit</Button>
      </div>
      <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151', overflow: 'hidden', marginTop: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#111827', borderBottom: '1px solid #374151' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Audit Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Auditor</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Scheduled Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyAudits.map(audit => (
              <tr key={audit.id} style={{ borderBottom: '1px solid #374151' }}>
                <td style={{ padding: '12px 16px' }}>{audit.name}</td>
                <td style={{ padding: '12px 16px' }}>{audit.auditor}</td>
                <td style={{ padding: '12px 16px' }}>{audit.date}</td>
                <td style={{ padding: '12px 16px' }}>{audit.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Audits;
