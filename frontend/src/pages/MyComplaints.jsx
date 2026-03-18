import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, X } from 'lucide-react';
import './CustomerDashboard.css';
import './MyComplaints.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MyComplaints = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ orderId: '', subject: '', message: '' });
    const [formError, setFormError] = useState('');

    const userName = (() => {
        try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return u.first_name || ''; }
        catch { return ''; }
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
            const res = await fetch(`${API}/complaints/my-complaints`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (!res.ok) throw new Error('Failed to fetch');
            setComplaints(await res.json());
        } catch {
            setError('Could not load complaints. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API}/orders/my-orders`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (res.ok) setOrders(await res.json());
        } catch { /* non-critical */ }
    };

    useEffect(() => {
        fetchComplaints();
        fetchOrders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!form.subject.trim()) return setFormError('Subject is required.');
        if (!form.message.trim()) return setFormError('Message is required.');
        setSubmitting(true);
        try {
            const res = await fetch(`${API}/complaints`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    orderId: form.orderId || null,
                    subject: form.subject.trim(),
                    message: form.message.trim(),
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to submit');
            }
            setForm({ orderId: '', subject: '', message: '' });
            setShowForm(false);
            fetchComplaints();
        } catch (err) {
            setFormError(err.message || 'Failed to submit complaint. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredComplaints = complaints.filter(c => {
        if (activeFilter === 'all') return true;
        return c.status === activeFilter;
    });

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
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/customer-dashboard'); }}>
                        <span>Dashboard</span>
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/my-orders'); }}>
                        <span>My Orders</span>
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/notifications'); }}>
                        <span>Notifications</span>
                    </a>
                    <a href="#" className="nav-item active" onClick={(e) => { e.preventDefault(); navigate('/my-complaints'); }}>
                        <span>Feedback/Complaints</span>
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>
                        <span>Profile</span>
                    </a>
                </nav>
                <button className="logout-btn" onClick={handleLogout}><span>Logout</span></button>
            </aside>

            {/* Main */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>Feedback/Complaints</h1>
                            <p>Submit and track your feedback or complaints</p>
                        </div>
                        <div className="header-right">
                            <button className="btn-submit-complaint" onClick={() => { setShowForm(true); setFormError(''); }}>
                                <Plus size={18} /> New Complaint
                            </button>
                        </div>
                    </div>
                </header>

                {/* Submit Form Modal */}
                {showForm && (
                    <div className="complaint-modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="complaint-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="complaint-modal-header">
                                <h2>Submit a Complaint</h2>
                                <button className="modal-close-btn" onClick={() => setShowForm(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="complaint-form">
                                <div className="form-group">
                                    <label>Related Order (optional)</label>
                                    <select
                                        value={form.orderId}
                                        onChange={(e) => setForm(f => ({ ...f, orderId: e.target.value }))}
                                    >
                                        <option value="">-- Select an order --</option>
                                        {orders.map(o => (
                                            <option key={o.id} value={o.id}>
                                                {o.order_number} — {o.status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Subject <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Brief subject of your complaint"
                                        value={form.subject}
                                        onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                                        maxLength={255}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Message <span className="required">*</span></label>
                                    <textarea
                                        placeholder="Describe your complaint or feedback in detail..."
                                        value={form.message}
                                        onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                                        rows={5}
                                    />
                                </div>
                                {formError && <p className="form-error">{formError}</p>}
                                <div className="form-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                                    <button type="submit" className="btn-submit" disabled={submitting}>
                                        {submitting ? 'Submitting...' : 'Submit Complaint'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="complaints-filters">
                    {['all', 'submitted', 'resolved'].map(f => (
                        <button
                            key={f}
                            className={`filter-tab${activeFilter === f ? ' active' : ''}`}
                            onClick={() => setActiveFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            {f !== 'all' && (
                                <span className="filter-count">
                                    {complaints.filter(c => c.status === f).length}
                                </span>
                            )}
                            {f === 'all' && (
                                <span className="filter-count">{complaints.length}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* List */}
                <section className="complaints-list">
                    {loading && <p className="complaints-msg">Loading complaints...</p>}
                    {error && <p className="complaints-msg error">{error}</p>}
                    {!loading && !error && filteredComplaints.length === 0 && (
                        <div className="complaints-empty">
                            <MessageSquare size={48} color="#94a3b8" />
                            <p>No complaints found.</p>
                            <button className="btn-submit-complaint" onClick={() => setShowForm(true)}>
                                <Plus size={16} /> Submit a Complaint
                            </button>
                        </div>
                    )}
                    {filteredComplaints.map(c => (
                        <div key={c.id} className="complaint-card">
                            <div className="complaint-card-top">
                                <div className="complaint-card-left">
                                    <h3 className="complaint-subject">{c.subject}</h3>
                                    {c.order_number && (
                                        <span className="complaint-order">Order: {c.order_number}</span>
                                    )}
                                </div>
                                <span className={`complaint-badge ${c.status}`}>{c.status}</span>
                            </div>
                            <p className="complaint-message">{c.message}</p>
                            <p className="complaint-date">Submitted on {fmtDate(c.created_at)}</p>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default MyComplaints;
