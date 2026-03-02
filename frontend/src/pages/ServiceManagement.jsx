import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';
import './AdminDashboard.css';
import './ServiceManagement.css';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:5000/api';
const UNIT_LABELS = { KG: 'per KG', PIECE: 'per Piece', ITEM: 'per Item' };
const EMPTY_FORM = { name: '', description: '', unitType: 'ITEM', price: '' };

const ServiceManagement = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [newItem, setNewItem] = useState(EMPTY_FORM);
    const [editingItem, setEditingItem] = useState(null);
    const [historyModal, setHistoryModal] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const getToken = () => localStorage.getItem('token');

    const fetchServices = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const res = await fetch(`${API_URL}/admin/services`, { headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            if (res.ok && data.success) setServices(data.services);
            else if (res.status === 401 || res.status === 403) navigate('/signin');
            else setError(data.message || 'Failed to load services.');
        } catch { setError('Unable to connect to the server.'); }
        finally { setLoading(false); }
    }, [navigate]);

    useEffect(() => { fetchServices(); }, [fetchServices]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) { Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Item name and price are required.', confirmButtonColor: '#0ea5e9' }); return; }
        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/admin/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ serviceName: newItem.name, description: newItem.description || null, unitType: newItem.unitType, pricePerUnit: newItem.price }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setServices(prev => [...prev, data.service]);
                setNewItem(EMPTY_FORM);
                Swal.fire({ icon: 'success', title: 'Service Added!', text: data.message, timer: 1600, timerProgressBar: true, showConfirmButton: false });
            } else Swal.fire({ icon: 'error', title: 'Error', text: data.message, confirmButtonColor: '#0ea5e9' });
        } catch { Swal.fire({ icon: 'error', title: 'Connection Error', text: 'Unable to reach the server.', confirmButtonColor: '#0ea5e9' }); }
        finally { setSubmitting(false); }
    };

    const handleEditStart = (service) => setEditingItem({ id: service.id, name: service.name, description: service.description || '', unitType: service.unitType, price: service.price !== null ? String(service.price) : '' });

    const handleEditSave = async (e) => {
        e.preventDefault();
        if (!editingItem.name || !editingItem.price) { Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Item name and price are required.', confirmButtonColor: '#0ea5e9' }); return; }
        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/admin/services/${editingItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ serviceName: editingItem.name, description: editingItem.description || null, unitType: editingItem.unitType, pricePerUnit: editingItem.price }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setServices(prev => prev.map(s => s.id === editingItem.id ? data.service : s));
                setEditingItem(null);
                Swal.fire({ icon: 'success', title: 'Updated!', text: data.message, timer: 1600, timerProgressBar: true, showConfirmButton: false });
            } else Swal.fire({ icon: 'error', title: 'Error', text: data.message, confirmButtonColor: '#0ea5e9' });
        } catch { Swal.fire({ icon: 'error', title: 'Connection Error', text: 'Unable to reach the server.', confirmButtonColor: '#0ea5e9' }); }
        finally { setSubmitting(false); }
    };

    const handleToggleStatus = async (service) => {
        const action = service.isActive ? 'deactivate' : 'activate';
        const confirm = await Swal.fire({ icon: 'question', title: `${action.charAt(0).toUpperCase() + action.slice(1)} Service?`, text: `Are you sure you want to ${action} "${service.name}"?`, showCancelButton: true, confirmButtonColor: service.isActive ? '#ef4444' : '#22c55e', cancelButtonColor: '#94a3b8', confirmButtonText: `Yes, ${action}` });
        if (!confirm.isConfirmed) return;
        try {
            const res = await fetch(`${API_URL}/admin/services/${service.id}/toggle-status`, { method: 'PATCH', headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            if (res.ok && data.success) {
                setServices(prev => prev.map(s => s.id === service.id ? { ...s, isActive: data.isActive } : s));
                Swal.fire({ icon: 'success', title: 'Done', text: data.message, timer: 1500, timerProgressBar: true, showConfirmButton: false });
            } else Swal.fire({ icon: 'error', title: 'Error', text: data.message, confirmButtonColor: '#0ea5e9' });
        } catch { Swal.fire({ icon: 'error', title: 'Connection Error', text: 'Unable to reach the server.', confirmButtonColor: '#0ea5e9' }); }
    };

    const handleDeleteItem = async (service) => {
        const confirm = await Swal.fire({ icon: 'warning', title: 'Delete Service?', html: `This will permanently delete <strong>${service.name}</strong> and its price history.`, showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#94a3b8', confirmButtonText: 'Yes, delete' });
        if (!confirm.isConfirmed) return;
        try {
            const res = await fetch(`${API_URL}/admin/services/${service.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            if (res.ok && data.success) {
                setServices(prev => prev.filter(s => s.id !== service.id));
                Swal.fire({ icon: 'success', title: 'Deleted', text: data.message, timer: 1500, timerProgressBar: true, showConfirmButton: false });
            } else Swal.fire({ icon: 'error', title: 'Error', text: data.message, confirmButtonColor: '#0ea5e9' });
        } catch { Swal.fire({ icon: 'error', title: 'Connection Error', text: 'Unable to reach the server.', confirmButtonColor: '#0ea5e9' }); }
    };

    const handleViewHistory = async (service) => {
        setHistoryLoading(true); setHistoryModal({ serviceName: service.name, history: [] });
        try {
            const res = await fetch(`${API_URL}/admin/services/${service.id}/price-history`, { headers: { Authorization: `Bearer ${getToken()}` } });
            const data = await res.json();
            if (res.ok && data.success) setHistoryModal({ serviceName: data.serviceName, history: data.history });
        } catch { } finally { setHistoryLoading(false); }
    };

    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); sessionStorage.removeItem('token'); sessionStorage.removeItem('user'); navigate('/signin'); };
    const formatDate = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

    return (
        <div className="dashboard">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header"><h2 className="logo">WashTub</h2></div>
                <nav className="sidebar-nav">
                    <Link to="/admin-dashboard" className="nav-item"><span>Overview</span></Link>
                    <Link to="/user-management" className="nav-item"><span>User Management</span></Link>
                    <Link to="/service-management" className="nav-item active"><span>Service Management</span></Link>
                    <Link to="/all-orders" className="nav-item"><span>All Orders</span></Link>
                    <Link to="/payment" className="nav-item"><span>Payment</span></Link>
                    <Link to="/generate-report" className="nav-item"><span>Generate Reports</span></Link>
                    <Link to="/system-settings" className="nav-item"><span>System Settings</span></Link>
                </nav>
                <button className="logout-btn" onClick={handleLogout}><span>Logout</span></button>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="header-left"><h1>Service Management</h1><p>Manage laundry services and pricing</p></div>
                    </div>
                </header>
                <div className="dashboard-content">
                    {error && (
                        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 20px', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{error}</span>
                            <button onClick={fetchServices} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
                        </div>
                    )}
                    <div className="service-management-container">
                        <section className="stats-section admin-stats">
                            <div className="stat-card"><div className="stat-info"><p className="stat-label">Total Services</p><h3 className="stat-value">{services.length}</h3></div></div>
                            <div className="stat-card"><div className="stat-info"><p className="stat-label">Active</p><h3 className="stat-value">{services.filter(s => s.isActive).length}</h3></div></div>
                            <div className="stat-card"><div className="stat-info"><p className="stat-label">Inactive</p><h3 className="stat-value">{services.filter(s => !s.isActive).length}</h3></div></div>
                        </section>

                        <section className="add-service-section" style={{ marginBottom: '1.25rem' }}>
                            <div
                                onClick={() => setShowAddForm(p => !p)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
                            >
                                <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Add New Service Item</h2>
                                <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>{showAddForm ? '▲ Collapse' : '▼ Expand'}</span>
                            </div>
                            {showAddForm && (
                            <form className="add-service-form" onSubmit={handleAddItem} style={{ marginTop: '1rem' }}>
                                <div className="form-group">
                                    <label>Item Name *</label>
                                    <input type="text" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} placeholder="e.g. T-Shirt, Blanket" required disabled={submitting} />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={newItem.description} onChange={e => setNewItem(p => ({ ...p, description: e.target.value }))} disabled={submitting}>
                                        <option value="">-- Select Category --</option>
                                        <option value="Wash &amp; Dry">Wash &amp; Dry</option>
                                        <option value="Ironing">Ironing</option>
                                        <option value="Dry Cleaning">Dry Cleaning</option>
                                        <option value="Pressing">Pressing</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Unit Type *</label>
                                    <select value={newItem.unitType} onChange={e => setNewItem(p => ({ ...p, unitType: e.target.value }))} disabled={submitting}>
                                        <option value="ITEM">Item (per item)</option>
                                        <option value="PIECE">Piece (per piece)</option>
                                        <option value="KG">KG (per kilogram)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Price (Rs.) *</label>
                                    <input type="number" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))} placeholder="0.00" min="0" step="0.01" required disabled={submitting} />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Adding...' : '+ Add Item'}</button>
                                </div>
                            </form>
                            )}
                        </section>

                        <section className="services-list-section">
                            <h2>Current Services ({services.length})</h2>
                            <div className="table-container">
                                {loading ? (
                                    <div className="no-data"><p>Loading services...</p></div>
                                ) : (
                                    <table className="dashboard-table">
                                        <thead>
                                            <tr>
                                                <th>#</th><th>Item Name</th><th>Description</th><th>Unit</th><th>Price (Rs.)</th><th>Status</th><th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {services.map((service, i) => (
                                                <tr key={service.id} style={{ opacity: service.isActive ? 1 : 0.55 }}>
                                                    <td>{i + 1}</td>
                                                    <td style={{ fontWeight: 600 }}>{service.name}</td>
                                                    <td>{service.description ? <span className="category-badge" style={{ background: '#f0f9ff', color: '#0369a1' }}>{service.description}</span> : '—'}</td>
                                                    <td><span className="category-badge" style={{ background: '#f8fafc', color: '#475569' }}>{UNIT_LABELS[service.unitType] || service.unitType}</span></td>
                                                    <td style={{ fontWeight: 700, color: '#0f172a' }}>Rs. {service.price !== null ? Number(service.price).toFixed(2) : '—'}</td>
                                                    <td><span className={`status-badge ${service.isActive ? 'status-active' : 'status-inactive'}`}>{service.isActive ? 'Active' : 'Inactive'}</span></td>
                                                    <td className="svc-actions-cell">
                                                        <button className="svc-btn-edit" onClick={() => handleEditStart(service)}>Edit</button>
                                                        <button className={`svc-btn-edit ${service.isActive ? 'svc-btn-deactivate' : 'svc-btn-activate'}`} onClick={() => handleToggleStatus(service)}>{service.isActive ? 'Deactivate' : 'Activate'}</button>
                                                        <button className="svc-btn-history" onClick={() => handleViewHistory(service)}>History</button>
                                                        <button className="svc-btn-delete" onClick={() => handleDeleteItem(service)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {!loading && services.length === 0 && (
                                                <tr><td colSpan="7" className="text-center">No services found. Add some items above.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {editingItem && (
                <div className="svc-modal-overlay" onClick={() => setEditingItem(null)}>
                    <div className="svc-edit-modal" onClick={e => e.stopPropagation()}>
                        <div className="svc-edit-header">
                            <div className="svc-edit-header-left">
                                <div className="svc-edit-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </div>
                                <div>
                                    <h3>Edit Service</h3>
                                    <span className="svc-edit-subtitle">Update details for this service item</span>
                                </div>
                            </div>
                            <button className="svc-edit-close" onClick={() => setEditingItem(null)} aria-label="Close">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>

                        <form onSubmit={handleEditSave}>
                            <div className="svc-edit-body">
                                <div className="svc-edit-section">
                                    <div className="svc-edit-section-label">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                        <span>Service Details</span>
                                    </div>
                                    <div className="svc-edit-field">
                                        <label className="svc-edit-label">Item Name <span className="svc-required">*</span></label>
                                        <input
                                            type="text"
                                            className="svc-edit-input"
                                            value={editingItem.name}
                                            onChange={e => setEditingItem(p => ({ ...p, name: e.target.value }))}
                                            placeholder="e.g. T-Shirt, Blanket"
                                            required
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="svc-edit-row">
                                        <div className="svc-edit-field">
                                            <label className="svc-edit-label">Category</label>
                                            <select
                                                className="svc-edit-input"
                                                value={editingItem.description}
                                                onChange={e => setEditingItem(p => ({ ...p, description: e.target.value }))}
                                                disabled={submitting}
                                            >
                                                <option value="">-- Select --</option>
                                                <option value="Wash &amp; Dry">Wash &amp; Dry</option>
                                                <option value="Ironing">Ironing</option>
                                                <option value="Dry Cleaning">Dry Cleaning</option>
                                                <option value="Pressing">Pressing</option>
                                            </select>
                                        </div>
                                        <div className="svc-edit-field">
                                            <label className="svc-edit-label">Unit Type <span className="svc-required">*</span></label>
                                            <select
                                                className="svc-edit-input"
                                                value={editingItem.unitType}
                                                onChange={e => setEditingItem(p => ({ ...p, unitType: e.target.value }))}
                                                disabled={submitting}
                                            >
                                                <option value="ITEM">Item (per item)</option>
                                                <option value="PIECE">Piece (per piece)</option>
                                                <option value="KG">KG (per kilogram)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="svc-edit-divider"></div>

                                <div className="svc-edit-section">
                                    <div className="svc-edit-section-label">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                        <span>Pricing</span>
                                    </div>
                                    <div className="svc-edit-field">
                                        <label className="svc-edit-label">Price (Rs.) <span className="svc-required">*</span></label>
                                        <div className="svc-edit-price-wrapper">
                                            <span className="svc-edit-price-prefix">Rs.</span>
                                            <input
                                                type="number"
                                                className="svc-edit-input svc-edit-price-input"
                                                value={editingItem.price}
                                                onChange={e => setEditingItem(p => ({ ...p, price: e.target.value }))}
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                required
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>
                                    <div className="svc-edit-price-notice">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                        <span>Changing the price will archive the old price to history and set a new current price.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="svc-edit-footer">
                                <button type="button" className="svc-edit-btn-cancel" onClick={() => setEditingItem(null)} disabled={submitting}>
                                    Cancel
                                </button>
                                <button type="submit" className="svc-edit-btn-save" disabled={submitting}>
                                    {submitting ? (
                                        <><span className="svc-edit-spinner"></span> Saving...</>
                                    ) : (
                                        <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {historyModal && (
                <div className="svc-modal-overlay" onClick={() => setHistoryModal(null)}>
                    <div className="svc-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
                        <div className="svc-modal-header">
                            <h3>Price History - {historyModal.serviceName}</h3>
                            <button className="svc-modal-close" onClick={() => setHistoryModal(null)}>x</button>
                        </div>
                        <div className="svc-modal-body" style={{ maxHeight: 400, overflowY: 'auto' }}>
                            {historyLoading ? (
                                <p style={{ textAlign: 'center', color: '#64748b' }}>Loading...</p>
                            ) : historyModal.history.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#64748b' }}>No price history available.</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc' }}>
                                            <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Price (Rs.)</th>
                                            <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Effective From</th>
                                            <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Effective To</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyModal.history.map((h, i) => (
                                            <tr key={h.service_price_id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                                                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>Rs. {Number(h.price_per_unit).toFixed(2)}</td>
                                                <td style={{ padding: '8px 12px', color: '#475569', borderBottom: '1px solid #f1f5f9' }}>{formatDate(h.effective_from)}</td>
                                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>{h.effective_to ? <span style={{ color: '#475569' }}>{formatDate(h.effective_to)}</span> : <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 700 }}>Current</span>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="svc-modal-footer"><button className="svc-btn-cancel" onClick={() => setHistoryModal(null)}>Close</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceManagement;
