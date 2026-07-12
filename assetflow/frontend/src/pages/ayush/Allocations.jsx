import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { ThemeConfig } from '../../components/ThemeConfig';
import axios from 'axios';

const API = 'http://localhost:5000/api/ayush';

const getToken = () => localStorage.getItem('token');
const headers = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

// Status pill component
const StatusPill = ({ status }) => {
  const colors = {
    'Active': { bg: '#dcfce7', color: '#166534' },
    'Returned': { bg: '#e0e7ff', color: '#3730a3' },
    'Transfer Requested': { bg: '#fef3c7', color: '#92400e' },
    'Overdue': { bg: '#fee2e2', color: '#991b1b' }
  };
  const c = colors[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem',
      fontWeight: '600', background: c.bg, color: c.color, display: 'inline-block'
    }}>{status}</span>
  );
};

export const Allocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Form state
  const [form, setForm] = useState({ assetId: '', allocatedTo: '', department: '', expectedReturnDate: '', notes: '' });
  const [returnNotes, setReturnNotes] = useState('');
  const [transferData, setTransferData] = useState({ newUserId: '', notes: '' });

  const fetchAllocations = async () => {
    try {
      const url = filterStatus ? `${API}/allocations?status=${filterStatus}` : `${API}/allocations`;
      const res = await axios.get(url, headers());
      setAllocations(res.data.allocations || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchAssets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/daksh/assets', headers());
      setAssets(res.data.assets || []);
    } catch (e) { console.error(e); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/yash/users', headers());
      setUsers(res.data.users || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchAllocations(); fetchAssets(); fetchUsers(); }, [filterStatus]);

  const clearMessages = () => { setTimeout(() => { setError(''); setSuccess(''); }, 4000); };

  const handleAllocate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const res = await axios.post(`${API}/allocations`, form, headers());
      setSuccess('Asset allocated successfully!');
      setShowModal(false);
      setForm({ assetId: '', allocatedTo: '', department: '', expectedReturnDate: '', notes: '' });
      fetchAllocations();
      fetchAssets();
    } catch (e) {
      const msg = e.response?.data?.message || 'Allocation failed';
      if (e.response?.data?.canTransfer) {
        setError(`${msg} — You can request a transfer instead.`);
      } else {
        setError(msg);
      }
    }
    clearMessages();
  };

  const handleReturn = async () => {
    if (!selectedAllocation) return;
    try {
      await axios.put(`${API}/allocations/${selectedAllocation._id}/return`, { returnNotes }, headers());
      setSuccess('Asset returned successfully!');
      setShowReturnModal(false);
      setReturnNotes('');
      setSelectedAllocation(null);
      fetchAllocations();
      fetchAssets();
    } catch (e) { setError(e.response?.data?.message || 'Return failed'); }
    clearMessages();
  };

  const handleTransferRequest = async () => {
    if (!selectedAllocation) return;
    try {
      await axios.post(`${API}/allocations/transfer`, {
        allocationId: selectedAllocation._id,
        newUserId: transferData.newUserId,
        notes: transferData.notes
      }, headers());
      setSuccess('Transfer requested!');
      setShowTransferModal(false);
      setTransferData({ newUserId: '', notes: '' });
      setSelectedAllocation(null);
      fetchAllocations();
    } catch (e) { setError(e.response?.data?.message || 'Transfer request failed'); }
    clearMessages();
  };

  const handleApproveTransfer = async (allocationId) => {
    const newUserId = prompt('Enter user ID to transfer to:');
    if (!newUserId) return;
    try {
      await axios.put(`${API}/allocations/${allocationId}/approve-transfer`, { newUserId }, headers());
      setSuccess('Transfer approved!');
      fetchAllocations();
    } catch (e) { setError(e.response?.data?.message || 'Approval failed'); }
    clearMessages();
  };

  const isOverdue = (allocation) => {
    return allocation.status === 'Active' &&
      allocation.expectedReturnDate &&
      new Date(allocation.expectedReturnDate) < new Date();
  };

  // Styles
  const cardStyle = {
    background: '#fff', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb'
  };
  const modalOverlay = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000
  };
  const modalContent = {
    background: '#fff', borderRadius: '16px', padding: '2rem', width: '500px',
    maxWidth: '90vw', maxHeight: '80vh', overflow: 'auto',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
  };
  const inputStyle = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px',
    border: '1px solid #d1d5db', fontSize: '0.875rem', fontFamily: ThemeConfig.fonts.main,
    outline: 'none', boxSizing: 'border-box'
  };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '0.35rem' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Asset Allocations</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Manage asset check-out, check-in, and transfers</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Returned">Returned</option>
            <option value="Transfer Requested">Transfer Requested</option>
          </select>
          <Button onClick={() => setShowModal(true)}>+ Allocate Asset</Button>
        </div>
      </div>

      {/* Alert messages */}
      {error && <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
      {success && <div style={{ padding: '0.75rem 1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>{success}</div>}

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total', value: allocations.length, color: ThemeConfig.colors.primary },
          { label: 'Active', value: allocations.filter(a => a.status === 'Active').length, color: ThemeConfig.colors.secondary },
          { label: 'Overdue', value: allocations.filter(a => isOverdue(a)).length, color: ThemeConfig.colors.danger },
          { label: 'Transfers Pending', value: allocations.filter(a => a.status === 'Transfer Requested').length, color: ThemeConfig.colors.warning }
        ].map((stat, i) => (
          <div key={i} style={{ ...cardStyle, borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>{stat.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: stat.color, marginTop: '0.25rem' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Allocations table */}
      <div style={cardStyle}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading allocations...</div>
        ) : allocations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
            No allocations found. Click "Allocate Asset" to get started.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Asset', 'Tag', 'Allocated To', 'Department', 'Date', 'Expected Return', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allocations.map(a => (
                <tr key={a._id} style={{
                  borderBottom: '1px solid #f3f4f6',
                  background: isOverdue(a) ? '#fef2f2' : 'transparent',
                  transition: 'background 0.2s'
                }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{a.asset?.name || 'N/A'}</td>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.8rem', color: ThemeConfig.colors.primary }}>{a.asset?.assetTag || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>{a.allocatedTo?.name || 'N/A'}</td>
                  <td style={{ padding: '0.75rem' }}>{a.department?.name || '-'}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>{new Date(a.allocatedDate).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: isOverdue(a) ? ThemeConfig.colors.danger : '#374151' }}>
                    {a.expectedReturnDate ? new Date(a.expectedReturnDate).toLocaleDateString() : '-'}
                    {isOverdue(a) && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: ThemeConfig.colors.danger, fontWeight: '700' }}>OVERDUE</span>}
                  </td>
                  <td style={{ padding: '0.75rem' }}><StatusPill status={a.status} /></td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {a.status === 'Active' && (
                        <>
                          <button onClick={() => { setSelectedAllocation(a); setShowReturnModal(true); }}
                            style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '500' }}>
                            Return
                          </button>
                          <button onClick={() => { setSelectedAllocation(a); setShowTransferModal(true); }}
                            style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: `1px solid ${ThemeConfig.colors.warning}`, background: '#fffbeb', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '500', color: '#92400e' }}>
                            Transfer
                          </button>
                        </>
                      )}
                      {a.status === 'Transfer Requested' && (
                        <button onClick={() => handleApproveTransfer(a._id)}
                          style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: `1px solid ${ThemeConfig.colors.secondary}`, background: '#ecfdf5', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '500', color: '#065f46' }}>
                          Approve Transfer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Allocate Modal */}
      {showModal && (
        <div style={modalOverlay} onClick={() => setShowModal(false)}>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>Allocate Asset</h3>
            <form onSubmit={handleAllocate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Asset *</label>
                  <select value={form.assetId} onChange={e => setForm({ ...form, assetId: e.target.value })} style={inputStyle} required>
                    <option value="">Select an asset</option>
                    {assets.filter(a => a.status === 'Available').map(a => (
                      <option key={a._id} value={a._id}>{a.name} ({a.assetTag})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Allocate To *</label>
                  <select value={form.allocatedTo} onChange={e => setForm({ ...form, allocatedTo: e.target.value })} style={inputStyle} required>
                    <option value="">Select user</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Expected Return Date</label>
                  <input type="date" value={form.expectedReturnDate} onChange={e => setForm({ ...form, expectedReturnDate: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Notes</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} placeholder="Optional allocation notes..." />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Allocate</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div style={modalOverlay} onClick={() => setShowReturnModal(false)}>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: '700' }}>Return Asset</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem' }}>
              Returning <strong>{selectedAllocation?.asset?.name}</strong> ({selectedAllocation?.asset?.assetTag})
            </p>
            <div>
              <label style={labelStyle}>Condition / Check-in Notes</label>
              <textarea value={returnNotes} onChange={e => setReturnNotes(e.target.value)}
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Describe condition at return..." />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowReturnModal(false)}>Cancel</Button>
              <Button onClick={handleReturn}>Confirm Return</Button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Request Modal */}
      {showTransferModal && (
        <div style={modalOverlay} onClick={() => setShowTransferModal(false)}>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: '700' }}>Request Transfer</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem' }}>
              Transfer <strong>{selectedAllocation?.asset?.name}</strong> currently held by <strong>{selectedAllocation?.allocatedTo?.name}</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Transfer To *</label>
                <select value={transferData.newUserId} onChange={e => setTransferData({ ...transferData, newUserId: e.target.value })} style={inputStyle} required>
                  <option value="">Select new holder</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Reason</label>
                <textarea value={transferData.notes} onChange={e => setTransferData({ ...transferData, notes: e.target.value })}
                  style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} placeholder="Reason for transfer..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowTransferModal(false)}>Cancel</Button>
              <Button variant="warning" onClick={handleTransferRequest}>Request Transfer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allocations;
