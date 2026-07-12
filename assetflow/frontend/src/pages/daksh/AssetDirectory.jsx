import React from 'react';

export const AssetDirectory = () => {
  const dummyAssets = [
    { id: 1, name: 'MacBook Pro 16"', serial: 'MBP001', category: 'Laptops', status: 'Available' },
    { id: 2, name: 'Dell Monitor 27"', serial: 'DEL042', category: 'Monitors', status: 'Allocated' },
    { id: 3, name: 'iPhone 15 Pro', serial: 'IPH999', category: 'Mobiles', status: 'Maintenance' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Asset Directory</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Serial Number</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Category</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyAssets.map(asset => (
            <tr key={asset.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{asset.name}</td>
              <td style={{ padding: '10px' }}>{asset.serial}</td>
              <td style={{ padding: '10px' }}>{asset.category}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem',
                  background: asset.status === 'Available' ? '#d1fae5' : asset.status === 'Allocated' ? '#dbeafe' : '#fee2e2',
                  color: asset.status === 'Available' ? '#065f46' : asset.status === 'Allocated' ? '#1e40af' : '#991b1b'
                }}>
                  {asset.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetDirectory;
