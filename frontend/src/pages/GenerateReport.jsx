import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import {
    Chart as ChartJS,
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import './CustomerDashboard.css';
import './AdminDashboard.css';
import './GenerateReport.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);

const REPORT_TYPES = [
    {
        id: 'daily-sales',
        label: 'Daily Sales Summary',
        icon: '📊',
        desc: 'Total orders, revenue, and payment breakdown for a single day.',
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
        label: 'Payment Report',
        icon: '💳',
        desc: 'Breakdown of payments by method — revenue, collections, and discounts given.',
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
    {
        id: 'pickup-delivery',
        label: 'Pickup & Delivery',
        icon: '🚚',
        desc: 'Demand patterns, busy time slots, high-demand delivery areas, and daily trends.',
        color: 'teal',
        dateMode: 'range',
    },
    {
        id: 'weekly-performance',
        label: 'Weekly Business Performance',
        icon: '📆',
        desc: 'Order volume and revenue by day of the week. Identify busiest days and plan holidays, promotions, and maintenance.',
        color: 'blue',
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

const REPORT_COLORS = {
    'daily-sales':        '#0284c7',
    'service-popularity': '#d97706',
    'monthly-sales':      '#16a34a',
    'payment-method':     '#7c3aed',
    'top-customers':      '#e11d48',
    'pickup-delivery':    '#0d9488',
    'weekly-performance': '#4f46e5',
};

const buildPdfReport = (reportTypeId, reportLabel, data, dateStr) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = 210;
    const margin = 15;
    const contentW = pageW - margin * 2;
    const accentHex = REPORT_COLORS[reportTypeId] || '#0284c7';

    const hex2rgb = (hex) => [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ];
    const [ar, ag, ab] = hex2rgb(accentHex);

    // ── Header bar ────────────────────────────────────────────
    doc.setFillColor(ar, ag, ab);
    doc.rect(0, 0, pageW, 36, 'F');

    const lighter = [Math.min(ar + 40, 255), Math.min(ag + 40, 255), Math.min(ab + 40, 255)];
    doc.setFillColor(...lighter);
    doc.rect(0, 0, pageW, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('WashTub', margin, 14);

    doc.setFontSize(16);
    doc.text(reportLabel, margin, 25);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Generated: ${dateStr}`, margin, 32);
    doc.text('Laundry Management System', pageW - margin, 32, { align: 'right' });

    let y = 48;

    // ── Summary stat boxes ────────────────────────────────────
    const statCount = data.stats.length;
    const statGap = 4;
    const statW = (contentW - statGap * (statCount - 1)) / statCount;

    data.stats.forEach((stat, i) => {
        const x = margin + i * (statW + statGap);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(x, y, statW, 20, 2, 2, 'FD');

        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.text(stat.label.toUpperCase(), x + statW / 2, y + 7, { align: 'center' });

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.text(String(stat.value), x + statW / 2, y + 15, { align: 'center' });
    });

    y += 30;

    // ── Section label ─────────────────────────────────────────
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Detailed Breakdown', margin, y);
    y += 7;

    // ── Table ─────────────────────────────────────────────────
    const cols = data.columns;
    const rows = data.rows;
    const colW = contentW / cols.length;
    const rowH = 9;
    const headerH = 10;

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentW, headerH, 'FD');

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    cols.forEach((col, ci) => {
        doc.text(col.toUpperCase(), margin + ci * colW + 3, y + 7);
    });
    y += headerH;

    rows.forEach((row, ri) => {
        doc.setFillColor(...(ri % 2 === 0 ? [255, 255, 255] : [248, 250, 252]));
        doc.setDrawColor(241, 245, 249);
        doc.rect(margin, y, contentW, rowH, 'FD');

        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        row.forEach((cell, ci) => {
            doc.text(String(cell), margin + ci * colW + 3, y + 6);
        });
        y += rowH;
    });

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentW, y);

    // ── Insights (pickup-delivery / monthly-sales / payment-method / top-customers) ─────────────
    if (data.insights) {
        const ins = data.insights;
        y += 14;
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('Insights', margin, y);
        y += 7;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);

        if (ins.peakTimeSlot !== undefined) {
            // Pickup & Delivery insights
            doc.text(`Peak Pickup Time: ${ins.peakTimeSlot}  |  Pickup Share: ${ins.pickupShare}%`, margin, y);
            y += 6;
            doc.text(`Top Delivery Area: ${ins.topDeliveryArea}  |  Home Delivery Orders: ${ins.deliveryCount}`, margin, y);
            y += 6;
            doc.text(`Total Orders in Period: ${ins.totalOrders}`, margin, y);
            y += 10;

            // Delivery areas table
            if (data._areaRows && data._areaRows.length > 0) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(15, 23, 42);
                doc.text('Delivery Areas', margin, y);
                y += 7;

                const areaCols = ['City', 'Orders', 'Revenue (LKR)'];
                const areaColW = contentW / areaCols.length;
                doc.setFillColor(241, 245, 249);
                doc.setDrawColor(226, 232, 240);
                doc.rect(margin, y, contentW, 10, 'FD');
                doc.setTextColor(100, 116, 139);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(7);
                areaCols.forEach((col, ci) => { doc.text(col.toUpperCase(), margin + ci * areaColW + 3, y + 7); });
                y += 10;

                data._areaRows.forEach((row, ri) => {
                    doc.setFillColor(...(ri % 2 === 0 ? [255, 255, 255] : [248, 250, 252]));
                    doc.setDrawColor(241, 245, 249);
                    doc.rect(margin, y, contentW, 9, 'FD');
                    doc.setTextColor(30, 41, 59);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(8);
                    row.forEach((cell, ci) => { doc.text(String(cell), margin + ci * areaColW + 3, y + 6); });
                    y += 9;
                });
            }
        } else if (ins.growthTrend !== undefined) {
            // Monthly sales insights
            const growthSign = ins.avgMomGrowth > 0 ? '+' : '';
            doc.text(`Business Trend: ${ins.growthTrend}  |  Avg MoM Growth: ${growthSign}${ins.avgMomGrowth}%`, margin, y);
            y += 6;
            if (ins.bestMonth)  { doc.text(`Best Month: ${ins.bestMonth.name} — LKR ${Number(ins.bestMonth.revenue).toLocaleString()}`, margin, y); y += 6; }
            if (ins.worstMonth) { doc.text(`Lowest Month: ${ins.worstMonth.name} — LKR ${Number(ins.worstMonth.revenue).toLocaleString()}`, margin, y); y += 6; }
            const seasonalStr = ins.seasonal
                .map(q => `${q.quarter}: ${q.months_with_data > 0 ? 'LKR ' + Math.round(q.avg_revenue).toLocaleString() : 'No data'}`)
                .join('   ');
            doc.text(`Seasonal Avg Revenue — ${seasonalStr}`, margin, y);
        } else if (ins.topSpender !== undefined) {
            // Top customers insights
            doc.text(`VIP Customer: ${ins.topSpender} — LKR ${Number(ins.topSpenderAmount).toLocaleString()}`, margin, y);
            y += 6;
            doc.text(`Most Loyal: ${ins.mostLoyal} — ${ins.mostLoyalOrders} orders in period`, margin, y);
            y += 6;
            doc.text(`Avg Spend / Customer: LKR ${Number(ins.avgSpendPerCustomer).toLocaleString()}  |  Avg Orders: ${ins.avgOrdersPerCustomer}`, margin, y);
        } else if (ins.busiestDay !== undefined) {
            // Weekly performance insights
            doc.text(`Best day for promotions: ${ins.busiestDay}`, margin, y); y += 6;
            doc.text(`Best day for weekly holiday: ${ins.quietestDay}`, margin, y); y += 6;
            doc.text(`Best day for maintenance: ${ins.quietestDay}`, margin, y); y += 6;
            doc.text(`Peak revenue day: ${ins.bestRevenueDay}  |  Avg daily orders: ${ins.avgDailyOrders}`, margin, y);
        } else {
            // Payment report insights
            doc.text(`Preferred Method: ${ins.preferredMethod}  |  Top Revenue Method: ${ins.topRevenueMethod}`, margin, y);
            y += 6;
            doc.text(`Digital Adoption: ${ins.digitalShare}% Digital  |  ${ins.cashShare}% Cash`, margin, y);
            y += 6;
            doc.text(`Total Discounts: LKR ${Number(ins.totalDiscounts).toLocaleString()}  |  Discounted Orders: ${ins.discountedOrders}`, margin, y);
        }
    }

    // ── Footer ────────────────────────────────────────────────
    const footerY = 287;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, footerY - 5, margin + contentW, footerY - 5);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Generated by WashTub Laundry Management System', margin, footerY);
    doc.text(new Date().toLocaleString(), margin + contentW, footerY, { align: 'right' });

    const fileName = `${reportLabel.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
};

const transformServicePopularityData = (apiData) => {
    const { summary, services } = apiData;

    const amberPalette = ['#f59e0b', '#d97706', '#b45309', '#92400e', '#fbbf24', '#fde68a', '#fef3c7', '#78350f'];

    // Group by item_name for Pie and Revenue Bar (sum across methods)
    const revenueByItem = {};
    services.forEach(r => {
        const key = r.item_name;
        revenueByItem[key] = (revenueByItem[key] || 0) + Number(r.total_revenue);
    });
    const revenueEntries = Object.entries(revenueByItem)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    const revenuePie = {
        labels: revenueEntries.map(([name]) => name),
        datasets: [{
            data: revenueEntries.map(([, rev]) => Number(rev.toFixed(2))),
            backgroundColor: amberPalette,
            hoverBackgroundColor: amberPalette,
            borderWidth: 0,
        }],
    };

    const revenueBar = {
        labels: revenueEntries.map(([name]) => name),
        datasets: [{
            label: 'Revenue (LKR)',
            data: revenueEntries.map(([, rev]) => Number(rev.toFixed(2))),
            backgroundColor: revenueEntries.map((_, i) => i === 0 ? '#d97706' : '#fbbf24'),
            borderRadius: 6,
        }],
    };

    // Quantity bar: keep item_name + method granularity, top 10
    const top10 = services.slice(0, 10);
    const quantityBar = {
        labels: top10.map(r => r.method && r.method !== 'N/A' ? `${r.item_name} · ${r.method}` : r.item_name),
        datasets: [{
            label: 'Qty Ordered',
            data: top10.map(r => Number(r.total_quantity)),
            backgroundColor: '#d97706',
            borderRadius: 6,
        }],
    };

    return {
        stats: [
            { label: 'Unique Items',  value: String(summary.uniqueItems) },
            { label: 'Total Qty',     value: String(summary.totalQuantity) },
            { label: 'Total Revenue', value: `LKR ${Number(summary.totalRevenue).toLocaleString()}` },
            { label: 'Top Item',      value: summary.topItem },
        ],
        columns: ['Rank', 'Item', 'Order Type', 'Qty Ordered', 'In Orders', 'Revenue (LKR)', 'Share %'],
        rows: services.map((row, i) => [
            String(i + 1),
            row.item_name,
            row.method,
            String(row.total_quantity),
            String(row.order_count),
            Number(row.total_revenue).toLocaleString(),
            `${row.share}%`,
        ]),
        chartData: { revenuePie, quantityBar, revenueBar },
    };
};

const transformPaymentMethodData = (apiData) => {
    const { summary, payment_data } = apiData;
    return {
        stats: [
            { label: 'Total Transactions', value: String(summary.totalTransactions) },
            { label: 'Total Revenue',       value: `LKR ${Number(summary.totalRevenue).toLocaleString()}` },
            { label: 'Collected',           value: `LKR ${Number(summary.totalCollected).toLocaleString()}` },
            { label: 'Total Discounts',     value: `LKR ${Number(summary.totalDiscounts).toLocaleString()}` },
        ],
        columns: ['Method', 'Transactions', 'Revenue (LKR)', 'Collected (LKR)', 'Discounts (LKR)', 'Share %'],
        rows: payment_data.map(row => [
            row.payment_method.charAt(0).toUpperCase() + row.payment_method.slice(1),
            String(row.transactions),
            Number(row.revenue).toLocaleString(),
            Number(row.collected).toLocaleString(),
            Number(row.total_discounts).toLocaleString(),
            `${row.share}%`,
        ]),
        insights: {
            preferredMethod:  summary.preferredMethod,
            topRevenueMethod: summary.topRevenueMethod,
            cashShare:        summary.cashShare,
            digitalShare:     summary.digitalShare,
            totalPending:     summary.totalPending,
            collectedRate:    summary.collectedRate,
            totalDiscounts:   summary.totalDiscounts,
            discountedOrders: summary.discountedOrders,
        },
    };
};

const transformTopCustomersData = (apiData) => {
    const { summary, customer_data } = apiData;
    return {
        stats: [
            { label: 'Total Customers',        value: String(summary.totalCustomers) },
            { label: 'Combined Spend',         value: `LKR ${Number(summary.combinedSpend).toLocaleString()}` },
            { label: 'Avg Orders / Customer',  value: String(summary.avgOrdersPerCustomer) },
            { label: 'Avg Spend / Customer',   value: `LKR ${Number(summary.avgSpendPerCustomer).toLocaleString()}` },
        ],
        columns: ['Rank', 'Customer', 'Email', 'Orders', 'Total Spend (LKR)', 'Avg Order (LKR)', 'Last Order'],
        rows: customer_data.map(row => [
            String(row.rank),
            row.customer_name,
            row.email,
            String(row.total_orders),
            Number(row.total_spent).toLocaleString(),
            Number(row.avg_order_value).toLocaleString(undefined, { maximumFractionDigits: 0 }),
            row.last_order_date ? new Date(row.last_order_date).toLocaleDateString('en-GB') : '—',
        ]),
        insights: {
            topSpender:           summary.topSpender,
            topSpenderAmount:     summary.topSpenderAmount,
            mostLoyal:            summary.mostLoyal,
            mostLoyalOrders:      summary.mostLoyalOrders,
            avgSpendPerCustomer:  summary.avgSpendPerCustomer,
            avgOrdersPerCustomer: summary.avgOrdersPerCustomer,
        },
    };
};

const transformMonthlySalesData = (apiData) => {
    const { summary, monthly_data, seasonal } = apiData;
    const maxRevenue = monthly_data.length > 0
        ? Math.max(...monthly_data.map(r => Number(r.revenue)))
        : 0;

    const monthLabels = monthly_data.map(r => r.month_name.slice(0, 3));

    const revenueLine = {
        labels: monthLabels,
        datasets: [{
            label: 'Revenue (LKR)',
            data: monthly_data.map(r => Number(r.revenue)),
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22,163,74,0.08)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: monthly_data.map(r =>
                Number(r.revenue) === maxRevenue && maxRevenue > 0 ? '#16a34a' : 'rgba(22,163,74,0.3)'
            ),
            pointRadius: monthly_data.map(r =>
                Number(r.revenue) === maxRevenue && maxRevenue > 0 ? 6 : 3
            ),
            pointBorderColor: '#16a34a',
        }],
    };

    const ordersBar = {
        labels: monthLabels,
        datasets: [{
            label: 'Orders',
            data: monthly_data.map(r => Number(r.orders)),
            backgroundColor: monthly_data.map(r =>
                Number(r.revenue) === maxRevenue && maxRevenue > 0 ? '#16a34a' : '#4ade80'
            ),
            borderRadius: 6,
        }],
    };

    const activeSeasonal = seasonal.filter(q => q.months_with_data > 0);
    const seasonalBar = {
        labels: activeSeasonal.map(q => q.quarter),
        datasets: [{
            label: 'Avg Revenue (LKR)',
            data: activeSeasonal.map(q => Number(q.avg_revenue)),
            backgroundColor: ['#16a34a', '#22c55e', '#4ade80', '#86efac'].slice(0, activeSeasonal.length),
            borderRadius: 6,
        }],
    };

    return {
        stats: [
            { label: 'Year',          value: String(summary.year) },
            { label: 'Total Revenue', value: `LKR ${Number(summary.totalRevenue).toLocaleString()}` },
            { label: 'Total Orders',  value: String(summary.totalOrders) },
            { label: 'Best Month',    value: summary.bestMonth?.name || 'N/A' },
        ],
        columns: ['Month', 'Orders', 'Revenue (LKR)', 'Avg Order Value', 'Completed', 'Cancelled'],
        rows: monthly_data.map(row => [
            row.month_name,
            String(row.orders),
            Number(row.revenue).toLocaleString(),
            `LKR ${Math.round(Number(row.avg_value)).toLocaleString()}`,
            String(row.completed),
            String(row.cancelled),
        ]),
        _raw: monthly_data.map(r => ({
            ...r,
            isBest: Number(r.revenue) === maxRevenue && maxRevenue > 0,
        })),
        insights: {
            growthTrend:  summary.growthTrend,
            avgMomGrowth: summary.avgMomGrowth,
            bestMonth:    summary.bestMonth,
            worstMonth:   summary.worstMonth,
            seasonal,
        },
        chartData: { revenueLine, ordersBar, seasonalBar },
    };
};

const transformPickupDeliveryData = (apiData) => {
    const { summary, type_distribution, time_slots, delivery_areas, daily_trend } = apiData;

    // Pie chart
    const typePieLabels = type_distribution.map(r => r.delivery_option === 'pickup' ? 'Self Pickup' : 'Home Delivery');
    const typePieCounts = type_distribution.map(r => Number(r.order_count));

    // Time slots bar (already sorted DESC from backend)
    const slotLabels = time_slots.map(r => r.time_slot);
    const slotCounts = time_slots.map(r => Number(r.request_count));

    // Delivery areas bar (top 8)
    const areas = delivery_areas.slice(0, 8);

    // Daily trend line — merge by date
    const allDates = [...new Set(daily_trend.map(r => {
        const d = r.order_date;
        return typeof d === 'string' ? d : new Date(d).toISOString().slice(0, 10);
    }))].sort();
    const pickupByDate = {};
    const deliveryByDate = {};
    daily_trend.forEach(r => {
        const d = typeof r.order_date === 'string' ? r.order_date : new Date(r.order_date).toISOString().slice(0, 10);
        if (r.delivery_option === 'pickup') pickupByDate[d] = Number(r.order_count);
        else deliveryByDate[d] = Number(r.order_count);
    });

    return {
        stats: [
            { label: 'Total Orders',   value: String(summary.totalOrders) },
            { label: 'Self Pickup',    value: String(summary.pickupCount) },
            { label: 'Home Delivery',  value: String(summary.deliveryCount) },
            { label: 'Peak Time Slot', value: summary.peakTimeSlot || 'N/A' },
        ],
        insights: {
            peakTimeSlot:    summary.peakTimeSlot || 'N/A',
            topDeliveryArea: summary.topDeliveryArea || 'N/A',
            pickupShare:     summary.pickupShare,
            deliveryCount:   summary.deliveryCount,
            totalOrders:     summary.totalOrders,
        },
        chartData: {
            typePie: {
                labels: typePieLabels,
                datasets: [{ data: typePieCounts, backgroundColor: ['#0284c7', '#0d9488'], hoverBackgroundColor: ['#0369a1', '#0f766e'], borderWidth: 0 }],
            },
            timeBar: {
                labels: slotLabels,
                datasets: [{ label: 'Requests', data: slotCounts, backgroundColor: '#0284c7', borderRadius: 6 }],
            },
            areaBar: {
                labels: areas.map(r => r.city || 'Unknown'),
                datasets: [{ label: 'Delivery Orders', data: areas.map(r => Number(r.order_count)), backgroundColor: '#0d9488', borderRadius: 6 }],
            },
            trendLine: {
                labels: allDates,
                datasets: [
                    { label: 'Self Pickup', data: allDates.map(d => pickupByDate[d] || 0), borderColor: '#0284c7', backgroundColor: 'rgba(2,132,199,0.08)', tension: 0.4, fill: true },
                    { label: 'Home Delivery', data: allDates.map(d => deliveryByDate[d] || 0), borderColor: '#0d9488', backgroundColor: 'rgba(13,148,136,0.08)', tension: 0.4, fill: true },
                ],
            },
        },
        // Table: time slots (shown in preview table)
        columns: ['Time Slot', 'Pickup / Delivery Requests'],
        rows: time_slots.map(r => [r.time_slot, String(r.request_count)]),
        // Used in PDF for a second areas table
        _areaRows: areas.map(r => [r.city || 'Unknown', String(r.order_count), `LKR ${Number(r.total_revenue).toLocaleString()}`]),
    };
};

const transformDailySalesData = (apiData) => {
    const { summary, daily_data } = apiData;
    return {
        stats: [
            { label: 'Total Orders',    value: String(summary.totalOrders) },
            { label: 'Total Revenue',   value: `LKR ${Number(summary.totalRevenue).toLocaleString()}` },
            { label: 'Avg Order Value', value: `LKR ${Math.round(summary.avgOrderValue).toLocaleString()}` },
            { label: 'Completion Rate', value: `${summary.completionRate}%` },
        ],
        columns: ['Date', 'Orders', 'Revenue (LKR)', 'Avg Value', 'Completed', 'Cancelled', 'Note'],
        rows: daily_data.map(row => [
            row.date,
            String(row.orders),
            Number(row.revenue).toLocaleString(),
            `LKR ${Math.round(Number(row.avg_value)).toLocaleString()}`,
            String(row.completed),
            String(row.cancelled),
            row.isBusy ? 'Busy Day' : row.isDrop ? 'Sales Drop' : '',
        ]),
        _raw: daily_data,
    };
};

const transformWeeklyPerformanceData = (apiData) => {
    const { summary, weekly_data } = apiData;
    const dayLabels = weekly_data.map(r => r.day_name.slice(0, 3));

    const ordersBarData = {
        labels: dayLabels,
        datasets: [{
            label: 'Orders',
            data: weekly_data.map(r => r.total_orders),
            backgroundColor: weekly_data.map(r =>
                r.day_name === summary.busiestDay  ? '#4f46e5' :
                r.day_name === summary.quietestDay ? '#94a3b8' : '#818cf8'
            ),
            borderRadius: 6,
        }],
    };

    const revenueBarData = {
        labels: dayLabels,
        datasets: [{
            label: 'Revenue (LKR)',
            data: weekly_data.map(r => r.total_revenue),
            backgroundColor: weekly_data.map(r =>
                r.day_name === summary.bestRevenueDay ? '#4f46e5' : '#818cf8'
            ),
            borderRadius: 6,
        }],
    };

    return {
        stats: [
            { label: 'Total Orders',     value: String(summary.totalOrders) },
            { label: 'Total Revenue',    value: `LKR ${Number(summary.totalRevenue).toLocaleString()}` },
            { label: 'Busiest Day',      value: summary.busiestDay },
            { label: 'Best Revenue Day', value: summary.bestRevenueDay },
        ],
        insights: {
            busiestDay:     summary.busiestDay,
            quietestDay:    summary.quietestDay,
            bestRevenueDay: summary.bestRevenueDay,
            avgDailyOrders: summary.avgDailyOrders,
        },
        chartData: {
            ordersBar:  ordersBarData,
            revenueBar: revenueBarData,
        },
        columns: ['Day', 'Orders', 'Revenue (LKR)', 'Avg Order (LKR)', 'Completed', 'Cancelled', 'Completion %', 'Cancel %', 'Rev Share %', 'Status'],
        rows: weekly_data.map(r => [
            r.day_name,
            String(r.total_orders),
            Number(r.total_revenue).toLocaleString(),
            Number(r.avg_order_value).toLocaleString(undefined, { maximumFractionDigits: 0 }),
            String(r.completed_orders),
            String(r.cancelled_orders),
            `${r.completion_rate}%`,
            `${r.cancellation_rate}%`,
            `${r.revenue_share}%`,
            r.day_name === summary.busiestDay  ? 'Busiest' :
            r.day_name === summary.quietestDay ? 'Quietest' : 'Normal',
        ]),
        _weeklyRaw: weekly_data.map(r => ({
            ...r,
            isBusiest:  r.day_name === summary.busiestDay,
            isQuietest: r.day_name === summary.quietestDay,
        })),
    };
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
        { id: 1, name: 'Daily_Sales_Mar_14_2026.pdf', type: 'Daily Sales Summary', date: 'Mar 14, 2026', size: '0.4 MB' },
        { id: 2, name: 'Service_Popularity_Q1_2026.pdf', type: 'Service Popularity', date: 'Mar 01, 2026', size: '0.3 MB' },
        { id: 3, name: 'Monthly_Sales_2026.pdf', type: 'Monthly Sales', date: 'Feb 28, 2026', size: '0.5 MB' },
    ]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/signin');
    };

    const currentType = REPORT_TYPES.find(r => r.id === selectedReport);

    const handleGenerateReport = async () => {
        if (selectedReport === 'service-popularity') {
            if (!dateRange.start || !dateRange.end) {
                alert('Please select a start date and end date.');
                return;
            }
            setIsGenerating(true);
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const res = await fetch(
                    `http://localhost:5000/api/reports/service-popularity?start_date=${dateRange.start}&end_date=${dateRange.end}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || 'Failed to generate report');

                setReportData(transformServicePopularityData(json));
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const fileName = `Service_Popularity_${dateRange.start}_to_${dateRange.end}.pdf`;
                setGeneratedReports(prev => [{ id: Date.now(), name: fileName, type: currentType.label, date: dateStr, size: '—' }, ...prev]);
                setTimeout(() => { document.getElementById('report-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
            } catch (err) {
                alert(err.message);
            } finally {
                setIsGenerating(false);
            }
            return;
        }

        if (selectedReport === 'payment-method') {
            if (!dateRange.start || !dateRange.end) {
                alert('Please select a start date and end date.');
                return;
            }
            setIsGenerating(true);
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const res = await fetch(
                    `http://localhost:5000/api/reports/payment-method?start_date=${dateRange.start}&end_date=${dateRange.end}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || 'Failed to generate report');

                setReportData(transformPaymentMethodData(json));
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const fileName = `Payment_Report_${dateRange.start}_to_${dateRange.end}.pdf`;
                setGeneratedReports(prev => [{ id: Date.now(), name: fileName, type: currentType.label, date: dateStr, size: '—' }, ...prev]);
                setTimeout(() => { document.getElementById('report-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
            } catch (err) {
                alert(err.message);
            } finally {
                setIsGenerating(false);
            }
            return;
        }

        if (selectedReport === 'top-customers') {
            if (!dateRange.start || !dateRange.end) {
                alert('Please select a start date and end date.');
                return;
            }
            setIsGenerating(true);
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const res = await fetch(
                    `http://localhost:5000/api/reports/top-customers?start_date=${dateRange.start}&end_date=${dateRange.end}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || 'Failed to generate report');

                setReportData(transformTopCustomersData(json));
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const fileName = `Top_Customers_${dateRange.start}_to_${dateRange.end}.pdf`;
                setGeneratedReports(prev => [{ id: Date.now(), name: fileName, type: currentType.label, date: dateStr, size: '—' }, ...prev]);
                setTimeout(() => { document.getElementById('report-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
            } catch (err) {
                alert(err.message);
            } finally {
                setIsGenerating(false);
            }
            return;
        }

        if (selectedReport === 'monthly-sales') {
            if (!selectedYear) {
                alert('Please select a year.');
                return;
            }
            setIsGenerating(true);
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const params = new URLSearchParams({ year: selectedYear });
                if (selectedMonth) params.append('month', selectedMonth);
                const res = await fetch(
                    `http://localhost:5000/api/reports/monthly-sales?${params}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || 'Failed to generate report');

                setReportData(transformMonthlySalesData(json));
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const fileName = `Monthly_Sales_${selectedYear}.pdf`;
                setGeneratedReports(prev => [{ id: Date.now(), name: fileName, type: currentType.label, date: dateStr, size: '—' }, ...prev]);
                setTimeout(() => { document.getElementById('report-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
            } catch (err) {
                alert(err.message);
            } finally {
                setIsGenerating(false);
            }
            return;
        }

        if (selectedReport === 'pickup-delivery') {
            if (!dateRange.start || !dateRange.end) {
                alert('Please select a start date and end date.');
                return;
            }
            setIsGenerating(true);
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const res = await fetch(
                    `http://localhost:5000/api/reports/pickup-delivery?start_date=${dateRange.start}&end_date=${dateRange.end}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || 'Failed to generate report');

                setReportData(transformPickupDeliveryData(json));
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const fileName = `Pickup_Delivery_${dateRange.start}_to_${dateRange.end}.pdf`;
                setGeneratedReports(prev => [{ id: Date.now(), name: fileName, type: currentType.label, date: dateStr, size: '—' }, ...prev]);
                setTimeout(() => { document.getElementById('report-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
            } catch (err) {
                alert(err.message);
            } finally {
                setIsGenerating(false);
            }
            return;
        }

        if (selectedReport === 'weekly-performance') {
            if (!dateRange.start || !dateRange.end) {
                alert('Please select a start date and end date.');
                return;
            }
            setIsGenerating(true);
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const res = await fetch(
                    `http://localhost:5000/api/reports/weekly-performance?start_date=${dateRange.start}&end_date=${dateRange.end}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || 'Failed to generate report');

                setReportData(transformWeeklyPerformanceData(json));
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const fileName = `Weekly_Performance_${dateRange.start}_to_${dateRange.end}.pdf`;
                setGeneratedReports(prev => [{ id: Date.now(), name: fileName, type: currentType.label, date: dateStr, size: '—' }, ...prev]);
                setTimeout(() => { document.getElementById('report-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
            } catch (err) {
                alert(err.message);
            } finally {
                setIsGenerating(false);
            }
            return;
        }

        if (selectedReport !== 'daily-sales') {
            setIsGenerating(true);
            setTimeout(() => {
                setIsGenerating(false);
                setReportData(MOCK_DATA[selectedReport]);
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const fileName = `${currentType.label.replace(/\s+/g, '_')}_${now.toISOString().slice(0, 10)}.pdf`;
                setGeneratedReports(prev => [{ id: Date.now(), name: fileName, type: currentType.label, date: dateStr, size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB` }, ...prev]);
                setTimeout(() => { document.getElementById('report-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
            }, 1400);
            return;
        }

        if (!singleDate) {
            alert('Please select a date.');
            return;
        }

        setIsGenerating(true);
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const res = await fetch(
                `http://localhost:5000/api/reports/daily-sales?start_date=${singleDate}&end_date=${singleDate}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || 'Failed to generate report');

            setReportData(transformDailySalesData(json));
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const fileName = `Daily_Sales_${singleDate}.pdf`;
            setGeneratedReports(prev => [{ id: Date.now(), name: fileName, type: currentType.label, date: dateStr, size: '—' }, ...prev]);
            setTimeout(() => { document.getElementById('report-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
        } catch (err) {
            alert(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadReport = (report) => {
        const typeId = report.type.toLowerCase().replace(/\s+/g, '-');
        const data = MOCK_DATA[typeId] || MOCK_DATA['daily-sales'];
        buildPdfReport(typeId, report.type, data, report.date);
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
                    <Link to="/all-orders" className="nav-item"><span>All Order Updates</span></Link>
                    <Link to="/payment" className="nav-item"><span>Payment Updates</span></Link>
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
                                        {selectedReport === 'daily-sales'
                                            ? singleDate
                                            : selectedReport === 'service-popularity' || selectedReport === 'payment-method' || selectedReport === 'top-customers'
                                            ? `${dateRange.start} to ${dateRange.end}`
                                            : selectedReport === 'pickup-delivery' || selectedReport === 'weekly-performance'
                                            ? `${dateRange.start} to ${dateRange.end}`
                                            : selectedReport === 'monthly-sales'
                                            ? `${selectedYear}${selectedMonth ? ' — ' + ['January','February','March','April','May','June','July','August','September','October','November','December'][Number(selectedMonth) - 1] : ' — All Months'}`
                                            : 'Preview — mock data shown.'}
                                    </p>
                                </div>
                                <button
                                    className="btn-action btn-download"
                                    onClick={() => buildPdfReport(
                                        selectedReport,
                                        currentType.label,
                                        reportData,
                                        new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    )}
                                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.875rem', whiteSpace: 'nowrap' }}
                                >
                                    Download PDF
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

                            {reportData.insights && selectedReport === 'monthly-sales' && (
                                <div className="monthly-insights">
                                    <h3 className="insights-title">Insights</h3>
                                    <div className="insights-grid">
                                        <div className={`insight-card trend-${reportData.insights.growthTrend?.toLowerCase()}`}>
                                            <span className="insight-icon">
                                                {reportData.insights.growthTrend === 'Growing' ? '📈' : reportData.insights.growthTrend === 'Declining' ? '📉' : '➡️'}
                                            </span>
                                            <div>
                                                <p className="insight-label">Business Trend</p>
                                                <p className="insight-value">{reportData.insights.growthTrend}</p>
                                                <p className="insight-sub">
                                                    Avg MoM Growth: {reportData.insights.avgMomGrowth > 0 ? '+' : ''}{reportData.insights.avgMomGrowth}%
                                                </p>
                                            </div>
                                        </div>
                                        {reportData.insights.bestMonth && (
                                            <div className="insight-card trend-best">
                                                <span className="insight-icon">🏆</span>
                                                <div>
                                                    <p className="insight-label">Best Month</p>
                                                    <p className="insight-value">{reportData.insights.bestMonth.name}</p>
                                                    <p className="insight-sub">LKR {Number(reportData.insights.bestMonth.revenue).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        )}
                                        {reportData.insights.worstMonth && (
                                            <div className="insight-card trend-worst">
                                                <span className="insight-icon">⚠️</span>
                                                <div>
                                                    <p className="insight-label">Lowest Month</p>
                                                    <p className="insight-value">{reportData.insights.worstMonth.name}</p>
                                                    <p className="insight-sub">LKR {Number(reportData.insights.worstMonth.revenue).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="insight-card trend-seasonal">
                                            <span className="insight-icon">🌦️</span>
                                            <div>
                                                <p className="insight-label">Seasonal Avg Revenue</p>
                                                <div className="seasonal-quarters">
                                                    {reportData.insights.seasonal.map(q => (
                                                        <span key={q.quarter} className={`quarter-tag ${q.months_with_data === 0 ? 'quarter-empty' : ''}`}>
                                                            <strong>{q.quarter}</strong> {q.months_with_data > 0 ? `LKR ${Math.round(q.avg_revenue).toLocaleString()}` : 'No data'}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedReport === 'monthly-sales' && reportData.chartData && (
                                <>
                                    <div className="charts-row">
                                        <div className="chart-panel" style={{ flex: 1 }}>
                                            <h4>📈 Monthly Revenue Trend (LKR)</h4>
                                            <Line
                                                data={reportData.chartData.revenueLine}
                                                options={{
                                                    responsive: true,
                                                    plugins: { legend: { display: false } },
                                                    scales: { y: { beginAtZero: true } },
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="charts-row">
                                        <div className="chart-panel chart-panel--half">
                                            <h4>📦 Orders per Month</h4>
                                            <Bar
                                                data={reportData.chartData.ordersBar}
                                                options={{
                                                    responsive: true,
                                                    plugins: { legend: { display: false } },
                                                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                                                }}
                                            />
                                        </div>
                                        {reportData.chartData.seasonalBar.labels.length > 0 && (
                                            <div className="chart-panel chart-panel--half">
                                                <h4>🌦️ Seasonal Avg Revenue (LKR)</h4>
                                                <Bar
                                                    data={reportData.chartData.seasonalBar}
                                                    options={{
                                                        responsive: true,
                                                        plugins: { legend: { display: false } },
                                                        scales: { y: { beginAtZero: true } },
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {reportData.insights && selectedReport === 'payment-method' && (
                                <div className="monthly-insights">
                                    <h3 className="insights-title">Insights</h3>
                                    <div className="insights-grid">
                                        <div className="insight-card trend-preferred">
                                            <span className="insight-icon">🏅</span>
                                            <div>
                                                <p className="insight-label">Preferred Method</p>
                                                <p className="insight-value" style={{ textTransform: 'capitalize' }}>{reportData.insights.preferredMethod}</p>
                                                <p className="insight-sub">Most transactions in period</p>
                                            </div>
                                        </div>
                                        <div className="insight-card trend-revenue">
                                            <span className="insight-icon">💰</span>
                                            <div>
                                                <p className="insight-label">Top Revenue Method</p>
                                                <p className="insight-value" style={{ textTransform: 'capitalize' }}>{reportData.insights.topRevenueMethod}</p>
                                                <p className="insight-sub">Highest revenue contribution</p>
                                            </div>
                                        </div>
                                        <div className="insight-card trend-digital">
                                            <span className="insight-icon">📱</span>
                                            <div>
                                                <p className="insight-label">Digital Adoption</p>
                                                <p className="insight-value">{reportData.insights.digitalShare}% Digital</p>
                                                <p className="insight-sub">{reportData.insights.cashShare}% Cash — improve digital options</p>
                                            </div>
                                        </div>
                                        <div className="insight-card trend-discount">
                                            <span className="insight-icon">🏷️</span>
                                            <div>
                                                <p className="insight-label">Discounts Given</p>
                                                <p className="insight-value">LKR {Number(reportData.insights.totalDiscounts).toLocaleString()}</p>
                                                <p className="insight-sub">{reportData.insights.discountedOrders} discounted orders</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {reportData.insights && selectedReport === 'top-customers' && (
                                <div className="monthly-insights">
                                    <h3 className="insights-title">Insights</h3>
                                    <div className="insights-grid">
                                        <div className="insight-card trend-vip">
                                            <span className="insight-icon">👑</span>
                                            <div>
                                                <p className="insight-label">VIP Customer</p>
                                                <p className="insight-value">{reportData.insights.topSpender}</p>
                                                <p className="insight-sub">LKR {Number(reportData.insights.topSpenderAmount).toLocaleString()} total spend</p>
                                            </div>
                                        </div>
                                        <div className="insight-card trend-loyal">
                                            <span className="insight-icon">🔁</span>
                                            <div>
                                                <p className="insight-label">Most Loyal</p>
                                                <p className="insight-value">{reportData.insights.mostLoyal}</p>
                                                <p className="insight-sub">{reportData.insights.mostLoyalOrders} orders in period</p>
                                            </div>
                                        </div>
                                        <div className="insight-card trend-avgspend">
                                            <span className="insight-icon">💵</span>
                                            <div>
                                                <p className="insight-label">Avg Spend / Customer</p>
                                                <p className="insight-value">LKR {Number(reportData.insights.avgSpendPerCustomer).toLocaleString()}</p>
                                                <p className="insight-sub">Across top customers</p>
                                            </div>
                                        </div>
                                        <div className="insight-card trend-engagement">
                                            <span className="insight-icon">📦</span>
                                            <div>
                                                <p className="insight-label">Avg Orders / Customer</p>
                                                <p className="insight-value">{reportData.insights.avgOrdersPerCustomer}</p>
                                                <p className="insight-sub">Repeat business indicator</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedReport === 'service-popularity' && reportData.chartData && (
                                <>
                                    <div className="charts-row">
                                        <div className="chart-panel chart-panel--sm">
                                            <h4>💰 Revenue Share by Service</h4>
                                            <Pie
                                                data={reportData.chartData.revenuePie}
                                                options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
                                            />
                                        </div>
                                        <div className="chart-panel chart-panel--lg">
                                            <h4>📦 Top Services by Quantity Ordered</h4>
                                            <Bar
                                                data={reportData.chartData.quantityBar}
                                                options={{
                                                    responsive: true,
                                                    indexAxis: 'y',
                                                    plugins: { legend: { display: false } },
                                                    scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } },
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="charts-row">
                                        <div className="chart-panel chart-panel--half">
                                            <h4>📊 Revenue by Service (LKR)</h4>
                                            <Bar
                                                data={reportData.chartData.revenueBar}
                                                options={{
                                                    responsive: true,
                                                    plugins: { legend: { display: false } },
                                                    scales: { y: { beginAtZero: true } },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectedReport === 'pickup-delivery' && reportData.chartData && (
                                <>
                                    <div className="monthly-insights" style={{ marginBottom: '1.25rem' }}>
                                        <h3 className="insights-title">Insights</h3>
                                        <div className="insights-grid">
                                            <div className="insight-card trend-peak">
                                                <span className="insight-icon">⏰</span>
                                                <div>
                                                    <p className="insight-label">Peak Time Slot</p>
                                                    <p className="insight-value">{reportData.insights.peakTimeSlot}</p>
                                                    <p className="insight-sub">Assign more staff during this period</p>
                                                </div>
                                            </div>
                                            <div className="insight-card trend-area">
                                                <span className="insight-icon">📍</span>
                                                <div>
                                                    <p className="insight-label">Top Delivery Area</p>
                                                    <p className="insight-value">{reportData.insights.topDeliveryArea}</p>
                                                    <p className="insight-sub">Highest delivery demand location</p>
                                                </div>
                                            </div>
                                            <div className="insight-card trend-pickup">
                                                <span className="insight-icon">🧺</span>
                                                <div>
                                                    <p className="insight-label">Pickup Share</p>
                                                    <p className="insight-value">{reportData.insights.pickupShare}%</p>
                                                    <p className="insight-sub">of orders choose self pickup</p>
                                                </div>
                                            </div>
                                            <div className="insight-card trend-delivery">
                                                <span className="insight-icon">🚚</span>
                                                <div>
                                                    <p className="insight-label">Home Deliveries</p>
                                                    <p className="insight-value">{reportData.insights.deliveryCount}</p>
                                                    <p className="insight-sub">orders requiring delivery staff</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="charts-row">
                                        <div className="chart-panel chart-panel--sm">
                                            <h4>📊 Pickup vs Delivery Distribution</h4>
                                            <Pie data={reportData.chartData.typePie} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                                        </div>
                                        <div className="chart-panel chart-panel--lg">
                                            <h4>📊 Busy Pickup Time Slots</h4>
                                            <Bar
                                                data={reportData.chartData.timeBar}
                                                options={{ responsive: true, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } } }}
                                            />
                                        </div>
                                    </div>

                                    <div className="charts-row">
                                        {reportData.chartData.areaBar.labels.length > 0 && (
                                            <div className="chart-panel chart-panel--half">
                                                <h4>📊 High-Demand Delivery Areas</h4>
                                                <Bar
                                                    data={reportData.chartData.areaBar}
                                                    options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }}
                                                />
                                            </div>
                                        )}
                                        {reportData.chartData.trendLine.labels.length > 0 && (
                                            <div className="chart-panel chart-panel--half">
                                                <h4>📈 Daily Pickup & Delivery Trend</h4>
                                                <Line
                                                    data={reportData.chartData.trendLine}
                                                    options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {selectedReport === 'weekly-performance' && reportData.chartData && (
                                <>
                                    <div className="monthly-insights" style={{ marginBottom: '1.25rem' }}>
                                        <h3 className="insights-title">Business Insights</h3>
                                        <div className="insights-grid">
                                            <div className="insight-card trend-vip">
                                                <span className="insight-icon">🔥</span>
                                                <div>
                                                    <p className="insight-label">Best Day for Promotions</p>
                                                    <p className="insight-value">{reportData.insights.busiestDay}</p>
                                                    <p className="insight-sub">Highest customer traffic — maximise upsell</p>
                                                </div>
                                            </div>
                                            <div className="insight-card trend-preferred">
                                                <span className="insight-icon">🏖️</span>
                                                <div>
                                                    <p className="insight-label">Best Day for Holiday</p>
                                                    <p className="insight-value">{reportData.insights.quietestDay}</p>
                                                    <p className="insight-sub">Lowest order volume — least business impact</p>
                                                </div>
                                            </div>
                                            <div className="insight-card trend-seasonal">
                                                <span className="insight-icon">🔧</span>
                                                <div>
                                                    <p className="insight-label">Best Day for Maintenance</p>
                                                    <p className="insight-value">{reportData.insights.quietestDay}</p>
                                                    <p className="insight-sub">Schedule machine servicing on quiet days</p>
                                                </div>
                                            </div>
                                            <div className="insight-card trend-revenue">
                                                <span className="insight-icon">💰</span>
                                                <div>
                                                    <p className="insight-label">Peak Revenue Day</p>
                                                    <p className="insight-value">{reportData.insights.bestRevenueDay}</p>
                                                    <p className="insight-sub">Avg {reportData.insights.avgDailyOrders} orders/day across period</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="charts-row">
                                        <div className="chart-panel chart-panel--half">
                                            <h4>📊 Orders by Day of Week</h4>
                                            <Bar
                                                data={reportData.chartData.ordersBar}
                                                options={{
                                                    responsive: true,
                                                    indexAxis: 'y',
                                                    plugins: { legend: { display: false } },
                                                    scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } },
                                                }}
                                            />
                                        </div>
                                        <div className="chart-panel chart-panel--half">
                                            <h4>💰 Revenue by Day of Week (LKR)</h4>
                                            <Bar
                                                data={reportData.chartData.revenueBar}
                                                options={{
                                                    responsive: true,
                                                    plugins: { legend: { display: false } },
                                                    scales: { y: { beginAtZero: true } },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="preview-table-wrapper">
                                <table className="preview-table">
                                    <thead>
                                        <tr>{reportData.columns.map(c => <th key={c}>{c}</th>)}</tr>
                                    </thead>
                                    <tbody>
                                        {reportData.rows.map((row, i) => {
                                            const raw = reportData._raw?.[i];
                                            const weekly = reportData._weeklyRaw?.[i];
                                            const cls = weekly?.isBusiest ? 'row-busy' : weekly?.isQuietest ? 'row-drop' : raw?.isBest ? 'row-busy' : raw?.isBusy ? 'row-busy' : raw?.isDrop ? 'row-drop' : '';
                                            return (
                                                <tr key={i} className={cls}>
                                                    {row.map((cell, j) => <td key={j}>{cell}</td>)}
                                                </tr>
                                            );
                                        })}
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
                                            Download PDF
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
