import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../../components/ThemeConfig';
import { Button } from '../../components/Button';
import AssetHistoryDrawer from './AssetHistoryDrawer';

export default function AssetRegistry() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Categories & Departments list (fetched from yash/departments or static fallback)
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Detail / History Drawer state
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Registration Form Drawer state
  const [registerOpen, setRegisterOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formSerial, setFormSerial] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formBookable, setFormBookable] = useState(false);
  const [formAcquisitionDate, setFormAcquisitionDate] = useState('');

  // Fetch categories & departments
  useEffect(() => {
    fetch('/api/yash/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories || []);
      })
      .catch(() => {
        // Fallback mock categories
        setCategories([
          { _id: 'cat1', name: 'Electronics' },
          { _id: 'cat2', name: 'Furniture' },
          { _id: 'cat3', name: 'Mobiles' }
        ]);
      });

    fetch('/api/yash/departments')
      .then(res => res.json())
      .then(data => {
        if (data.success) setDepartments(data.departments || []);
      })
      .catch(() => {
        // Fallback mock departments
        setDepartments([
          { _id: 'dept1', name: 'Engineering' },
          { _id: 'dept2', name: 'Design' },
          { _id: 'dept3', name: 'Field Ops' }
        ]);
      });
  }, []);

  // Fetch Assets
  const fetchAssets = () => {
    setLoading(true);
    let url = `/api/daksh/assets?search=${search}`;
    if (categoryFilter) url += `&category=${categoryFilter}`;
    if (statusFilter) url += `&status=${statusFilter}`;
    if (locationFilter) url += `&location=${locationFilter}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAssets(data.assets);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching assets:', err);
        // Fallback mocks
        setAssets([
          { _id: 'asset1', assetTag: 'AF-0012', name: 'Dell Laptop', category: { name: 'Electronics' }, status: 'Allocated', location: 'bangalore' },
          { _id: 'asset2', assetTag: 'AF-0062', name: 'Projector', category: { name: 'Electronics' }, status: 'Under Maintenance', location: 'HQ Floor 2' },
          { _id: 'asset3', assetTag: 'AF-0201', name: 'Office chair', category: { name: 'Furniture' }, status: 'Available', location: 'warehouse' }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssets();
  }, [search, categoryFilter, statusFilter, locationFilter]);

  // Handle Asset Registration Submit
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/daksh/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          category: formCategory,
          serialNumber: formSerial,
          acquisitionDate: formAcquisitionDate || new Date().toISOString(),
          cost: Number(formCost),
          location: formLocation,
          isBookable: formBookable
        })
      });
      const data = await response.json();
      if (data.success) {
        // Reset form
        setFormName('');
        setFormCategory('');
        setFormSerial('');
        setFormCost('');
        setFormLocation('');
        setFormBookable(false);
        setFormAcquisitionDate('');
        setRegisterOpen(false);
        fetchAssets();
      } else {
        alert('Registration failed: ' + data.message);
      }
    } catch (err) {
      alert('Error connecting to backend: ' + err.message);
    }
  };

  // Status Badge color helper
  const getStatusBadgeStyle = (status) => {
    const base = {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '600',
      display: 'inline-block'
    };

    switch (status) {
      case 'Available':
        return { ...base, backgroundColor: '#d1fae5', color: '#065f46' }; // Green
      case 'Allocated':
        return { ...base, backgroundColor: '#dbeafe', color: '#1e40af' }; // Blue
      case 'Under Maintenance':
        return { ...base, backgroundColor: '#ffedd5', color: '#c2410c' }; // Orange
      case 'Lost':
      case 'Disposed':
      case 'Retired':
        return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' }; // Red
      default:
        return { ...base, backgroundColor: '#f3f4f6', color: '#374151' }; // Grey
    }
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: ThemeConfig.fonts.main, color: '#f3f4f6', backgroundColor: '#111827', minHeight: '90vh', borderRadius: '8px' }}>
      
      {/* Search and Action Bar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by tag, serial, or QR code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: '280px',
            padding: '0.75rem 1rem',
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '0.95rem'
          }}
        />
        <Button variant="secondary" onClick={() => setRegisterOpen(true)} style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
          + Register Asset
        </Button>
      </div>

      {/* Row Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: '#9ca3af', marginRight: '0.5rem' }}>Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', backgroundColor: '#1f2937', color: '#fff', border: '1px solid #374151', borderRadius: '6px' }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <span style={{ fontSize: '0.85rem', color: '#9ca3af', marginRight: '0.5rem' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', backgroundColor: '#1f2937', color: '#fff', border: '1px solid #374151', borderRadius: '6px' }}
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Reserved">Reserved</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Lost">Lost</option>
            <option value="Retired">Retired</option>
            <option value="Disposed">Disposed</option>
          </select>
        </div>

        <div>
          <span style={{ fontSize: '0.85rem', color: '#9ca3af', marginRight: '0.5rem' }}>Location:</span>
          <input
            type="text"
            placeholder="Filter location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{ padding: '0.4rem 0.8rem', backgroundColor: '#1f2937', color: '#fff', border: '1px solid #374151', borderRadius: '6px' }}
          />
        </div>
      </div>

      {/* Dense Asset Grid Table */}
      <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1f2937' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #374151', backgroundColor: '#111827' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Tag</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Category</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af' }}>Location</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Loading assets...</td>
              </tr>
            ) : assets.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No assets found.</td>
              </tr>
            ) : (
              assets.map(asset => (
                <tr
                  key={asset._id}
                  onClick={() => {
                    setSelectedAsset(asset);
                    setDetailOpen(true);
                  }}
                  style={{
                    borderBottom: '1px solid #374151',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 'bold', color: ThemeConfig.colors.secondary }}>{asset.assetTag}</td>
                  <td style={{ padding: '12px 16px', color: '#fff' }}>{asset.name}</td>
                  <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{asset.category ? asset.category.name : 'Unassigned'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={getStatusBadgeStyle(asset.status)}>{asset.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{asset.location}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-out registration drawer */}
      {registerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '450px',
          height: '100vh',
          backgroundColor: '#1f2937',
          borderLeft: '1px solid #374151',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          padding: '2rem',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: ThemeConfig.colors.secondary }}>Register Asset</h3>
            <button
              onClick={() => setRegisterOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Asset Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                style={{ padding: '0.6rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '6px', color: '#fff' }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                style={{ padding: '0.6rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '6px', color: '#fff' }}
                required
              >
                <option value="">Select a Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Serial Number</label>
              <input
                type="text"
                value={formSerial}
                onChange={(e) => setFormSerial(e.target.value)}
                style={{ padding: '0.6rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '6px', color: '#fff' }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Cost (USD)</label>
              <input
                type="number"
                value={formCost}
                onChange={(e) => setFormCost(e.target.value)}
                style={{ padding: '0.6rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '6px', color: '#fff' }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Location</label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                style={{ padding: '0.6rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '6px', color: '#fff' }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Acquisition Date</label>
              <input
                type="date"
                value={formAcquisitionDate}
                onChange={(e) => setFormAcquisitionDate(e.target.value)}
                style={{ padding: '0.6rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '6px', color: '#fff' }}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="bookable"
                checked={formBookable}
                onChange={(e) => setFormBookable(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="bookable" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>Is Shared / Bookable Resource</label>
            </div>

            <Button type="submit" variant="secondary" style={{ marginTop: '1rem', padding: '0.75rem' }}>
              Save Registry
            </Button>
          </form>
        </div>
      )}

      {/* Asset History / QR Code detail Drawer */}
      <AssetHistoryDrawer
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        asset={selectedAsset}
      />

    </div>
  );
}
