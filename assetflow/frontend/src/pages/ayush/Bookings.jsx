import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { ThemeConfig } from '../../components/ThemeConfig';
import axios from 'axios';

const API = 'http://localhost:5000/api/ayush';
const getToken = () => localStorage.getItem('token');
const headers = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const StatusPill = ({ status }) => {
  const colors = {
    'Upcoming': { bg: '#dbeafe', color: '#1e40af' },
    'Ongoing': { bg: '#dcfce7', color: '#166534' },
    'Completed': { bg: '#f3f4f6', color: '#6b7280' },
    'Cancelled': { bg: '#fee2e2', color: '#991b1b' }
  };
  const c = colors[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem',
      fontWeight: '600', background: c.bg, color: c.color
    }}>{status}</span>
  );
};

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  // Form state
  const [form, setForm] = useState({ assetId: '', startTime: '', endTime: '', purpose: '' });

  // Current week for calendar
  const [weekOffset, setWeekOffset] = useState(0);

  const fetchBookings = async () => {
    try {
      let url = `${API}/bookings`;
      if (filterStatus) url += `?status=${filterStatus}`;
      const res = await axios.get(url, headers());
      setBookings(res.data.bookings || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchAssets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/daksh/assets', headers());
      setAssets(res.data.assets || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchBookings(); fetchAssets(); }, [filterStatus]);

  const clearMessages = () => { setTimeout(() => { setError(''); setSuccess(''); }, 4000); };

  const handleBook = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post(`${API}/bookings`, form, headers());
      setSuccess('Resource booked successfully!');
      setShowModal(false);
      setForm({ assetId: '', startTime: '', endTime: '', purpose: '' });
      fetchBookings();
    } catch (e) {
      setError(e.response?.data?.message || 'Booking failed');
    }
    clearMessages();
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await axios.put(`${API}/bookings/${id}/cancel`, {}, headers());
      setSuccess('Booking cancelled');
      fetchBookings();
    } catch (e) { setError(e.response?.data?.message || 'Cancel failed'); }
    clearMessages();
  };

  // Calendar helpers
  const getWeekDays = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay() + 1 + (weekOffset * 7)); // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
  const weekDays = getWeekDays();

  const getBookingsForDayHour = (day, hour) => {
    return bookings.filter(b => {
      if (b.status === 'Cancelled') return false;
      const start = new Date(b.startTime);
      const end = new Date(b.endTime);
      const slotStart = new Date(day);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(day);
      slotEnd.setHours(hour + 1, 0, 0, 0);
      return start < slotEnd && end > slotStart;
    });
  };

  const bookableAssets = assets.filter(a => a.isBookable);
  const filteredBookings = selectedAsset
    ? bookings.filter(b => b.asset?._id === selectedAsset)
    : bookings;

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
    maxWidth: '90vw', boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
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
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Resource Bookings</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>Book shared resources with time-slot overlap validation</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', borderRadius: '8px', border: '1px solid #d1d5db', overflow: 'hidden' }}>
            <button onClick={() => setViewMode('list')}
              style={{ padding: '0.4rem 0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500',
                background: viewMode === 'list' ? ThemeConfig.colors.primary : '#fff', color: viewMode === 'list' ? '#fff' : '#374151' }}>
              List
            </button>
            <button onClick={() => setViewMode('calendar')}
              style={{ padding: '0.4rem 0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500',
                borderLeft: '1px solid #d1d5db',
                background: viewMode === 'calendar' ? ThemeConfig.colors.primary : '#fff', color: viewMode === 'calendar' ? '#fff' : '#374151' }}>
              Calendar
            </button>
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
            <option value="">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <Button onClick={() => setShowModal(true)}>+ Book Resource</Button>
        </div>
      </div>

      {error && <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
      {success && <div style={{ padding: '0.75rem 1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>{success}</div>}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Upcoming', value: bookings.filter(b => b.status === 'Upcoming').length, color: '#3b82f6' },
          { label: 'Ongoing', value: bookings.filter(b => b.status === 'Ongoing').length, color: ThemeConfig.colors.secondary },
          { label: 'Completed', value: bookings.filter(b => b.status === 'Completed').length, color: '#6b7280' },
          { label: 'Cancelled', value: bookings.filter(b => b.status === 'Cancelled').length, color: ThemeConfig.colors.danger }
        ].map((s, i) => (
          <div key={i} style={{ ...cardStyle, borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>{s.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: s.color, marginTop: '0.25rem' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <button onClick={() => setWeekOffset(weekOffset - 1)}
              style={{ padding: '0.4rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>← Prev</button>
            <span style={{ fontWeight: '600', color: '#374151' }}>
              {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button onClick={() => setWeekOffset(weekOffset + 1)}
              style={{ padding: '0.4rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>Next →</button>
          </div>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.5rem', borderBottom: '2px solid #e5e7eb', width: '60px', textAlign: 'left', color: '#6b7280' }}>Time</th>
                  {weekDays.map((d, i) => (
                    <th key={i} style={{ padding: '0.5rem', borderBottom: '2px solid #e5e7eb', textAlign: 'center', color: '#374151',
                      background: d.toDateString() === new Date().toDateString() ? '#eff6ff' : 'transparent' }}>
                      <div style={{ fontWeight: '600' }}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{d.getDate()}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map(h => (
                  <tr key={h}>
                    <td style={{ padding: '0.35rem 0.5rem', borderBottom: '1px solid #f3f4f6', color: '#9ca3af', fontSize: '0.7rem', fontWeight: '500' }}>
                      {h > 12 ? `${h - 12}PM` : h === 12 ? '12PM' : `${h}AM`}
                    </td>
                    {weekDays.map((d, i) => {
                      const slots = getBookingsForDayHour(d, h);
                      return (
                        <td key={i} style={{ padding: '0.15rem', borderBottom: '1px solid #f3f4f6', minWidth: '80px', verticalAlign: 'top',
                          background: d.toDateString() === new Date().toDateString() ? '#fafbff' : 'transparent' }}>
                          {slots.map(b => (
                            <div key={b._id} style={{
                              background: b.status === 'Upcoming' ? '#dbeafe' : b.status === 'Ongoing' ? '#dcfce7' : '#f3f4f6',
                              borderRadius: '4px', padding: '0.2rem 0.35rem', marginBottom: '0.15rem',
                              fontSize: '0.65rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              borderLeft: `2px solid ${b.status === 'Upcoming' ? '#3b82f6' : b.status === 'Ongoing' ? '#10b981' : '#9ca3af'}`
                            }}>
                              {b.asset?.name || 'Resource'}
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div style={cardStyle}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
              No bookings found. Click "Book Resource" to create one.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  {['Resource', 'Tag', 'Booked By', 'Start', 'End', 'Purpose', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(b => (
                  <tr key={b._id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{b.asset?.name || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.8rem', color: ThemeConfig.colors.primary }}>{b.asset?.assetTag || '-'}</td>
                    <td style={{ padding: '0.75rem' }}>{b.user?.name || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.8rem' }}>{new Date(b.startTime).toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.8rem' }}>{new Date(b.endTime).toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#6b7280', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.purpose || '-'}</td>
                    <td style={{ padding: '0.75rem' }}><StatusPill status={b.status} /></td>
                    <td style={{ padding: '0.75rem' }}>
                      {(b.status === 'Upcoming') && (
                        <button onClick={() => handleCancel(b._id)}
                          style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: `1px solid ${ThemeConfig.colors.danger}`, background: '#fef2f2', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '500', color: '#991b1b' }}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Book Resource Modal */}
      {showModal && (
        <div style={modalOverlay} onClick={() => setShowModal(false)}>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>Book Resource</h3>
            <form onSubmit={handleBook}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Resource / Asset *</label>
                  <select value={form.assetId} onChange={e => setForm({ ...form, assetId: e.target.value })} style={inputStyle} required>
                    <option value="">Select a bookable resource</option>
                    {bookableAssets.length > 0 ? bookableAssets.map(a => (
                      <option key={a._id} value={a._id}>{a.name} ({a.assetTag}) — {a.location}</option>
                    )) : assets.map(a => (
                      <option key={a._id} value={a._id}>{a.name} ({a.assetTag})</option>
                    ))}
                  </select>
                  {bookableAssets.length === 0 && assets.length > 0 && (
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: ThemeConfig.colors.warning }}>
                      No assets flagged as bookable. Showing all assets.
                    </p>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Start Time *</label>
                    <input type="datetime-local" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>End Time *</label>
                    <input type="datetime-local" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} style={inputStyle} required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Purpose</label>
                  <textarea value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}
                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} placeholder="Meeting, lab work, etc." />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Book Resource</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
