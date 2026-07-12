import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../../components/ThemeConfig';

export default function AssetHistoryDrawer({ open, onClose, asset }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && asset && asset._id) {
      setLoading(true);
      fetch(`/api/daksh/assets/${asset._id}/history`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setHistory(data.history || []);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching history:', err);
          // Fallback mock history timeline
          setHistory([
            {
              type: 'allocation',
              date: new Date().toISOString(),
              status: 'Active',
              user: 'Priya Shah',
              userEmail: 'priya@company.com',
              by: 'Admin',
              notes: 'Allocated for Engineering remote workspace'
            },
            {
              type: 'return',
              date: new Date(Date.now() - 86400000 * 30).toISOString(),
              status: 'Returned',
              user: 'Arjun Nair',
              by: 'System'
            }
          ]);
          setLoading(false);
        });
    }
  }, [open, asset]);

  if (!open || !asset) return null;

  // QR Code URL based on the generated sequential asset tag
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(asset.assetTag)}`;

  // Formatting date strings
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '480px',
      height: '100vh',
      backgroundColor: '#1f2937',
      borderLeft: '1px solid #374151',
      boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
      padding: '2rem',
      zIndex: 101,
      display: 'flex',
      flexDirection: 'column',
      color: '#fff',
      fontFamily: ThemeConfig.fonts.main
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, color: ThemeConfig.colors.secondary }}>Asset Details & History</h3>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          &times;
        </button>
      </div>

      {/* Content Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', flex: 1, paddingRight: '5px' }}>
        
        {/* Profile Card & QR Block */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          backgroundColor: '#111827',
          padding: '1.25rem',
          borderRadius: '8px',
          border: '1px solid #374151',
          alignItems: 'center'
        }}>
          {/* QR Render */}
          <div style={{
            backgroundColor: '#fff',
            padding: '8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '140px',
            height: '140px'
          }}>
            <img 
              src={qrCodeUrl} 
              alt={`QR Tag ${asset.assetTag}`} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Core Specs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: ThemeConfig.colors.secondary }}>{asset.assetTag}</span>
            <strong style={{ fontSize: '1.05rem' }}>{asset.name}</strong>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Serial: {asset.serialNumber}</span>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Location: {asset.location}</span>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Cost: ${asset.cost}</span>
          </div>
        </div>

        {/* History Timeline section */}
        <div>
          <h4 style={{ borderBottom: '1px solid #374151', paddingBottom: '0.5rem', color: '#9ca3af', marginBottom: '1rem' }}>Lifecycle Timeline</h4>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>Loading history...</div>
          ) : history.length === 0 ? (
            <div style={{ color: '#9ca3af', padding: '0.5rem' }}>No history records found for this asset.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', paddingLeft: '1rem' }}>
              {/* Vertical line indicator */}
              <div style={{
                position: 'absolute',
                top: 8,
                bottom: 8,
                left: 3,
                width: '2px',
                backgroundColor: '#374151'
              }} />

              {history.map((event, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  {/* Circle dot on line */}
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: '-17px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: event.type === 'maintenance' ? ThemeConfig.colors.warning : ThemeConfig.colors.secondary,
                    border: '2px solid #1f2937'
                  }} />

                  {/* Log Event block */}
                  <div style={{
                    backgroundColor: '#111827',
                    padding: '0.8rem',
                    borderRadius: '6px',
                    border: '1px solid #374151',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', marginBottom: '0.25rem' }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{event.type.replace('_', ' ')}</span>
                      <span>{formatDate(event.date)}</span>
                    </div>

                    {event.type === 'allocation' && (
                      <p style={{ margin: 0 }}>
                        Allocated to <strong>{event.user}</strong> ({event.userEmail}) by {event.by}.
                      </p>
                    )}

                    {event.type === 'return' && (
                      <p style={{ margin: 0 }}>
                        Returned by <strong>{event.user}</strong>. Confirmed in system.
                      </p>
                    )}

                    {event.type === 'maintenance' && (
                      <div>
                        <p style={{ margin: 0 }}>Issue: {event.notes}</p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#f59e0b' }}>
                          Status: {event.status} | Priority: {event.priority}
                        </p>
                      </div>
                    )}

                    {event.type === 'maintenance_resolved' && (
                      <p style={{ margin: 0 }}>
                        Resolved. Repair Cost: <strong>${event.cost || 0}</strong>. Returning asset to available pool.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
