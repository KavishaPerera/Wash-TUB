import { Link, useNavigate } from 'react-router-dom';
import '../pages/DeliveryDashboard.css';

const DeliverySidebar = ({ activePage }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/signin');
    };

    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
                <h2 className="logo">WashTub</h2>
            </div>

            <nav className="sidebar-nav">
                <Link to="/delivery-dashboard" className={`nav-item ${activePage === 'overview' ? 'active' : ''}`}>
                    <span>Overview</span>
                </Link>
                <Link to="/active-deliveries" className={`nav-item ${activePage === 'active' ? 'active' : ''}`}>
                    <span>Active Deliveries</span>
                </Link>
                <Link to="/delivery-profile" className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}>
                    <span>Profile</span>
                </Link>
            </nav>

            <button className="logout-btn" onClick={handleLogout}>
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default DeliverySidebar;
