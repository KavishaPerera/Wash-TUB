import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';
import './AdminDashboard.css';
import './UserManagement.css';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:5000/api';

// Map DB role values to display labels
const ROLE_LABELS = {
    owner: 'Admin',
    staff: 'Staff',
    delivery: 'Delivery',
    customer: 'Customer',
};

const UserManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getToken = () => localStorage.getItem('token');

    // -----------------------------------------------------------
    // Fetch all users from backend
    // -----------------------------------------------------------
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setUsers(data.users);
            } else if (response.status === 401 || response.status === 403) {
                navigate('/signin');
            } else {
                setError(data.message || 'Failed to load users.');
            }
        } catch {
            setError('Unable to connect to the server.');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // -----------------------------------------------------------
    // Toggle active / inactive
    // -----------------------------------------------------------
    const handleToggleStatus = async (userId, currentStatus, userName) => {
        const action = currentStatus ? 'deactivate' : 'activate';
        const confirm = await Swal.fire({
            icon: 'question',
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} User?`,
            text: `Are you sure you want to ${action} ${userName}?`,
            showCancelButton: true,
            confirmButtonColor: currentStatus ? '#ef4444' : '#22c55e',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: `Yes, ${action}`,
        });
        if (!confirm.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/toggle-status`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setUsers(prev =>
                    prev.map(u => u.id === userId ? { ...u, isActive: data.isActive } : u)
                );
                Swal.fire({
                    icon: 'success',
                    title: 'Status Updated',
                    text: data.message,
                    timer: 1800,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: data.message, confirmButtonColor: '#0ea5e9' });
            }
        } catch {
            Swal.fire({ icon: 'error', title: 'Connection Error', text: 'Unable to reach the server.', confirmButtonColor: '#0ea5e9' });
        }
    };

    // -----------------------------------------------------------
    // Delete user
    // -----------------------------------------------------------
    const handleDeleteUser = async (userId, userName) => {
        const confirm = await Swal.fire({
            icon: 'warning',
            title: 'Delete User?',
            html: `This will <strong>permanently delete</strong> the account for <strong>${userName}</strong>. This cannot be undone.`,
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, delete',
        });
        if (!confirm.isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setUsers(prev => prev.filter(u => u.id !== userId));
                Swal.fire({
                    icon: 'success',
                    title: 'User Deleted',
                    text: data.message,
                    timer: 1800,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: data.message, confirmButtonColor: '#0ea5e9' });
            }
        } catch {
            Swal.fire({ icon: 'error', title: 'Connection Error', text: 'Unable to reach the server.', confirmButtonColor: '#0ea5e9' });
        }
    };

    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); sessionStorage.removeItem('token'); sessionStorage.removeItem('user'); navigate('/signin'); };

    // -----------------------------------------------------------
    // Filtered list
    // -----------------------------------------------------------
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        // 'admin' filter tab maps to 'owner' DB role
        const roleFilter = filterRole === 'admin' ? 'owner' : filterRole;
        const matchesRole = filterRole === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeClass = (role) => {
        return { owner: 'role-admin', staff: 'role-staff', delivery: 'role-delivery', customer: 'role-customer' }[role] || '';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'â€”';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin-dashboard" className="nav-item">
                        <span>Overview</span>
                    </Link>
                    <a href="#" className="nav-item active">
                        <span>User Management</span>
                    </a>
                    <Link to="/service-management" className="nav-item">
                        <span>Service Management</span>
                    </Link>
                    <Link to="/all-orders" className="nav-item">
                        <span>All Orders</span>
                    </Link>
                    <Link to="/payment" className="nav-item">
                        <span>Payment</span>
                    </Link>
                    <Link to="/generate-report" className="nav-item">
                        <span>Generate Reports</span>
                    </Link>
                    <Link to="/system-settings" className="nav-item">
                        <span>System Settings</span>
                    </Link>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>User Management</h1>
                            <p>Manage system users and permissions</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/add-user')}>
                            + Add New User
                        </button>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Error banner */}
                    {error && (
                        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 20px', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{error}</span>
                            <button onClick={fetchUsers} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <section className="stats-section admin-stats">
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Total Users</p>
                                <h3 className="stat-value">{users.length}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Customers</p>
                                <h3 className="stat-value">{users.filter(u => u.role === 'customer').length}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Staff</p>
                                <h3 className="stat-value">{users.filter(u => u.role === 'staff').length}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Active Users</p>
                                <h3 className="stat-value">{users.filter(u => u.isActive).length}</h3>
                            </div>
                        </div>
                    </section>

                    {/* Filters */}
                    <section className="filters-section">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-tabs">
                            {['all', 'customer', 'staff', 'delivery', 'admin'].map(tab => (
                                <button
                                    key={tab}
                                    className={`filter-tab ${filterRole === tab ? 'active' : ''}`}
                                    onClick={() => setFilterRole(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Users Table */}
                    <section className="dashboard-table-section">
                        <div className="table-container">
                            {loading ? (
                                <div className="no-data"><p>Loading users...</p></div>
                            ) : (
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user, index) => (
                                            <tr key={user.id}>
                                                <td>{index + 1}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone || 'â€”'}</td>
                                                <td>
                                                    <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                                                        {ROLE_LABELS[user.role] || user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td>{formatDate(user.createdAt)}</td>
                                                <td className="actions-cell">
                                                    <button
                                                        className={`btn-action ${user.isActive ? 'btn-toggle' : 'btn-edit'}`}
                                                        onClick={() => handleToggleStatus(user.id, user.isActive, user.name)}
                                                    >
                                                        {user.isActive ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button
                                                        className="btn-action btn-delete"
                                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            {!loading && filteredUsers.length === 0 && (
                                <div className="no-data">
                                    <p>No users found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default UserManagement;
