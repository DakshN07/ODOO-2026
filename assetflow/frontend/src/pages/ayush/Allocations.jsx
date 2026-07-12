import React from 'react';
import { Button } from '../../components/Button';

export const Allocations = () => {
  const dummyAllocations = [
    { id: 1, assetName: 'MacBook Pro 16"', user: 'Daksh', allocatedDate: '2026-06-01', status: 'Active' },
    { id: 2, assetName: 'Dell Monitor 27"', user: 'Ayush', allocatedDate: '2026-06-15', status: 'Active' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Asset Allocations</h2>
        <Button onClick={() => console.log('New Allocation')}>Allocate Asset</Button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Asset Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Allocated To</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Allocation Date</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyAllocations.map(allocation => (
            <tr key={allocation.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{allocation.assetName}</td>
              <td style={{ padding: '10px' }}>{allocation.user}</td>
              <td style={{ padding: '10px' }}>{allocation.allocatedDate}</td>
              <td style={{ padding: '10px' }}>{allocation.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Allocations;
