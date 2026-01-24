import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GenerateReport.css';

const GenerateReport = () => {
    const navigate = useNavigate();
    const [reportType, setReportType] = useState('');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedReports, setGeneratedReports] = useState([
        { id: 'RPT-001', name: 'Monthly Revenue Report', type: 'revenue', date: 'Jan 15, 2026', status: 'completed' },
        { id: 'RPT-002', name: 'User Activity Report', type: 'users', date: 'Jan 10, 2026', status: 'completed' },
        { id: 'RPT-003', name: 'Order Statistics', type: 'orders', date: 'Jan 05, 2026', status: 'completed' },
    ]);

    const reportTypes = [
        { value: 'revenue', label: 'Revenue Report', description: 'Financial summary including income, expenses, and profit margins' },
        { value: 'orders', label: 'Orders Report', description: 'Order statistics, completion rates, and service breakdown' },
        { value: 'users', label: 'User Activity Report', description: 'Customer registrations, active users, and retention metrics' },
        { value: 'staff', label: 'Staff Performance', description: 'Staff productivity, orders processed, and performance metrics' },
        { value: 'services', label: 'Services Report', description: 'Popular services, usage trends, and pricing analysis' },
    ];

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGenerateReport = (e) => {
        e.preventDefault();
        if (!reportType || !dateRange.startDate || !dateRange.endDate) {
            alert('Please fill all fields');
            return;
        }

        setIsGenerating(true);

        // Simulate report generation
        setTimeout(() => {
            const newReport = {
                id: `RPT-${String(generatedReports.length + 1).padStart(3, '0')}`,
                name: reportTypes.find(r => r.value === reportType)?.label || 'Report',
                type: reportType,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'completed'
            };
            setGeneratedReports(prev => [newReport, ...prev]);
            setIsGenerating(false);
            setReportType('');
            setDateRange({ startDate: '', endDate: '' });
            alert('Report generated successfully!');
        }, 2000);
    };

    const handleLogout = () => {
        navigate('/signin');
    };

    const getTypeIcon = (type) => {
        return '';
    };

    return (
        <div className="report-page">
            {/* Sidebar */}
            <aside className="report-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin-dashboard" className="nav-item">
                        <span>Overview</span>
                    </Link>
                    <a href="#users" className="nav-item">
                        <span>User Management</span>
                    </a>
                    <a href="#orders" className="nav-item">
                        <span>All Orders</span>
                    </a>
                    <a href="#" className="nav-item active">
                        <span>Generate Reports</span>
                    </a>
                    <a href="#settings" className="nav-item">
                        <span>System Settings</span>
                    </a>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="report-main">
                <header className="report-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>Generate Reports</h1>
                            <p>Create and manage system reports</p>
                        </div>
                    </div>
                </header>

                <div className="report-content">
                    {/* Report Generator */}
                    <section className="generator-section">
                        <h2>Create New Report</h2>
                        <form onSubmit={handleGenerateReport}>
                            {/* Report Type Selection */}
                            <div className="report-types">
                                {reportTypes.map(type => (
                                    <label
                                        key={type.value}
                                        className={`report-type-card ${reportType === type.value ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="reportType"
                                            value={type.value}
                                            checked={reportType === type.value}
                                            onChange={(e) => setReportType(e.target.value)}
                                        />
                                        <span className="type-label">{type.label}</span>
                                        <span className="type-desc">{type.description}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Date Range */}
                            <div className="date-range-section">
                                <h3>Select Date Range</h3>
                                <div className="date-inputs">
                                    <div className="form-group">
                                        <label htmlFor="startDate">Start Date</label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            value={dateRange.startDate}
                                            onChange={handleDateChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="endDate">End Date</label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            name="endDate"
                                            value={dateRange.endDate}
                                            onChange={handleDateChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Generate Button */}
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-large"
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="spinner"></span>
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Report'
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Previous Reports */}
                    <section className="reports-list-section">
                        <div className="section-header">
                            <h2>Generated Reports</h2>
                            <span className="reports-count">{generatedReports.length} reports</span>
                        </div>

                        <div className="reports-list">
                            {generatedReports.map(report => (
                                <div key={report.id} className="report-item">
                                    <div className="report-icon">
                                        <span className="icon-placeholder"></span>
                                    </div>
                                    <div className="report-info">
                                        <h4>{report.name}</h4>
                                        <p>Generated on {report.date}</p>
                                    </div>
                                    <div className="report-actions">
                                        <button className="btn-action btn-download">Download</button>
                                        <button className="btn-action btn-view">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                </div>
            </main>
        </div>
    );
};

export default GenerateReport;
