const Report = require('../models/report.model');

const reportController = {
  async getDailySales(req, res) {
    try {
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        return res.status(400).json({ success: false, message: 'start_date and end_date are required (YYYY-MM-DD)' });
      }

      const dateRe = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRe.test(start_date) || !dateRe.test(end_date)) {
        return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
      }

      if (start_date > end_date) {
        return res.status(400).json({ success: false, message: 'start_date must be before or equal to end_date' });
      }

      const { dailyRows, paymentRows } = await Report.getDailySalesData(start_date, end_date);

      const totalOrders    = dailyRows.reduce((s, r) => s + Number(r.orders), 0);
      const totalRevenue   = dailyRows.reduce((s, r) => s + Number(r.revenue), 0);
      const totalCompleted = dailyRows.reduce((s, r) => s + Number(r.completed), 0);
      const avgOrderValue  = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const completionRate = totalOrders > 0 ? (totalCompleted / totalOrders) * 100 : 0;

      const avgDailyOrders = dailyRows.length > 0 ? totalOrders / dailyRows.length : 0;
      const enrichedDaily = dailyRows.map(row => ({
        ...row,
        isBusy: avgDailyOrders > 0 && Number(row.orders) >= avgDailyOrders * 1.5,
        isDrop: avgDailyOrders > 0 && Number(row.orders) <= avgDailyOrders * 0.5,
      }));

      res.json({
        success: true,
        summary: {
          totalOrders,
          totalRevenue: Number(totalRevenue.toFixed(2)),
          avgOrderValue: Number(avgOrderValue.toFixed(2)),
          completionRate: Number(completionRate.toFixed(1)),
          dateRange: { start: start_date, end: end_date },
          daysWithData: dailyRows.length,
        },
        payment_breakdown: paymentRows,
        daily_data: enrichedDaily,
      });
    } catch (err) {
      console.error('getDailySales error:', err);
      res.status(500).json({ success: false, message: 'Failed to generate report' });
    }
  },
  async getServicePopularity(req, res) {
    try {
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        return res.status(400).json({ success: false, message: 'start_date and end_date are required (YYYY-MM-DD)' });
      }
      const dateRe = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRe.test(start_date) || !dateRe.test(end_date)) {
        return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
      }
      if (start_date > end_date) {
        return res.status(400).json({ success: false, message: 'start_date must be before or equal to end_date' });
      }

      const { serviceRows } = await Report.getServicePopularityData(start_date, end_date);

      const totalQuantity = serviceRows.reduce((s, r) => s + Number(r.total_quantity), 0);
      const totalRevenue  = serviceRows.reduce((s, r) => s + Number(r.total_revenue), 0);
      const uniqueItems   = new Set(serviceRows.map(r => r.item_name)).size;

      const enrichedServices = serviceRows.map(row => ({
        ...row,
        share: totalRevenue > 0
          ? Number(((Number(row.total_revenue) / totalRevenue) * 100).toFixed(1))
          : 0,
      }));

      res.json({
        success: true,
        summary: {
          uniqueItems,
          totalQuantity,
          totalRevenue: Number(totalRevenue.toFixed(2)),
          topItem:      serviceRows.length > 0 ? serviceRows[0].item_name : 'N/A',
          dateRange:    { start: start_date, end: end_date },
        },
        services: enrichedServices,
      });
    } catch (err) {
      console.error('getServicePopularity error:', err);
      res.status(500).json({ success: false, message: 'Failed to generate report' });
    }
  },
  async getPaymentMethod(req, res) {
    try {
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        return res.status(400).json({ success: false, message: 'start_date and end_date are required (YYYY-MM-DD)' });
      }
      const dateRe = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRe.test(start_date) || !dateRe.test(end_date)) {
        return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
      }
      if (start_date > end_date) {
        return res.status(400).json({ success: false, message: 'start_date must be before or equal to end_date' });
      }

      const { paymentRows } = await Report.getPaymentMethodData(start_date, end_date);

      const totalTransactions = paymentRows.reduce((s, r) => s + Number(r.transactions), 0);
      const totalRevenue      = paymentRows.reduce((s, r) => s + Number(r.revenue),      0);
      const totalCollected    = paymentRows.reduce((s, r) => s + Number(r.collected),    0);
      const totalPending      = paymentRows.reduce((s, r) => s + Number(r.pending_amount), 0);
      const collectedRate     = totalRevenue > 0 ? (totalCollected / totalRevenue) * 100 : 0;

      // Preferred method (most transactions) and top revenue method
      const preferredMethod   = paymentRows.length > 0
        ? paymentRows.reduce((a, b) => Number(b.transactions) > Number(a.transactions) ? b : a).payment_method
        : 'N/A';
      const topRevenueMethod  = paymentRows.length > 0
        ? paymentRows[0].payment_method   // already sorted by revenue DESC
        : 'N/A';

      // Cash vs digital split
      const digitalMethods = ['visa', 'mastercard', 'amex', 'online', 'card'];
      let digitalTx = 0;
      let cashTx    = 0;
      paymentRows.forEach(r => {
        const tx = Number(r.transactions);
        if (digitalMethods.includes(r.payment_method.toLowerCase())) {
          digitalTx += tx;
        } else {
          cashTx += tx;
        }
      });
      const digitalShare = totalTransactions > 0 ? Number(((digitalTx / totalTransactions) * 100).toFixed(1)) : 0;
      const cashShare    = totalTransactions > 0 ? Number(((cashTx    / totalTransactions) * 100).toFixed(1)) : 0;

      // Per-row revenue share %
      const enrichedPayments = paymentRows.map(row => ({
        ...row,
        share: totalRevenue > 0
          ? Number(((Number(row.revenue) / totalRevenue) * 100).toFixed(1))
          : 0,
      }));

      res.json({
        success: true,
        summary: {
          totalTransactions,
          totalRevenue:   Number(totalRevenue.toFixed(2)),
          totalCollected: Number(totalCollected.toFixed(2)),
          totalPending:   Number(totalPending.toFixed(2)),
          collectedRate:  Number(collectedRate.toFixed(1)),
          preferredMethod,
          topRevenueMethod,
          cashShare,
          digitalShare,
          dateRange: { start: start_date, end: end_date },
        },
        payment_data: enrichedPayments,
      });
    } catch (err) {
      console.error('getPaymentMethod error:', err);
      res.status(500).json({ success: false, message: 'Failed to generate report' });
    }
  },
  async getMonthlySales(req, res) {
    try {
      const { year, month } = req.query;

      if (!year || !/^\d{4}$/.test(year)) {
        return res.status(400).json({ success: false, message: 'year is required (YYYY)' });
      }
      if (month && (isNaN(month) || Number(month) < 1 || Number(month) > 12)) {
        return res.status(400).json({ success: false, message: 'month must be 1–12' });
      }

      const { monthlyRows } = await Report.getMonthlySalesData(year, month || null);

      const totalOrders  = monthlyRows.reduce((s, r) => s + Number(r.orders),  0);
      const totalRevenue = monthlyRows.reduce((s, r) => s + Number(r.revenue), 0);
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Best / worst month by revenue
      let bestMonth  = null;
      let worstMonth = null;
      if (monthlyRows.length > 0) {
        bestMonth  = monthlyRows.reduce((a, b) => Number(b.revenue) > Number(a.revenue) ? b : a);
        if (monthlyRows.length > 1) {
          worstMonth = monthlyRows.reduce((a, b) => Number(b.revenue) < Number(a.revenue) ? b : a);
        }
      }

      // Average month-over-month growth %
      const momGrowths = [];
      for (let i = 1; i < monthlyRows.length; i++) {
        const prev = Number(monthlyRows[i - 1].revenue);
        const curr = Number(monthlyRows[i].revenue);
        if (prev > 0) momGrowths.push(((curr - prev) / prev) * 100);
      }
      const avgMomGrowth = momGrowths.length > 0
        ? momGrowths.reduce((s, v) => s + v, 0) / momGrowths.length
        : 0;
      const growthTrend = avgMomGrowth > 5 ? 'Growing' : avgMomGrowth < -5 ? 'Declining' : 'Stable';

      // Quarterly seasonal breakdown
      const seasonalMap = { Q1: [], Q2: [], Q3: [], Q4: [] };
      monthlyRows.forEach(r => {
        const m = Number(r.month_num);
        const q = m <= 3 ? 'Q1' : m <= 6 ? 'Q2' : m <= 9 ? 'Q3' : 'Q4';
        seasonalMap[q].push(Number(r.revenue));
      });
      const seasonal = Object.entries(seasonalMap).map(([quarter, vals]) => ({
        quarter,
        avg_revenue: vals.length > 0 ? Number((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2)) : 0,
        months_with_data: vals.length,
      }));

      res.json({
        success: true,
        summary: {
          year,
          month: month || null,
          totalOrders,
          totalRevenue:  Number(totalRevenue.toFixed(2)),
          avgOrderValue: Number(avgOrderValue.toFixed(2)),
          bestMonth:  bestMonth  ? { name: bestMonth.month_name,  revenue: Number(Number(bestMonth.revenue).toFixed(2))  } : null,
          worstMonth: worstMonth ? { name: worstMonth.month_name, revenue: Number(Number(worstMonth.revenue).toFixed(2)) } : null,
          avgMomGrowth:    Number(avgMomGrowth.toFixed(1)),
          growthTrend,
          monthsWithData: monthlyRows.length,
        },
        seasonal,
        monthly_data: monthlyRows,
      });
    } catch (err) {
      console.error('getMonthlySales error:', err);
      res.status(500).json({ success: false, message: 'Failed to generate report' });
    }
  },
};

module.exports = reportController;
