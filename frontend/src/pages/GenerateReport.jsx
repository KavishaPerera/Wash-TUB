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

        // Generate and print the report
        setTimeout(() => {
            const reportName = reportTypes.find(r => r.value === reportType)?.label || 'Report';
            const startDateFormatted = new Date(dateRange.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            const endDateFormatted = new Date(dateRange.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

            // Create print window with report content
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${reportName} - WashTub</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                        .header { text-align: center; border-bottom: 2px solid #0077cc; padding-bottom: 20px; margin-bottom: 30px; }
                        .logo { font-size: 28px; font-weight: bold; color: #0077cc; }
                        .report-title { font-size: 24px; margin-top: 10px; }
                        .date-range { color: #666; margin-top: 10px; }
                        .section { margin-bottom: 30px; }
                        .section-title { font-size: 18px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                        th { background-color: #f5f5f5; font-weight: bold; }
                        .summary-box { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px; }
                        .summary-item { display: inline-block; margin-right: 40px; }
                        .summary-value { font-size: 24px; font-weight: bold; color: #0077cc; }
                        .summary-label { color: #666; }
                        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
                        @media print { body { padding: 20px; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">WashTub</div>
                        <h1 class="report-title">${reportName}</h1>
                        <p class="date-range">Report Period: ${startDateFormatted} - ${endDateFormatted}</p>
                        <p class="date-range">Generated on: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    <div class="section">
                        <h2 class="section-title">Summary</h2>
                        <div class="summary-box">
                            <div class="summary-item">
                                <div class="summary-value">${reportType === 'revenue' ? 'Rs. 125,000' : reportType === 'orders' ? '156' : reportType === 'users' ? '1,250' : reportType === 'staff' ? '12' : '8'}</div>
                                <div class="summary-label">${reportType === 'revenue' ? 'Total Revenue' : reportType === 'orders' ? 'Total Orders' : reportType === 'users' ? 'Total Users' : reportType === 'staff' ? 'Active Staff' : 'Services'}</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-value">${reportType === 'revenue' ? '+15%' : reportType === 'orders' ? '94%' : reportType === 'users' ? '+23%' : reportType === 'staff' ? '96%' : '+12%'}</div>
                                <div class="summary-label">${reportType === 'revenue' ? 'Growth' : reportType === 'orders' ? 'Completion Rate' : reportType === 'users' ? 'Growth' : reportType === 'staff' ? 'Efficiency' : 'Usage Growth'}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h2 class="section-title">Detailed Breakdown</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>${reportType === 'revenue' ? 'Category' : reportType === 'orders' ? 'Order ID' : reportType === 'users' ? 'User' : reportType === 'staff' ? 'Staff Name' : 'Service'}</th>
                                    <th>${reportType === 'revenue' ? 'Amount' : reportType === 'orders' ? 'Service' : reportType === 'users' ? 'Joined Date' : reportType === 'staff' ? 'Orders Processed' : 'Orders'}</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>1</td><td>${reportType === 'revenue' ? 'Wash & Fold' : reportType === 'orders' ? 'ORD-1234' : reportType === 'users' ? 'Amandi Perera' : reportType === 'staff' ? 'Kasun Silva' : 'Wash & Fold'}</td><td>${reportType === 'revenue' ? 'Rs. 45,000' : reportType === 'orders' ? 'Wash & Fold' : reportType === 'users' ? 'Jan 15, 2026' : reportType === 'staff' ? '45' : '156'}</td><td>Active</td></tr>
                                <tr><td>2</td><td>${reportType === 'revenue' ? 'Dry Cleaning' : reportType === 'orders' ? 'ORD-1235' : reportType === 'users' ? 'Bandu Perera' : reportType === 'staff' ? 'Nilantha Pieris' : 'Dry Cleaning'}</td><td>${reportType === 'revenue' ? 'Rs. 38,000' : reportType === 'orders' ? 'Dry Cleaning' : reportType === 'users' ? 'Jan 14, 2026' : reportType === 'staff' ? '38' : '89'}</td><td>Active</td></tr>
                                <tr><td>3</td><td>${reportType === 'revenue' ? 'Iron & Press' : reportType === 'orders' ? 'ORD-1236' : reportType === 'users' ? 'Supun Pinto' : reportType === 'staff' ? 'Supun Mendis' : 'Iron & Press'}</td><td>${reportType === 'revenue' ? 'Rs. 22,000' : reportType === 'orders' ? 'Iron & Press' : reportType === 'users' ? 'Jan 12, 2026' : reportType === 'staff' ? '32' : '67'}</td><td>Active</td></tr>
                                <tr><td>4</td><td>${reportType === 'revenue' ? 'Premium Care' : reportType === 'orders' ? 'ORD-1237' : reportType === 'users' ? 'Nimal Fernando' : reportType === 'staff' ? 'Ruwan Jayasena' : 'Premium Care'}</td><td>${reportType === 'revenue' ? 'Rs. 20,000' : reportType === 'orders' ? 'Premium Care' : reportType === 'users' ? 'Jan 10, 2026' : reportType === 'staff' ? '28' : '34'}</td><td>Active</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="footer">
                        <p>This report was generated by WashTub Management System</p>
                        <p>© 2026 WashTub. All rights reserved.</p>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();

            // Add to generated reports list
            const newReport = {
                id: `RPT-${String(generatedReports.length + 1).padStart(3, '0')}`,
                name: reportName,
                type: reportType,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'completed'
            };
            setGeneratedReports(prev => [newReport, ...prev]);
            setIsGenerating(false);
            setReportType('');
            setDateRange({ startDate: '', endDate: '' });
        }, 1000);
    };

    const handleLogout = () => {
        navigate('/signin');
    };

    const handleDownloadReport = (report) => {
        // Generate report content based on type
        let servicesSection = '';
        if (report.type === 'services') {
            servicesSection = `
    <div class="section">
        <h2 class="section-title">Service Details</h2>
        
        <div class="service-card">
            <h3>Wash & Fold</h3>
            <p><strong>Description:</strong> Complete washing and folding service for everyday clothes</p>
            <p><strong>Price:</strong> Rs. 50 per kg</p>
            <p><strong>Processing Time:</strong> 24-48 hours</p>
            <p><strong>Total Orders:</strong> 156</p>
            <p><strong>Revenue Generated:</strong> Rs. 45,000</p>
            <p><strong>Status:</strong> <span style="color: green;">Active</span></p>
        </div>
        
        <div class="service-card">
            <h3>Dry Cleaning</h3>
            <p><strong>Description:</strong> Professional dry cleaning for delicate fabrics and formal wear</p>
            <p><strong>Price:</strong> Rs. 150 per item</p>
            <p><strong>Processing Time:</strong> 48-72 hours</p>
            <p><strong>Total Orders:</strong> 89</p>
            <p><strong>Revenue Generated:</strong> Rs. 38,000</p>
            <p><strong>Status:</strong> <span style="color: green;">Active</span></p>
        </div>
        
        <div class="service-card">
            <h3>Iron & Press</h3>
            <p><strong>Description:</strong> Professional ironing and pressing service</p>
            <p><strong>Price:</strong> Rs. 30 per item</p>
            <p><strong>Processing Time:</strong> 12-24 hours</p>
            <p><strong>Total Orders:</strong> 67</p>
            <p><strong>Revenue Generated:</strong> Rs. 22,000</p>
            <p><strong>Status:</strong> <span style="color: green;">Active</span></p>
        </div>
        
        <div class="service-card">
            <h3>Premium Care</h3>
            <p><strong>Description:</strong> Special care for luxury items including silk, wool, and designer wear</p>
            <p><strong>Price:</strong> Rs. 200 per item</p>
            <p><strong>Processing Time:</strong> 72-96 hours</p>
            <p><strong>Total Orders:</strong> 34</p>
            <p><strong>Revenue Generated:</strong> Rs. 20,000</p>
            <p><strong>Status:</strong> <span style="color: green;">Active</span></p>
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">Service Performance Analysis</h2>
        <table>
            <thead>
                <tr>
                    <th>Service</th>
                    <th>Total Orders</th>
                    <th>Revenue</th>
                    <th>Avg. Rating</th>
                    <th>Customer Satisfaction</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Wash & Fold</td><td>156</td><td>Rs. 45,000</td><td>4.8/5</td><td>96%</td></tr>
                <tr><td>Dry Cleaning</td><td>89</td><td>Rs. 38,000</td><td>4.7/5</td><td>94%</td></tr>
                <tr><td>Iron & Press</td><td>67</td><td>Rs. 22,000</td><td>4.6/5</td><td>92%</td></tr>
                <tr><td>Premium Care</td><td>34</td><td>Rs. 20,000</td><td>4.9/5</td><td>98%</td></tr>
            </tbody>
        </table>
    </div>
            `;
        }

        const reportContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${report.name} - WashTub</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #0077cc; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #0077cc; }
        .report-title { font-size: 24px; margin-top: 10px; }
        .date-range { color: #666; margin-top: 10px; }
        .draft-badge { background: #ff9500; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 10px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .summary-box { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .summary-item { display: inline-block; margin-right: 40px; }
        .summary-value { font-size: 24px; font-weight: bold; color: #0077cc; }
        .summary-label { color: #666; }
        .service-card { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #0077cc; }
        .service-card h3 { margin: 0 0 10px 0; color: #0077cc; }
        .service-card p { margin: 5px 0; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">WashTub</div>
        <h1 class="report-title">${report.name}</h1>
        <span class="draft-badge">DRAFT</span>
        <p class="date-range">Report ID: ${report.id}</p>
        <p class="date-range">Generated on: ${report.date}</p>
    </div>

    <div class="section">
        <h2 class="section-title">Summary</h2>
        <div class="summary-box">
            <div class="summary-item">
                <div class="summary-value">${report.type === 'revenue' ? 'Rs. 125,000' : report.type === 'orders' ? '156' : report.type === 'users' ? '1,250' : report.type === 'staff' ? '12' : '4 Services'}</div>
                <div class="summary-label">${report.type === 'revenue' ? 'Total Revenue' : report.type === 'orders' ? 'Total Orders' : report.type === 'users' ? 'Total Users' : report.type === 'staff' ? 'Active Staff' : 'Active Services'}</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">${report.type === 'revenue' ? '+15%' : report.type === 'orders' ? '94%' : report.type === 'users' ? '+23%' : report.type === 'staff' ? '96%' : 'Rs. 125,000'}</div>
                <div class="summary-label">${report.type === 'revenue' ? 'Growth' : report.type === 'orders' ? 'Completion Rate' : report.type === 'users' ? 'Growth' : report.type === 'staff' ? 'Efficiency' : 'Total Revenue'}</div>
            </div>
            ${report.type === 'services' ? `
            <div class="summary-item">
                <div class="summary-value">346</div>
                <div class="summary-label">Total Orders</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">95%</div>
                <div class="summary-label">Avg. Satisfaction</div>
            </div>
            ` : ''}
        </div>
    </div>

    ${report.type === 'services' ? servicesSection : `
    <div class="section">
        <h2 class="section-title">Detailed Breakdown</h2>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>${report.type === 'revenue' ? 'Category' : report.type === 'orders' ? 'Order ID' : report.type === 'users' ? 'User' : 'Staff Name'}</th>
                    <th>${report.type === 'revenue' ? 'Amount' : report.type === 'orders' ? 'Service' : report.type === 'users' ? 'Joined Date' : 'Orders Processed'}</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>1</td><td>${report.type === 'revenue' ? 'Wash & Fold' : report.type === 'orders' ? 'ORD-1234' : report.type === 'users' ? 'Amandi Perera' : 'Kasun Silva'}</td><td>${report.type === 'revenue' ? 'Rs. 45,000' : report.type === 'orders' ? 'Wash & Fold' : report.type === 'users' ? 'Jan 15, 2026' : '45'}</td><td>Active</td></tr>
                <tr><td>2</td><td>${report.type === 'revenue' ? 'Dry Cleaning' : report.type === 'orders' ? 'ORD-1235' : report.type === 'users' ? 'Bandu Perera' : 'Nilantha Pieris'}</td><td>${report.type === 'revenue' ? 'Rs. 38,000' : report.type === 'orders' ? 'Dry Cleaning' : report.type === 'users' ? 'Jan 14, 2026' : '38'}</td><td>Active</td></tr>
                <tr><td>3</td><td>${report.type === 'revenue' ? 'Iron & Press' : report.type === 'orders' ? 'ORD-1236' : report.type === 'users' ? 'Supun Pinto' : 'Supun Mendis'}</td><td>${report.type === 'revenue' ? 'Rs. 22,000' : report.type === 'orders' ? 'Iron & Press' : report.type === 'users' ? 'Jan 12, 2026' : '32'}</td><td>Active</td></tr>
                <tr><td>4</td><td>${report.type === 'revenue' ? 'Premium Care' : report.type === 'orders' ? 'ORD-1237' : report.type === 'users' ? 'Nimal Fernando' : 'Ruwan Jayasena'}</td><td>${report.type === 'revenue' ? 'Rs. 20,000' : report.type === 'orders' ? 'Premium Care' : report.type === 'users' ? 'Jan 10, 2026' : '28'}</td><td>Active</td></tr>
            </tbody>
        </table>
    </div>
    `}

    <div class="footer">
        <p>This is a DRAFT report generated by WashTub Management System</p>
        <p>© 2026 WashTub. All rights reserved.</p>
    </div>
</body>
</html>
        `;

        // Create blob and download
        const blob = new Blob([reportContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.id}_${report.name.replace(/\s+/g, '_')}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
                    <Link to="/user-management" className="nav-item">
                        <span>User Management</span>
                    </Link>
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
                                            Printing...
                                        </>
                                    ) : (
                                        'Print Report'
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
                                    {/*<div className="report-icon">
                                        <span className="icon-placeholder"></span>
                                    </div>*/}
                                    <div className="report-info">
                                        <h4>{report.name}</h4>
                                        <p>Generated on {report.date}</p>
                                    </div>
                                    <div className="report-actions">
                                        <button className="btn-action btn-download" onClick={() => handleDownloadReport(report)}>Download</button>
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
