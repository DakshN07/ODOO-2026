import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../../components/ThemeConfig';
import { Button } from '../../components/Button';

export default function AuditWorkspace() {
  const [activeCycle, setActiveCycle] = useState(null);
  const [assets, setAssets] = useState([]);
  const [verifications, setVerifications] = useState({}); // assetId -> 'Verified'/'Missing'/'Damaged'
  const [notes, setNotes] = useState({}); // assetId -> notes string
  const [discrepancyCount, setDiscrepancyCount] = useState(0);
  const [pendingSync, setPendingSync] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [auditorId, setAuditorId] = useState(''); // Fallback auditor ID
  const [viewDiscrepancies, setViewDiscrepancies] = useState(false);
  const [discrepanciesList, setDiscrepanciesList] = useState([]);

  // Setup connection state listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      flushOfflineQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load of pending sync logs from localStorage
    const savedQueue = localStorage.getItem('audit_pending_sync');
    if (savedQueue) {
      setPendingSync(JSON.parse(savedQueue));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch active audit cycle and target assets
  useEffect(() => {
    fetchActiveAuditCycle();
  }, []);

  const fetchActiveAuditCycle = () => {
    // Fetch all audit cycles
    fetch('/api/daksh/audits')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.auditCycles && data.auditCycles.length > 0) {
          // Find the first Active cycle
          const active = data.auditCycles.find(c => c.status === 'Active');
          if (active) {
            setActiveCycle(active);
            setAuditorId(active.auditors[0]?._id || '');
            fetchAssetsForScope(active.scope);
            fetchDiscrepancies(active._id);
          }
        }
      })
      .catch(() => {
        // Fallback mock active cycle
        const mockCycle = {
          _id: 'cycle1',
          title: 'Q3 Hardware Audit',
          scope: 'Engineering',
          status: 'Active',
          startDate: '2026-07-01',
          endDate: '2026-07-15',
          auditors: [{ _id: 'auditor1', name: 'A. Rao' }, { _id: 'auditor2', name: 'S. Iqbal' }]
        };
        setActiveCycle(mockCycle);
        setAuditorId('auditor1');
        fetchAssetsForScope('Engineering');
      });
  };

  const fetchAssetsForScope = (scope) => {
    // Fetch assets located in scope
    fetch(`/api/daksh/assets?location=${scope}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAssets(data.assets);
        }
      })
      .catch(() => {
        // Fallback mock assets in scope
        setAssets([
          { _id: 'asset1', assetTag: 'AF-0012', name: 'Dell Laptop', location: 'Desk #12', status: 'Allocated' },
          { _id: 'asset2', assetTag: 'AF-0101', name: 'Office chair', location: 'Desk #19', status: 'Available' },
          { _id: 'asset3', assetTag: 'AF-0250', name: 'Monitor 27"', location: 'Desk #35', status: 'Available' }
        ]);
      });
  };

  const fetchDiscrepancies = (cycleId) => {
    fetch(`/api/daksh/discrepancies?auditCycleId=${cycleId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDiscrepanciesList(data.reports || []);
          // Count missing or damaged
          const flagged = data.reports.filter(r => r.finding === 'Missing' || r.finding === 'Damaged').length;
          setDiscrepancyCount(flagged);
          
          // Populate local state verifications
          const verifs = {};
          const notesState = {};
          data.reports.forEach(r => {
            verifs[r.asset._id || r.asset] = r.finding;
            notesState[r.asset._id || r.asset] = r.notes || '';
          });
          setVerifications(verifs);
          setNotes(notesState);
        }
      })
      .catch(() => {
        setDiscrepancyCount(0);
      });
  };

  // Perform verification (supporting offline localStorage caching)
  const handleVerify = (assetId, finding) => {
    // Update local state immediately
    const updatedVerifs = { ...verifications, [assetId]: finding };
    setVerifications(updatedVerifs);

    const flagged = Object.values(updatedVerifs).filter(f => f === 'Missing' || f === 'Damaged').length;
    setDiscrepancyCount(flagged);

    const logPayload = {
      auditCycleId: activeCycle._id,
      assetId,
      finding,
      notes: notes[assetId] || '',
      auditorId
    };

    if (!navigator.onLine) {
      // Offline-First Logic (Feature 1)
      const newQueue = [...pendingSync.filter(q => q.assetId !== assetId), logPayload];
      setPendingSync(newQueue);
      localStorage.setItem('audit_pending_sync', JSON.stringify(newQueue));
    } else {
      // Online execution
      submitVerification(logPayload);
    }
  };

  const submitVerification = (payload) => {
    fetch(`/api/daksh/audits/${payload.auditCycleId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchDiscrepancies(activeCycle._id);
        }
      })
      .catch(err => {
        console.error('Error posting verification:', err);
        // Fallback queue to offline if it fails
        const newQueue = [...pendingSync.filter(q => q.assetId !== payload.assetId), payload];
        setPendingSync(newQueue);
        localStorage.setItem('audit_pending_sync', JSON.stringify(newQueue));
      });
  };

  // Flush offline queue when reconnected (Feature 1 Sync)
  const flushOfflineQueue = () => {
    const queue = JSON.parse(localStorage.getItem('audit_pending_sync') || '[]');
    if (queue.length === 0) return;

    // Send each pending log in sequence
    Promise.all(
      queue.map(payload =>
        fetch(`/api/daksh/audits/${payload.auditCycleId}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(res => res.json())
      )
    )
      .then(() => {
        setPendingSync([]);
        localStorage.removeItem('audit_pending_sync');
        if (activeCycle) fetchDiscrepancies(activeCycle._id);
      })
      .catch(err => {
        console.error('Failed to flush offline verification reports:', err);
      });
  };

  // Handle closing the audit cycle (Locks data, marks missing as Lost)
  const handleCloseCycle = async () => {
    if (!activeCycle) return;
    if (pendingSync.length > 0) {
      alert('Cannot close cycle. You have pending offline changes that need to sync.');
      return;
    }

    try {
      const response = await fetch(`/api/daksh/audits/${activeCycle._id}/close`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.success) {
        alert('Audit cycle closed. Missing items have been updated to Lost status.');
        setActiveCycle(null);
        setAssets([]);
        setVerifications({});
      }
    } catch (err) {
      alert('Error closing audit cycle: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: ThemeConfig.fonts.main, color: '#f3f4f6', backgroundColor: '#111827', minHeight: '90vh', borderRadius: '8px' }}>
      
      {/* Offline Status Badge Banner */}
      {!isOnline && (
        <div style={{
          backgroundColor: '#991b1b',
          color: '#fff',
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          fontWeight: '600',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚠️ Connection Lost. Operating in Offline Mode.</span>
          <span>{pendingSync.length} updates cached locally</span>
        </div>
      )}

      {isOnline && pendingSync.length > 0 && (
        <div style={{
          backgroundColor: '#1e3a8a',
          color: '#fff',
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          fontWeight: '600',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>🔄 Back Online. Caching sync in progress...</span>
          <Button variant="secondary" onClick={flushOfflineQueue} style={{ width: 'auto', padding: '0.25rem 1rem' }}>
            Sync Now ({pendingSync.length})
          </Button>
        </div>
      )}

      {/* Scope Details Banner */}
      {activeCycle ? (
        <div style={{
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: ThemeConfig.colors.secondary }}>{activeCycle.title}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem', color: '#9ca3af' }}>
            <span>Scope: <strong>{activeCycle.scope} Department</strong></span>
            <span>Auditors: <strong>{activeCycle.auditors.map(a => a.name).join(', ')}</strong></span>
            <span>Schedule: <strong>{new Date(activeCycle.startDate).toLocaleDateString()} - {new Date(activeCycle.endDate).toLocaleDateString()}</strong></span>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#1f2937', borderRadius: '8px' }}>
          <h3>No Active Audit Cycle</h3>
          <p style={{ color: '#9ca3af' }}>Click Yash's Management setup or backend routes to initialize an audit cycle.</p>
        </div>
      )}

      {activeCycle && (
        <>
          {/* Main workspace verify block */}
          <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151', padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Asset Verification List</h3>
              <Button variant="secondary" onClick={() => setViewDiscrepancies(!viewDiscrepancies)} style={{ width: 'auto', padding: '0.4rem 1rem' }}>
                {viewDiscrepancies ? 'Show Table Workspace' : 'Preview Discrepancy Reports'}
              </Button>
            </div>

            {!viewDiscrepancies ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1f2937' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #374151', backgroundColor: '#111827' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Asset Tag</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Asset Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Expected Location</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', color: '#9ca3af' }}>Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(asset => {
                    const currentVerif = verifications[asset._id];
                    return (
                      <tr key={asset._id} style={{ borderBottom: '1px solid #374151' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 'bold', color: ThemeConfig.colors.secondary }}>{asset.assetTag}</td>
                        <td style={{ padding: '12px 16px', color: '#fff' }}>{asset.name}</td>
                        <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{asset.location}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <div style={{
                            display: 'inline-flex',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            border: '1px solid #4b5563'
                          }}>
                            {/* Segment 1: Verified */}
                            <button
                              onClick={() => handleVerify(asset._id, 'Verified')}
                              style={{
                                padding: '6px 14px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                backgroundColor: currentVerif === 'Verified' ? '#059669' : '#1f2937',
                                color: currentVerif === 'Verified' ? '#fff' : '#9ca3af'
                              }}
                            >
                              Verified
                            </button>
                            
                            {/* Segment 2: Missing */}
                            <button
                              onClick={() => handleVerify(asset._id, 'Missing')}
                              style={{
                                padding: '6px 14px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                backgroundColor: currentVerif === 'Missing' ? '#dc2626' : '#1f2937',
                                color: currentVerif === 'Missing' ? '#fff' : '#9ca3af',
                                borderLeft: '1px solid #4b5563',
                                borderRight: '1px solid #4b5563'
                              }}
                            >
                              Missing
                            </button>

                            {/* Segment 3: Damaged */}
                            <button
                              onClick={() => handleVerify(asset._id, 'Damaged')}
                              style={{
                                padding: '6px 14px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                backgroundColor: currentVerif === 'Damaged' ? '#d97706' : '#1f2937',
                                color: currentVerif === 'Damaged' ? '#fff' : '#9ca3af'
                              }}
                            >
                              Damaged
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              // Read-only Discrepancy Preview Container
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
                <h4 style={{ margin: 0, color: '#f59e0b' }}>Pending Discrepancies</h4>
                {discrepanciesList.length === 0 ? (
                  <p style={{ color: '#9ca3af' }}>No discrepancy items flagged yet in this cycle.</p>
                ) : (
                  discrepanciesList.map((disc, idx) => (
                    <div key={idx} style={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      padding: '1rem',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <strong style={{ color: '#fff' }}>{disc.asset?.name}</strong> ({disc.asset?.assetTag})
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#9ca3af' }}>
                          Audited by: {disc.auditor?.name} | Finding: 
                          <span style={{ 
                            marginLeft: '5px',
                            color: disc.finding === 'Missing' ? '#ef4444' : '#f59e0b',
                            fontWeight: 'bold' 
                          }}>{disc.finding}</span>
                        </p>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                        Reported: {new Date(disc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Status Tracking Ribbon */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            padding: '1.25rem',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: discrepancyCount > 0 ? '#dc2626' : '#059669'
              }} />
              <span>
                <strong>{discrepancyCount}</strong> assets flagged - discrepancy reports generated automatically.
              </span>
            </div>

            <Button variant="secondary" onClick={handleCloseCycle} style={{ width: 'auto', padding: '0.75rem 2rem' }}>
              Close Audit Cycle
            </Button>
          </div>
        </>
      )}

    </div>
  );
}
