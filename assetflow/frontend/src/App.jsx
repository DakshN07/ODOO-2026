import React, { useState } from 'react';
import { ThemeConfig } from './components/ThemeConfig';
import { Button } from './components/Button';

// Yash Pages
import Login from './pages/yash/Login';
import AdminSetup from './pages/yash/AdminSetup';
import Dashboard from './pages/yash/Dashboard';
import Logs from './pages/yash/Logs';

// Daksh Pages
import AssetDirectory from './pages/daksh/AssetDirectory';
import Registration from './pages/daksh/Registration';
import Audits from './pages/daksh/Audits';

// Ayush Pages
import Allocations from './pages/ayush/Allocations';
import Bookings from './pages/ayush/Bookings';
import MaintenanceBoards from './pages/ayush/MaintenanceBoards';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'login': return <Login />;
      case 'admin-setup': return <AdminSetup />;
      case 'dashboard': return <Dashboard />;
      case 'logs': return <Logs />;
      case 'assets': return <AssetDirectory />;
      case 'register-asset': return <Registration />;
      case 'audits': return <Audits />;
      case 'allocations': return <Allocations />;
      case 'bookings': return <Bookings />;
      case 'maintenance': return <MaintenanceBoards />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: ThemeConfig.fonts.main,
      background: ThemeConfig.colors.background.light,
      color: ThemeConfig.colors.text.light
    }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '260px',
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: ThemeConfig.colors.primary, marginBottom: '2rem' }}>
          AssetFlow
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: '600', padding: '0.25rem 0.5rem' }}>
            Yash (Admin & Auth)
          </div>
          <Button variant="primary" onClick={() => setCurrentPage('dashboard')} className={currentPage === 'dashboard' ? 'active' : ''}>Dashboard</Button>
          <Button variant="primary" onClick={() => setCurrentPage('login')} className={currentPage === 'login' ? 'active' : ''}>Login</Button>
          <Button variant="primary" onClick={() => setCurrentPage('admin-setup')} className={currentPage === 'admin-setup' ? 'active' : ''}>Admin Setup</Button>
          <Button variant="primary" onClick={() => setCurrentPage('logs')} className={currentPage === 'logs' ? 'active' : ''}>Activity Logs</Button>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: '600', padding: '0.5rem 0.5rem 0.25rem 0.5rem' }}>
            Daksh (Assets & Audits)
          </div>
          <Button variant="secondary" onClick={() => setCurrentPage('assets')} className={currentPage === 'assets' ? 'active' : ''}>Asset Directory</Button>
          <Button variant="secondary" onClick={() => setCurrentPage('register-asset')} className={currentPage === 'register-asset' ? 'active' : ''}>Register Asset</Button>
          <Button variant="secondary" onClick={() => setCurrentPage('audits')} className={currentPage === 'audits' ? 'active' : ''}>Audit Cycles</Button>

          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: '600', padding: '0.5rem 0.5rem 0.25rem 0.5rem' }}>
            Ayush (Allocations & Maintenance)
          </div>
          <Button variant="warning" onClick={() => setCurrentPage('allocations')} className={currentPage === 'allocations' ? 'active' : ''}>Allocations</Button>
          <Button variant="warning" onClick={() => setCurrentPage('bookings')} className={currentPage === 'bookings' ? 'active' : ''}>Bookings</Button>
          <Button variant="warning" onClick={() => setCurrentPage('maintenance')} className={currentPage === 'maintenance' ? 'active' : ''}>Maintenance Board</Button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, background: '#f9fafb' }}>
        <header style={{
          height: '64px',
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 2rem'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
            Current User: <strong>Manager</strong>
          </div>
        </header>

        <div style={{ padding: '2rem' }}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
