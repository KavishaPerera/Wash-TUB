import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';
import './AdminDashboard.css';
import './ServiceManagement.css';

const ServiceManagement = () => {
    const navigate = useNavigate();
    
    const [services, setServices] = useState([
        { id: 'SRV-001', name: 'T-Shirt', category: 'Wash & Dry', price: 150 },
        { id: 'SRV-002', name: 'Trousers', category: 'Wash & Dry', price: 200 },
        { id: 'SRV-003', name: 'Suit', category: 'Dry Cleaning', price: 1500 },
        { id: 'SRV-004', name: 'Dress', category: 'Dry Cleaning', price: 1200 },
        { id: 'SRV-005', name: 'Shirt', category: 'Ironing', price: 100 },
        { id: 'SRV-006', name: 'Bed Sheet', category: 'Pressing', price: 300 },
    ]);

    const [newItem, setNewItem] = useState({
        name: '',
        category: 'Wash & Dry',
        price: ''
    });

    const handleLogout = () => {
        navigate('/signin');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) {
            alert('Please fill in all fields');
            return;
        }

        const newService = {
            id: `SRV-00${services.length + 1}`,
            name: newItem.name,
            category: newItem.category,
            price: parseFloat(newItem.price)
        };

        setServices([...services, newService]);
        setNewItem({ name: '', category: 'Wash & Dry', price: '' });
    };

    const handleDeleteItem = (id) => {
        if (window.confirm('Are you sure you want to delete this service item?')) {
            setServices(services.filter(service => service.id !== id));
        }
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
                    <Link to="/user-management" className="nav-item">
                        <span>User Management</span>
                    </Link>
                    <Link to="/service-management" className="nav-item active">
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
                            <h1>Service Management</h1>
                            <p>Manage laundry services and pricing</p>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    <div className="service-management-container">
                        {/* Add New Item Form */}
                        <section className="add-service-section">
                            <h2>Add New Service Item</h2>
                            <form className="add-service-form" onSubmit={handleAddItem}>
                                <div className="form-group">
                                    <label>Item Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={newItem.name} 
                                        onChange={handleInputChange} 
                                        placeholder="e.g. T-Shirt, Blanket"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select 
                                        name="category" 
                                        value={newItem.category} 
                                        onChange={handleInputChange}
                                    >
                                        <option value="Wash & Dry">Wash & Dry</option>
                                        <option value="Dry Cleaning">Dry Cleaning</option>
                                        <option value="Ironing">Ironing</option>
                                        <option value="Pressing">Pressing</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Price (Rs.)</label>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        value={newItem.price} 
                                        onChange={handleInputChange} 
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required 
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">Add Item</button>
                                </div>
                            </form>
                        </section>

                        {/* Services List */}
                        <section className="services-list-section">
                            <h2>Current Services</h2>
                            <div className="table-container">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Item Name</th>
                                            <th>Category</th>
                                            <th>Price (Rs.)</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.map(service => (
                                            <tr key={service.id}>
                                                <td>{service.id}</td>
                                                <td>{service.name}</td>
                                                <td>
                                                    <span className={`category-badge ${service.category.replace(/\s+/g, '-').replace('&', 'and').toLowerCase()}`}>
                                                        {service.category}
                                                    </span>
                                                </td>
                                                <td>Rs. {service.price.toFixed(2)}</td>
                                                <td>
                                                    <button 
                                                        className="btn-delete" 
                                                        onClick={() => handleDeleteItem(service.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {services.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center">No services found. Add some items above.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ServiceManagement;
