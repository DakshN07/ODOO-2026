import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../../components/ThemeConfig';

export default function DiscrepancyReportView() {
  const [reports, setReports] = useState([]);
  const [auditCycles, setAuditCycles] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch audit cycles for selector
    fetch('/api/daksh/audits')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAuditCycles(data.auditCycles || []);
          // Set active cycle as default if present
          const active = data.auditCycles.find(c => c.status === 'Active');
          if (active) {
            setSelectedCycle(active._id);
          } else if (data.auditCycles.length > 0) {
            setSelectedCycle(data.auditCycles[0]._id);
          }
        }
      })
      .catch(() => {
        setAuditCycles([
          { _id: 'cycle1', title: 'Q3 Hardware Audit' },
          { _id: 'cycle2', title: 'Q2 Office Furniture Audit' }
        ]);
        setSelectedCycle('cycle1');
      });
  }, []);

  useEffect(() => {
    fetchReports();
  }, [selectedCycle]);

  const fetchReports = () => {
    setLoading(true);
    let url = '/api/daksh/discrepancies';
    if (selectedCycle) {
      url += `?auditCycleId=${selectedCycle}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReports(data.reports || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reports:', err);
        // Fallback mocks
        setReports([
          {
            _id: 'rep1',
            auditCycle: { title: 'Q3 Hardware Audit' },
            asset: { name: 'Dell Laptop', assetTag: 'AF-0012', location: 'Desk #12' },
            auditor: { name: 'A. Rao' },
            finding: 'Missing',
            notes: 'User reported left company, asset not returned',
            createdAt: new Date().toISOString()
          },
          {
            _id: 'rep2',
            auditCycle: { title: 'Q3 Hardware Audit' },
            asset: { name: 'Projector', assetTag: 'AF-0062', location: 'HQ Floor 2' },
            auditor: { name: 'S. Iqbal' },
            finding: 'Damaged',
            notes: 'HDMI port broken, needs technician inspection',
            createdAt: new Date().toISOString()
          }
        ]);
        setLoading(false);
      });
  };

  const getFindingColor = (finding) => {
    if (finding === 'Missing') return '#ef4444';
    if (finding === 'Damaged') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: ThemeConfig.fonts.main, color: '#f3f4f6', backgroundColor: '#111827', minHeight: '90vh', borderRadius: '8px' }}>
      
      {/* Title & Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0, color: ThemeConfig.colors.secondary }}>Discrepancy Reports</h2>
        
        <div>
          <span style={{ fontSize: '0.9rem', color: '#9ca3af', marginRight: '0.5rem' }}>Select Audit Cycle:</span>
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#1f2937', color: '#fff', border: '1px solid #374151', borderRadius: '6px' }}
          >
            <option value="">All Cycles</option>
            {auditCycles.map(c => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Discrepancies Table */}
      <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1f2937' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #374151', backgroundColor: '#111827' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Asset</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Location</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Auditor</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Finding</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Notes</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Date Reported</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Loading discrepancies...</td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No discrepancies reported for this cycle.</td>
              </tr>
            ) : (
              reports.map(rep => (
                <tr key={rep._id} style={{ borderBottom: '1px solid #374151' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <strong style={{ color: '#fff' }}>{rep.asset?.name || 'Unknown Asset'}</strong>
                    <div style={{ fontSize: '0.8rem', color: ThemeConfig.colors.secondary }}>{rep.asset?.assetTag}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{rep.asset?.location || 'N/A'}</td>
                  <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{rep.auditor?.name || 'N/A'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      color: getFindingColor(rep.finding),
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#111827',
                      fontSize: '0.85rem'
                    }}>{rep.finding}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#d1d5db', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rep.notes || 'No comments'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#9ca3af' }}>
                    {new Date(rep.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
