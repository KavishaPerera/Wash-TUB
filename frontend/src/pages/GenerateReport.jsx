import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';
import './AdminDashboard.css';
import './GenerateReport.css';

const REPORT_TYPES = [
    {
        id: 'daily-sales',
        label: 'Daily Sales Summary',
        icon: '📊',
        desc: 'Total orders, revenue, and status breakdown for a single day.',
        color: 'blue',
        dateMode: 'single',
    },
    {
        id: 'service-popularity',
        label: 'Service Popularity',
        icon: '⭐',
        desc: 'Most ordered services ranked by count and revenue.',
        color: 'amber',
        dateMode: 'range',
    },
    {
        id: 'monthly-sales',
        label: 'Monthly Sales',
        icon: '📅',
        desc: 'Month-by-month revenue and order volume for a selected year.',
        color: 'green',
        dateMode: 'month-year',
    },
    {
        id: 'payment-method',
        label: 'Payment Method',
        icon: '💳',
        desc: 'Breakdown of Cash, Card, and Online payments by count and total.',
        color: 'purple',
        dateMode: 'range',
    },
    {
        id: 'top-customers',
        label: 'Top Customers',
        icon: '👑',
        desc: 'Top 10 customers ranked by total spend and order count.',
        color: 'rose',
        dateMode: 'range',
    },
];

const MOCK_DATA = {
    'daily-sales': {
        stats: [
            { label: 'Total Orders', value: '12' },
            { label: 'Total Revenue', value: 'LKR 48,500' },
            { label: 'Avg Order Value', value: 'LKR 4,042' },
            { label: 'Delivery Orders', value: '7' },
        ],
        columns: ['Status', 'Count', 'Revenue'],
        rows: [
            ['Delivered', '5', 'LKR 22,500'],
            ['Processing', '3', 'LKR 14,000'],
            ['Pending', '2', 'LKR 8,000'],
            ['Cancelled', '2', 'LKR 4,000'],
        ],
    },
    'service-popularity': {
        stats: [
            { label: 'Total Services', value: '4' },
            { label: 'Total Orders', value: '222' },
            { label: 'Total Revenue', value: 'LKR 99,200' },
            { label: 'Top Service', value: 'Wash & Fold' },
        ],
        columns: ['Rank', 'Service', 'Orders', 'Revenue'],
        rows: [
            ['1', 'Wash & Fold', '87', 'LKR 34,800'],
            ['2', 'Ironing', '62', 'LKR 15,500'],
            ['3', 'Dry Cleaning', '45', 'LKR 40,500'],
            ['4', 'Laundry Bag', '28', 'LKR 8,400'],
        ],
    },
    'monthly-sales': {
        stats: [
            { label: 'Year', value: '2026' },
            { label: 'Total Revenue', value: 'LKR 3,12,000' },
            { label: 'Total Orders', value: '384' },
            { label: 'Best Month', value: 'March' },
        ],
        columns: ['Month', 'Orders', 'Revenue', 'Avg Order'],
        rows: [
            ['January', '112', 'LKR 87,500', 'LKR 781'],
            ['February', '98', 'LKR 79,000', 'LKR 806'],
            ['March', '174', 'LKR 1,45,500', 'LKR 836'],
        ],
    },
    'payment-method': {
        stats: [
            { label: 'Total Transactions', value: '128' },
            { label: 'Total Collected', value: 'LKR 1,88,500' },
            { label: 'Top Method', value: 'Cash' },
            { label: 'Online Share', value: '15%' },
        ],
        columns: ['Method', 'Transactions', 'Total Amount', 'Share'],
        rows: [
            ['Cash', '58', 'LKR 72,000', '45%'],
            ['Card', '51', 'LKR 88,500', '40%'],
            ['Online', '19', 'LKR 28,000', '15%'],
        ],
    },
    'top-customers': {
        stats: [
            { label: 'Total Customers', value: '10' },
            { label: 'Combined Spend', value: 'LKR 2,56,800' },
            { label: 'Avg Orders', value: '14.2' },
            { label: 'Top Spender', value: 'Amandi Perera' },
        ],
        columns: ['Rank', 'Customer', 'Email', 'Orders', 'Total Spend'],
        rows: [
            ['1', 'Amandi Perera', 'amandi@email.com', '22', 'LKR 45,200'],
            ['2', 'Kamal Silva', 'kamal@email.com', '19', 'LKR 38,700'],
            ['3', 'Nimal Fernando', 'nimal@email.com', '17', 'LKR 32,500'],
            ['4', 'Sanduni Jayawardena', 'sanduni@email.com', '15', 'LKR 28,900'],
            ['5', 'Priya Wijesinghe', 'priya@email.com', '14', 'LKR 27,100'],
            ['6', 'Roshan Dissanayake', 'roshan@email.com', '13', 'LKR 24,800'],
            ['7', 'Chamari Rathnayake', 'chamari@email.com', '12', 'LKR 22,300'],
            ['8', 'Dilshan Madusanka', 'dilshan@email.com', '11', 'LKR 20,500'],
            ['9', 'Fathima Hameed', 'fathima@email.com', '10', 'LKR 18,600'],
            ['10', 'Janitha Perera', 'janitha@email.com', '9', 'LKR 18,200'],
        ],
    },
};

