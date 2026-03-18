import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, CheckCircle, Clock } from 'lucide-react';
import './CustomerDashboard.css';
import './AdminDashboard.css';
import './AllComplaints.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AllComplaints = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const adminName = (() => {
        try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return u.first_name || 'Admin'; }
        catch { return 'Admin'; }
    })();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/signin');
    };

    const fetchComplaints = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API}/complaints`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setComplaints(await res.json());
        } catch {
            setError('Failed to load complaints. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);

    const filteredComplaints = useMemo(() => {
        return complaints.filter(c => {
            const name = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase();
            const matchSearch = !searchTerm ||
                (c.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                name.includes(searchTerm.toLowerCase());
            const matchStatus = filterStatus === 'all' || c.status === filterStatus;
            return matchSearch && matchStatus;
        });
    }, [complaints, searchTerm, filterStatus]);

    const totalCount = complaints.length;
    const openCount = complaints.filter(c => c.status === 'open').length;
    const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

    const updateStatus = async (complaintId, newStatus) => {
        setUpdatingId(complaintId);
        try {
            const res = await fetch(`${API}/complaints/${complaintId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error('Failed to update');
            setComplaints(prev =>
                prev.map(c => c.id === complaintId ? { ...c, status: newStatus } : c)
            );
            if (selectedComplaint && selectedComplaint.id === complaintId) {
                setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
            }
        } catch {
            alert('Failed to update status. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    };

    const fmtDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header"><h2 className="logo">WashTub</h2></div>
                <nav className="sidebar-nav">
                    <Link to="/admin-dashboard" className="nav-item"><span>Overview</span></Link>
                    <Link to="/user-management" className="nav-item"><span>User Management</span></Link>
                    <Link to="/service-management" className="nav-item"><span>Service Management</span></Link>
                    <Link to="/all-orders" className="nav-item"><span>All Order Updates</span></Link>
                    <Link to="/payment" className="nav-item"><span>Payment Updates</span></Link>
                    <Link to="/generate-report" className="nav-item"><span>Generate Reports</span></Link>
                    <Link to="/all-complaints" className="nav-item active"><span>Feedback/Complaints</span></Link>
                    <Link to="/system-settings" className="nav-item"><span>System Settings</span></Link>
                </nav>
                <button className="logout-btn" onClick={handleLogout}><span>Logout</span></button>
            </aside>

            {/* Main */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div>
                            <h1>Customer Feedback/Complaints</h1>
                            <p>View and manage all customer complaints</p>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Stats */}
                    <section className="stats-section admin-stats">
                        <div className="stat-card">
                            <div className="stat-icon"><MessageSquare size={20} /></div>
                            <div className="stat-info">
                                <p className="stat-label">Total</p>
                                <h3 className="stat-value">{loading ? '—' : totalCount}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><Clock size={20} /></div>
                            <div className="stat-info">
                                <p className="stat-label">Open</p>
                                <h3 className="stat-value">{loading ? '—' : openCount}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><CheckCircle size={20} /></div>
                            <div className="stat-info">
                                <p className="stat-label">Resolved</p>
                                <h3 className="stat-value">{loading ? '—' : resolvedCount}</h3>
                            </div>
                        </div>
                    </section>

                    {/* Search & Filter */}
                    <div className="ac-controls">
                        <input
                            className="ac-search"
                            type="text"
                            placeholder="Search by subject or customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="ac-filter"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>

                    {/* Complaints Table */}
                    {loading && <p className="ac-msg">Loading complaints...</p>}
                    {error && <p className="ac-msg error">{error}</p>}
                    {!loading && !error && filteredComplaints.length === 0 && (
                        <p className="ac-msg">No complaints found.</p>
                    )}
                    {!loading && !error && filteredComplaints.length > 0 && (
                        <div className="ac-table-wrap">
                            <table className="ac-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Customer</th>
                                        <th>Order</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredComplaints.map(c => (
                                        <tr key={c.id} className={selectedComplaint?.id === c.id ? 'ac-row selected' : 'ac-row'}>
                                            <td>{c.id}</td>
                                            <td>{c.first_name} {c.last_name}</td>
                                            <td>{c.order_number || '—'}</td>
                                            <td className="ac-subject">{c.subject}</td>
                                            <td>
                                                <span className={`complaint-badge ${c.status}`}>{c.status}</span>
                                            </td>
                                            <td>{fmtDate(c.created_at)}</td>
                                            <td>
                                                <button
                                                    className="ac-view-btn"
                                                    onClick={() => setSelectedComplaint(selectedComplaint?.id === c.id ? null : c)}
                                                >
                                                    {selectedComplaint?.id === c.id ? 'Close' : 'View'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Detail Panel */}
                    {selectedComplaint && (
                        <div className="ac-detail-panel">
                            <div className="ac-detail-header">
                                <div>
                                    <h3>{selectedComplaint.subject}</h3>
                                    <p className="ac-detail-meta">
                                        By <strong>{selectedComplaint.first_name} {selectedComplaint.last_name}</strong>
                                        {selectedComplaint.order_number && <> · Order <strong>{selectedComplaint.order_number}</strong></>}
                                        {' '}· {fmtDate(selectedComplaint.created_at)}
                                    </p>
                                </div>
                                <button className="ac-close-panel" onClick={() => setSelectedComplaint(null)}>✕</button>
                            </div>
                            <p className="ac-detail-message">{selectedComplaint.message}</p>
                            <div className="ac-detail-actions">
                                <label className="ac-status-label">Update Status:</label>
                                <select
                                    className="ac-status-select"
                                    value={selectedComplaint.status}
                                    onChange={(e) => updateStatus(selectedComplaint.id, e.target.value)}
                                    disabled={updatingId === selectedComplaint.id}
                                >
                                    <option value="open">Open</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                                {updatingId === selectedComplaint.id && <span className="ac-updating">Saving...</span>}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AllComplaints;
