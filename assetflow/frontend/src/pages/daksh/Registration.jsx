import React, { useState } from 'react';
import { Button } from '../../components/Button';

export const Registration = () => {
  const [name, setName] = useState('');
  const [serial, setSerial] = useState('');
  const [category, setCategory] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registering asset:', { name, serial, category });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Asset Registration</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <input 
          type="text" 
          placeholder="Asset Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          required 
        />
        <input 
          type="text" 
          placeholder="Serial Number" 
          value={serial} 
          onChange={(e) => setSerial(e.target.value)} 
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          required 
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        >
          <option value="">Select Category</option>
          <option value="laptops">Laptops</option>
          <option value="monitors">Monitors</option>
          <option value="mobiles">Mobiles</option>
        </select>
        <Button type="submit">Register Asset</Button>
      </form>
    </div>
  );
};

export default Registration;
