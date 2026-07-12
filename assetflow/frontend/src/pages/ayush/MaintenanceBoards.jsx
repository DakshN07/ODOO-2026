import React from 'react';
import { Button } from '../../components/Button';

export const MaintenanceBoards = () => {
  const dummyRequests = [
    { id: 1, assetName: 'iPhone 15 Pro', issue: 'Screen flicker', priority: 'High', status: 'In-Progress' },
    { id: 2, assetName: 'Office Chair B4', issue: 'Broken wheels', priority: 'Low', status: 'Submitted' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Maintenance Board</h2>
        <Button onClick={() => console.log('New Maintenance Request')}>Raise Request</Button>
      </div>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
        <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '8px', padding: '1rem' }}>
          <h3>Submitted</h3>
          {dummyRequests.filter(r => r.status === 'Submitted').map(req => (
            <div key={req.id} style={{ background: '#fff', padding: '10px', borderRadius: '4px', margin: '10px 0', border: '1px solid #ddd' }}>
              <strong>{req.assetName}</strong>
              <p style={{ margin: '5px 0' }}>{req.issue}</p>
              <span style={{ fontSize: '0.8rem', color: '#ff9800' }}>Priority: {req.priority}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '8px', padding: '1rem' }}>
          <h3>In-Progress</h3>
          {dummyRequests.filter(r => r.status === 'In-Progress').map(req => (
            <div key={req.id} style={{ background: '#fff', padding: '10px', borderRadius: '4px', margin: '10px 0', border: '1px solid #ddd' }}>
              <strong>{req.assetName}</strong>
              <p style={{ margin: '5px 0' }}>{req.issue}</p>
              <span style={{ fontSize: '0.8rem', color: '#f44336' }}>Priority: {req.priority}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, background: '#f5f5f5', borderRadius: '8px', padding: '1rem' }}>
          <h3>Resolved</h3>
          {dummyRequests.filter(r => r.status === 'Resolved').map(req => (
            <div key={req.id} style={{ background: '#fff', padding: '10px', borderRadius: '4px', margin: '10px 0', border: '1px solid #ddd' }}>
              <strong>{req.assetName}</strong>
              <p style={{ margin: '5px 0' }}>{req.issue}</p>
              <span style={{ fontSize: '0.8rem', color: '#4caf50' }}>Priority: {req.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceBoards;
