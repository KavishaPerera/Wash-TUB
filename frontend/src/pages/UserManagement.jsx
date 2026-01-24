import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserManagement.css';

const UserManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [users, setUsers] = useState([
        { id: 'USR-001', name: 'Amandi Perera', email: 'amandi@email.com', role: 'customer', status: 'active', joinDate: 'Jan 15, 2026' },
        { id: 'USR-002', name: 'Kasun Silva', email: 'kasun@washtub.com', role: 'staff', status: 'active', joinDate: 'Jan 10, 2026' },
        { id: 'USR-003', name: 'Nilantha Pieris', email: 'nilantha@washtub.com', role: 'staff', status: 'active', joinDate: 'Jan 08, 2026' },
        { id: 'USR-004', name: 'Bandu Perera', email: 'bandu@email.com', role: 'customer', status: 'inactive', joinDate: 'Jan 05, 2026' },
        { id: 'USR-005', name: 'Supun Mendis', email: 'supun@washtub.com', role: 'delivery', status: 'active', joinDate: 'Jan 03, 2026' },
        { id: 'USR-006', name: 'Ruwan Jayasena', email: 'ruwan@washtub.com', role: 'admin', status: 'active', joinDate: 'Jan 01, 2026' },
    ]);

    const handleLogout = () => {
        navigate('/signin');
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(prev => prev.filter(user => user.id !== userId));
        }
    };

    const handleToggleStatus = (userId) => {
        setUsers(prev => prev.map(user =>
            user.id === userId
                ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
                : user
        ));
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeClass = (role) => {
        const classes = {
            admin: 'role-admin',
            staff: 'role-staff',
            delivery: 'role-delivery',
            customer: 'role-customer'
        };
        return classes[role] || '';
    };

    return (
        <div className="user-management-page">
            {/* Sidebar */}
            <aside className="user-management-sidebar">
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
                    <Link to="/all-orders" className="nav-item">
                        <span>All Orders</span>
                    </Link>
                    <Link to="/generate-report" className="nav-item">
                        <span>Generate Reports</span>
                    </Link>
                    <a href="#settings" className="nav-item">
                        <span>System Settings</span>
                    </a>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="user-management-main">
                <header className="user-management-header">
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

                <div className="user-management-content">
                    {/* Stats Cards */}
                    <section className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-value">{users.length}</span>
                            <span className="stat-label">Total Users</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{users.filter(u => u.role === 'customer').length}</span>
                            <span className="stat-label">Customers</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{users.filter(u => u.role === 'staff').length}</span>
                            <span className="stat-label">Staff</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{users.filter(u => u.status === 'active').length}</span>
                            <span className="stat-label">Active Users</span>
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
                            <button
                                className={`filter-tab ${filterRole === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterRole('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-tab ${filterRole === 'customer' ? 'active' : ''}`}
                                onClick={() => setFilterRole('customer')}
                            >
                                Customers
                            </button>
                            <button
                                className={`filter-tab ${filterRole === 'staff' ? 'active' : ''}`}
                                onClick={() => setFilterRole('staff')}
                            >
                                Staff
                            </button>
                            <button
                                className={`filter-tab ${filterRole === 'delivery' ? 'active' : ''}`}
                                onClick={() => setFilterRole('delivery')}
                            >
                                Delivery
                            </button>
                            <button
                                className={`filter-tab ${filterRole === 'admin' ? 'active' : ''}`}
                                onClick={() => setFilterRole('admin')}
                            >
                                Admin
                            </button>
                        </div>
                    </section>

                    {/* Users Table */}
                    <section className="users-table-section">
                        <div className="table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Join Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>{user.joinDate}</td>
                                            <td className="actions-cell">
                                                <button
                                                    className="btn-action btn-edit"
                                                    onClick={() => alert(`Edit user ${user.name}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn-action btn-toggle"
                                                    onClick={() => handleToggleStatus(user.id)}
                                                >
                                                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    className="btn-action btn-delete"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="no-users">
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
