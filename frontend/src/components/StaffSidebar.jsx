import { Link, useNavigate } from 'react-router-dom';
import '../pages/StaffDashboard.css';

const StaffSidebar = ({ activePage }) => {
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
                <Link to="/staff-dashboard" className={`nav-item ${activePage === 'overview' ? 'active' : ''}`}>
                    <span>Overview</span>
                </Link>
                <Link to="/staff/tasks" className={`nav-item ${activePage === 'tasks' ? 'active' : ''}`}>
                    <span>All Tasks</span>
                </Link>
                <Link to="/staff/pos" className={`nav-item ${activePage === 'pos' ? 'active' : ''}`}>
                    <span>Point of Sale</span>
                </Link>

                <a href="#profile" className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}>
                    <span>Profile</span>
                </a>
            </nav>

            <button className="logout-btn" onClick={handleLogout}>
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default StaffSidebar;
