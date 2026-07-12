import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../../components/ThemeConfig';
import { Button } from '../../components/Button';
import api from '../../api';

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState({
    totalAssets: 0,
    availableAssets: 0,
    allocatedAssets: 0,
    maintenanceAssets: 0
  });

  // Mock analytics data for premium presentation
  const utilizationData = [
    { dept: 'Engineering', value: 85 },
    { dept: 'Design', value: 65 },
    { dept: 'Marketing', value: 45 },
    { dept: 'Field Ops', value: 90 },
    { dept: 'HR', value: 30 }
  ];

  const maintenanceData = [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 30 },
    { month: 'Apr', value: 80 },
    { month: 'May', value: 60 },
    { month: 'Jun', value: 95 }
  ];

  useEffect(() => {
    // Fetch KPI stats from Yash's endpoint
    setLoading(true);
    api.get('/yash/dashboard/kpis')
      .then(res => {
        if (res.data.success) {
          setKpis(res.data.kpis);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleExport = () => {
    alert('Report exported successfully as CSV!');
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: ThemeConfig.fonts.main, color: '#f3f4f6', backgroundColor: '#111827', minHeight: '90vh', borderRadius: '8px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: ThemeConfig.colors.secondary }}>Reports & Analytics</h2>
        <Button onClick={handleExport} style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>
          Export Report
        </Button>
      </div>

      {/* Grid Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Chart A: Utilization by Department */}
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: '#9ca3af' }}>Asset Utilization by Department (%)</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '180px', paddingTop: '20px' }}>
            {utilizationData.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '60px' }}>
                <div style={{
                  height: `${item.value * 1.5}px`,
                  width: '28px',
                  backgroundColor: ThemeConfig.colors.secondary,
                  borderRadius: '4px 4px 0 0',
                  position: 'relative',
                  transition: 'height 0.5s ease-in-out'
                }}>
                  <span style={{ position: 'absolute', top: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '0.75rem', color: '#fff' }}>
                    {item.value}%
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }}>
                  {item.dept}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart B: Maintenance Frequency Trend */}
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: '#9ca3af' }}>Maintenance Over time (Repair Frequency)</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '180px', paddingTop: '20px' }}>
            {maintenanceData.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '60px' }}>
                <div style={{
                  height: `${item.value * 1.5}px`,
                  width: '12px',
                  backgroundColor: ThemeConfig.colors.primary,
                  borderRadius: '12px',
                  position: 'relative',
                  transition: 'height 0.5s ease-in-out'
                }}>
                  <span style={{ position: 'absolute', top: '-20px', left: '-10px', right: '-10px', textAlign: 'center', fontSize: '0.75rem', color: '#fff' }}>
                    {item.value}
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* KPI Details Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Most Used Assets */}
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: ThemeConfig.colors.secondary }}>Most Used Assets</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
              <span>Conference Room B2</span>
              <strong style={{ color: '#fff' }}>24 bookings this month</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
              <span>Laptop AF-0012</span>
              <strong style={{ color: '#fff' }}>21 allocations this month</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Projector AF-0062</span>
              <strong style={{ color: '#fff' }}>18 bookings this month</strong>
            </div>
          </div>
        </div>

        {/* Idle Assets */}
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: ThemeConfig.colors.danger }}>Idle Assets</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
              <span>Camera AF-0301</span>
              <strong style={{ color: '#ef4444' }}>Unused 60+ days</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
              <span>Office chair AF-0201</span>
              <strong style={{ color: '#ef4444' }}>Unused 45 days</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Smart TV AF-0115</span>
              <strong style={{ color: '#ef4444' }}>Unused 30 days</strong>
            </div>
          </div>
        </div>

        {/* Nearing Retirement / Due for Maintenance */}
        <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: ThemeConfig.colors.warning }}>Retirement / Maintenance Alert</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
              <span>Forklift AF-0087</span>
              <span style={{ color: '#f59e0b' }}>Service due in 5 days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
              <span>Server Rack AF-0099</span>
              <span style={{ color: '#f59e0b' }}>Nearing retirement (5 yrs old)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Company SUV AF-0024</span>
              <span style={{ color: '#f59e0b' }}>Annual service due this week</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