const GenerateReport = () => {
    const navigate = useNavigate();
    const [selectedReport, setSelectedReport] = useState('daily-sales');
    const [singleDate, setSingleDate] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [generatedReports, setGeneratedReports] = useState([
        { id: 1, name: 'Daily_Sales_Mar_14_2026.html', type: 'Daily Sales Summary', date: 'Mar 14, 2026', size: '1.2 MB' },
        { id: 2, name: 'Service_Popularity_Q1_2026.html', type: 'Service Popularity', date: 'Mar 01, 2026', size: '0.8 MB' },
        { id: 3, name: 'Monthly_Sales_2026.html', type: 'Monthly Sales', date: 'Feb 28, 2026', size: '1.5 MB' },
    ]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/signin');
    };

    const currentType = REPORT_TYPES.find(r => r.id === selectedReport);

    const handleGenerateReport = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setReportData(MOCK_DATA[selectedReport]);

            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const fileName = `${currentType.label.replace(/\s+/g, '_')}_${now.toISOString().slice(0, 10)}.html`;
            const newReport = {
                id: Date.now(),
                name: fileName,
                type: currentType.label,
                date: dateStr,
                size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
            };
            setGeneratedReports(prev => [newReport, ...prev]);

            setTimeout(() => {
                document.getElementById('report-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }, 1400);
    };

    const buildHtmlReport = (report) => {
        const data = MOCK_DATA[report.type.replace(/\s+/g, '-').toLowerCase()] || MOCK_DATA['daily-sales'];
        const statsHtml = data.stats.map(s =>
            `<div class="stat"><span class="stat-label">${s.label}</span><span class="stat-value">${s.value}</span></div>`
        ).join('');
        const theadHtml = data.columns.map(c => `<th>${c}</th>`).join('');
        const tbodyHtml = data.rows.map(row =>
            `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
        ).join('');

        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${report.name}</title>
  <style>
    body { font-family: Inter, sans-serif; padding: 2.5rem; color: #1e293b; background: #f8fafc; }
    .header { background: #0284c7; color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; }
    .header h1 { margin: 0 0 0.5rem 0; font-size: 1.5rem; }
    .header p { margin: 0; opacity: 0.85; font-size: 0.9rem; }
    .stats-row { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .stat { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem 1.5rem; flex: 1; min-width: 140px; }
    .stat-label { display: block; font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.4rem; }
    .stat-value { display: block; font-size: 1.4rem; font-weight: 700; color: #0f172a; }
    .table-section { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; }
    .table-section h2 { margin: 0 0 1.25rem 0; font-size: 1rem; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8fafc; padding: 0.75rem 1rem; text-align: left; font-size: 0.78rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #e2e8f0; }
    td { padding: 0.85rem 1rem; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #1e293b; }
    tr:last-child td { border-bottom: none; }
    .footer { margin-top: 2rem; font-size: 0.8rem; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${report.type}</h1>
    <p>Generated: ${report.date} &nbsp;|&nbsp; WashTub Laundry Management System</p>
  </div>
  <div class="stats-row">${statsHtml}</div>
  <div class="table-section">
    <h2>Detailed Breakdown</h2>
    <table>
      <thead><tr>${theadHtml}</tr></thead>
      <tbody>${tbodyHtml}</tbody>
    </table>
  </div>
  <div class="footer">Generated by WashTub Laundry System &mdash; ${new Date().toLocaleString()}</div>
</body>
</html>`;
    };

    const handleDownloadReport = (report) => {
        const html = buildHtmlReport(report);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = report.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const renderDateControls = () => {
        if (!currentType) return null;

        if (currentType.dateMode === 'single') {
            return (
                <div className="date-range-section">
                    <h3>Select Date</h3>
                    <div className="date-inputs" style={{ gridTemplateColumns: '1fr', maxWidth: '240px' }}>
                        <div className="form-group">
                            <label>Date</label>
                            <input type="date" value={singleDate} onChange={e => setSingleDate(e.target.value)} />
                        </div>
                    </div>
                </div>
            );
        }

        if (currentType.dateMode === 'month-year') {
            const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
            return (
                <div className="date-range-section">
                    <h3>Select Period</h3>
                    <div className="date-inputs">
                        <div className="form-group">
                            <label>Month (optional)</label>
                            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                                <option value="">All months</option>
                                {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Year</label>
                            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="date-range-section">
                <h3>Select Date Range</h3>
                <div className="date-inputs">
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input type="date" value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/admin-dashboard" className="nav-item"><span>Overview</span></Link>
                    <Link to="/user-management" className="nav-item"><span>User Management</span></Link>
                    <Link to="/service-management" className="nav-item"><span>Service Management</span></Link>
                    <Link to="/all-orders" className="nav-item"><span>All Orders</span></Link>
                    <Link to="/payment" className="nav-item"><span>Payment</span></Link>
                    <a href="#" className="nav-item active"><span>Generate Reports</span></a>
                    <Link to="/system-settings" className="nav-item"><span>System Settings</span></Link>
                </nav>
                <button className="logout-btn" onClick={handleLogout}><span>Logout</span></button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>Generate Reports</h1>
                            <p>Create and download detailed business reports</p>
                        </div>
                        <div className="header-right">
                            <button
                                className="btn btn-primary"
                                onClick={() => document.getElementById('report-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.4rem', fontSize: '0.95rem', borderRadius: '10px' }}
                            >
                                <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span> New Report
                            </button>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content report-content">
                    {/* Report Generator */}
                    <section id="report-form-section" className="dashboard-form-section">
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.25rem 0' }}>Select Report Type</h2>

                        <div className="report-types">
                            {REPORT_TYPES.map(rt => (
                                <label
                                    key={rt.id}
                                    className={`report-type-card card-${rt.color} ${selectedReport === rt.id ? 'selected' : ''}`}
                                    onClick={() => { setSelectedReport(rt.id); setReportData(null); }}
                                >
                                    <input type="radio" name="reportType" value={rt.id} onChange={() => {}} checked={selectedReport === rt.id} />
                                    <span className="type-icon-wrap"><span className="type-icon">{rt.icon}</span></span>
                                    <span className="type-label">{rt.label}</span>
                                    <span className="type-desc">{rt.desc}</span>
                                </label>
                            ))}
                        </div>

                        {renderDateControls()}

                        <div className="form-actions">
                            <button
                                className="btn btn-primary btn-large"
                                onClick={handleGenerateReport}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <><span className="spinner"></span> Generating...</>
                                ) : (
                                    `Generate ${currentType?.label}`
                                )}
                            </button>
                        </div>
                    </section>

                    {/* Inline Report Preview */}
                    {reportData && (
                        <section id="report-preview" className="dashboard-form-section report-preview-section">
                            <div className="preview-header">
                                <div>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                                        {currentType?.icon} {currentType?.label}
                                    </h2>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                                        Preview — mock data shown. Connect backend API to display live data.
                                    </p>
                                </div>
                                <button
                                    className="btn-action btn-download"
                                    onClick={() => handleDownloadReport({
                                        name: `${currentType.label.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.html`,
                                        type: currentType.label,
                                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                    })}
                                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
                                >
                                    Download HTML
                                </button>
                            </div>

                            <div className="preview-stats-row">
                                {reportData.stats.map(s => (
                                    <div key={s.label} className="preview-stat-card">
                                        <span className="preview-stat-label">{s.label}</span>
                                        <span className="preview-stat-value">{s.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="preview-table-wrapper">
                                <table className="preview-table">
                                    <thead>
                                        <tr>{reportData.columns.map(c => <th key={c}>{c}</th>)}</tr>
                                    </thead>
                                    <tbody>
                                        {reportData.rows.map((row, i) => (
                                            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Recent Reports */}
                    <section className="dashboard-table-section" style={{ padding: '2rem' }}>
                        <div className="section-header">
                            <h2>Recent Reports</h2>
                            <span className="reports-count">{generatedReports.length} Files</span>
                        </div>

                        <div className="reports-list">
                            {generatedReports.map(report => (
                                <div key={report.id} className="report-item">
                                    <div className="report-icon">📄</div>
                                    <div className="report-info">
                                        <h4>{report.name}</h4>
                                        <p>{report.type} &bull; {report.date} &bull; {report.size}</p>
                                    </div>
                                    <div className="report-actions">
                                        <button className="btn-action btn-download" onClick={() => handleDownloadReport(report)}>
                                            Download HTML
                                        </button>
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
