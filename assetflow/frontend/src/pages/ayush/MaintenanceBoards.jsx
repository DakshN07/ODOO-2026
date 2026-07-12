import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { ThemeConfig } from '../../components/ThemeConfig';
import axios from 'axios';

const API = 'http://localhost:5000/api/ayush';
const getToken = () => localStorage.getItem('token');
const headers = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const STATUSES = ['Pending', 'Approved', 'Technician Assigned', 'In Progress', 'Resolved'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const priorityColors = {
  'Low': { bg: '#dcfce7', color: '#166534', dot: '#22c55e' },
  'Medium': { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  'High': { bg: '#fed7aa', color: '#9a3412', dot: '#f97316' },
  'Critical': { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' }
};

const statusColors = {
  'Pending': { bg: '#fef3c7', color: '#92400e', header: '#f59e0b' },
  'Approved': { bg: '#dbeafe', color: '#1e40af', header: '#3b82f6' },
  'Technician Assigned': { bg: '#e0e7ff', color: '#3730a3', header: '#6366f1' },
  'In Progress': { bg: '#fed7aa', color: '#9a3412', header: '#f97316' },
  'Resolved': { bg: '#dcfce7', color: '#166534', header: '#22c55e' }
};

export const MaintenanceBoards = () => {
  const [requests, setRequests] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [form, setForm] = useState({ assetId: '', issueDescription: '', priority: 'Medium', photo: '' });
  const [technicianName, setTechnicianName] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API}/maintenance`, headers());
      setRequests(res.data.requests || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchAssets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/daksh/assets', headers());
      setAssets(res.data.assets || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchRequests(); fetchAssets(); }, []);

  const clearMessages = () => { setTimeout(() => { setError(''); setSuccess(''); }, 4000); };

  const handleRaiseRequest = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post(`${API}/maintenance`, form, headers());
      setSuccess('Maintenance request raised successfully!');
      setShowModal(false);
      setForm({ assetId: '', issueDescription: '', priority: 'Medium', photo: '' });
      fetchRequests();
    } catch (e) { setError(e.response?.data?.message || 'Failed to raise request'); }
    clearMessages();
  };

  const handleStatusUpdate = async (requestId, newStatus, extraData = {}) => {
    try {
      await axios.put(`${API}/maintenance/${requestId}`, { status: newStatus, ...extraData }, headers());
      setSuccess(`Status updated to "${newStatus}"`);
      fetchRequests();
      fetchAssets();
      if (showDetailModal) setShowDetailModal(false);
    } catch (e) { setError(e.response?.data?.message || 'Update failed'); }
    clearMessages();
  };

  const getNextStatus = (current) => {
    const transitions = {
      'Pending': ['Approved', 'Rejected'],
      'Approved': ['Technician Assigned'],
      'Technician Assigned': ['In Progress'],
      'In Progress': ['Resolved']
    };
    return transitions[current] || [];
  };

  const requestsByStatus = {};
  STATUSES.forEach(s => { requestsByStatus[s] = requests.filter(r => r.status === s); });

  const cardStyle = {
    background: '#fff', borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb'
  };
  const modalOverlay = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000
  };
  const modalContent = {
    background: '#fff', borderRadius: '16px', padding: '2rem', width: '520px',
    maxWidth: '90vw', maxHeight: '85vh', overflow: 'auto',
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
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Maintenance Board</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Track and manage asset repair workflows</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Raise Request</Button>
      </div>

      {error && <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
      {success && <div style={{ padding: '0.75rem 1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>{success}</div>}

      {/* Kanban Board */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading maintenance requests...</div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {STATUSES.map(status => {
            const sc = statusColors[status];
            const items = requestsByStatus[status];
            return (
              <div key={status} style={{
                minWidth: '260px', flex: '1', display: 'flex', flexDirection: 'column',
                background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb'
              }}>
                {/* Column header */}
                <div style={{
                  padding: '0.75rem 1rem', borderBottom: '2px solid ' + sc.header,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderRadius: '12px 12px 0 0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sc.header }} />
                    <span style={{ fontWeight: '600', fontSize: '0.85rem', color: '#374151' }}>{status}</span>
                  </div>
                  <span style={{
                    background: sc.bg, color: sc.color, padding: '0.15rem 0.5rem',
                    borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '700'
                  }}>{items.length}</span>
                </div>

                {/* Cards */}
                <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minHeight: '120px' }}>
                  {items.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#d1d5db', fontSize: '0.8rem', padding: '1.5rem 0.5rem' }}>
                      No requests
                    </div>
                  )}
                  {items.map(req => {
                    const pc = priorityColors[req.priority] || priorityColors['Medium'];
                    return (
                      <div key={req._id}
                        onClick={() => { setSelectedRequest(req); setShowDetailModal(true); }}
                        style={{
                          background: '#fff', borderRadius: '8px', padding: '0.75rem',
                          border: '1px solid #e5e7eb', cursor: 'pointer',
                          transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        {/* Asset name */}
                        <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#111827', marginBottom: '0.35rem' }}>
                          {req.asset?.name || 'Unknown Asset'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: ThemeConfig.colors.primary, fontFamily: 'monospace', marginBottom: '0.35rem' }}>
                          {req.asset?.assetTag || ''}
                        </div>

                        {/* Issue */}
                        <div style={{
                          fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.5rem',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}>
                          {req.issueDescription}
                        </div>

                        {/* Footer: Priority + Submitted by */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.65rem',
                            fontWeight: '600', background: pc.bg, color: pc.color
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: pc.dot }} />
                            {req.priority}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>
                            {req.submittedBy?.name || 'Unknown'}
                          </span>
                        </div>

                        {/* Technician if assigned */}
                        {req.assignedTechnician && (
                          <div style={{ marginTop: '0.35rem', fontSize: '0.7rem', color: '#6366f1' }}>
                            🔧 {req.assignedTechnician}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Raise Request Modal */}
      {showModal && (
        <div style={modalOverlay} onClick={() => setShowModal(false)}>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>Raise Maintenance Request</h3>
            <form onSubmit={handleRaiseRequest}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Asset *</label>
                  <select value={form.assetId} onChange={e => setForm({ ...form, assetId: e.target.value })} style={inputStyle} required>
                    <option value="">Select asset needing maintenance</option>
                    {assets.map(a => (
                      <option key={a._id} value={a._id}>{a.name} ({a.assetTag}) — {a.condition}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Issue Description *</label>
                  <textarea value={form.issueDescription} onChange={e => setForm({ ...form, issueDescription: e.target.value })}
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Describe the issue in detail..." required />
                </div>
                <div>
                  <label style={labelStyle}>Priority</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {PRIORITIES.map(p => {
                      const pc = priorityColors[p];
                      return (
                        <button key={p} type="button"
                          onClick={() => setForm({ ...form, priority: p })}
                          style={{
                            flex: 1, padding: '0.5rem', borderRadius: '8px', cursor: 'pointer',
                            border: form.priority === p ? `2px solid ${pc.dot}` : '1px solid #d1d5db',
                            background: form.priority === p ? pc.bg : '#fff',
                            color: form.priority === p ? pc.color : '#6b7280',
                            fontWeight: form.priority === p ? '700' : '400',
                            fontSize: '0.8rem', fontFamily: ThemeConfig.fonts.main,
                            transition: 'all 0.2s'
                          }}
                        >{p}</button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Photo URL (optional)</label>
                  <input type="url" value={form.photo} onChange={e => setForm({ ...form, photo: e.target.value })} style={inputStyle} placeholder="https://..." />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div style={modalOverlay} onClick={() => { setShowDetailModal(false); setSelectedRequest(null); }}>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>{selectedRequest.asset?.name || 'Unknown Asset'}</h3>
                <span style={{ fontSize: '0.8rem', color: ThemeConfig.colors.primary, fontFamily: 'monospace' }}>{selectedRequest.asset?.assetTag || ''}</span>
              </div>
              <span style={{
                padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600',
                background: statusColors[selectedRequest.status]?.bg, color: statusColors[selectedRequest.status]?.color
              }}>{selectedRequest.status}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ ...labelStyle, marginBottom: '0.15rem' }}>Issue</label>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>{selectedRequest.issueDescription}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ ...labelStyle, marginBottom: '0.15rem' }}>Priority</label>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600',
                    background: priorityColors[selectedRequest.priority]?.bg,
                    color: priorityColors[selectedRequest.priority]?.color
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: priorityColors[selectedRequest.priority]?.dot }} />
                    {selectedRequest.priority}
                  </span>
                </div>
                <div>
                  <label style={{ ...labelStyle, marginBottom: '0.15rem' }}>Submitted By</label>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>{selectedRequest.submittedBy?.name || 'Unknown'}</p>
                </div>
                <div>
                  <label style={{ ...labelStyle, marginBottom: '0.15rem' }}>Created</label>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
                {selectedRequest.assignedTechnician && (
                  <div>
                    <label style={{ ...labelStyle, marginBottom: '0.15rem' }}>Technician</label>
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>🔧 {selectedRequest.assignedTechnician}</p>
                  </div>
                )}
                {selectedRequest.resolvedAt && (
                  <div>
                    <label style={{ ...labelStyle, marginBottom: '0.15rem' }}>Resolved At</label>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>{new Date(selectedRequest.resolvedAt).toLocaleString()}</p>
                  </div>
                )}
                {selectedRequest.resolutionNotes && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ ...labelStyle, marginBottom: '0.15rem' }}>Resolution Notes</label>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>{selectedRequest.resolutionNotes}</p>
                  </div>
                )}
              </div>
              {selectedRequest.photo && (
                <div>
                  <label style={{ ...labelStyle, marginBottom: '0.15rem' }}>Photo</label>
                  <img src={selectedRequest.photo} alt="Issue" style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>

            {/* Status transition buttons */}
            {getNextStatus(selectedRequest.status).length > 0 && (
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <label style={labelStyle}>Update Status</label>

                {/* If transitioning to Technician Assigned, show technician input */}
                {selectedRequest.status === 'Approved' && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Technician Name *</label>
                    <input type="text" value={technicianName} onChange={e => setTechnicianName(e.target.value)}
                      style={inputStyle} placeholder="Enter technician name..." />
                  </div>
                )}

                {/* If resolving, show resolution notes */}
                {selectedRequest.status === 'In Progress' && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ ...labelStyle, fontSize: '0.75rem' }}>Resolution Notes</label>
                    <textarea value={resolutionNotes} onChange={e => setResolutionNotes(e.target.value)}
                      style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} placeholder="Describe what was done..." />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {getNextStatus(selectedRequest.status).map(nextStatus => (
                    <Button key={nextStatus}
                      variant={nextStatus === 'Rejected' ? 'danger' : 'primary'}
                      onClick={() => {
                        const extra = {};
                        if (nextStatus === 'Technician Assigned') extra.assignedTechnician = technicianName;
                        if (nextStatus === 'Resolved') extra.resolutionNotes = resolutionNotes;
                        handleStatusUpdate(selectedRequest._id, nextStatus, extra);
                      }}>
                      → {nextStatus}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => { setShowDetailModal(false); setSelectedRequest(null); setTechnicianName(''); setResolutionNotes(''); }}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceBoards;
