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
};

module.exports = reportController;
