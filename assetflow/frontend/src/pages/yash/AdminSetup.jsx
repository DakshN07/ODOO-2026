import React, { useState } from 'react';
import { Button } from '../../components/Button';

export const AdminSetup = () => {
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleSetup = (e) => {
    e.preventDefault();
    console.log('Admin Setup completed:', { adminName, adminEmail });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Initial Admin Setup</h2>
      <form onSubmit={handleSetup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Admin Name" 
          value={adminName} 
          onChange={(e) => setAdminName(e.target.value)} 
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          required 
        />
        <input 
          type="email" 
          placeholder="Admin Email" 
          value={adminEmail} 
          onChange={(e) => setAdminEmail(e.target.value)} 
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={adminPassword} 
          onChange={(e) => setAdminPassword(e.target.value)} 
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          required 
        />
        <Button type="submit">Initialize Admin</Button>
      </form>
    </div>
  );
};

export default AdminSetup;
