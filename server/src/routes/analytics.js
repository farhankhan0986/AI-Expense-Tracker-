const { Router } = require('express');
const auth = require('../middleware/auth');
const {
  getMonthlyAnalytics,
  getSpendingTrend,
  getSavingSuggestions,
  getBudgetAlerts,
  getDailyAnalytics,
} = require('../controllers/analyticsController');

const router = Router();

router.use(auth);

router.get('/monthly', getMonthlyAnalytics);
router.get('/trends', getSpendingTrend);
router.get('/daily', getDailyAnalytics);
router.get('/suggestions', getSavingSuggestions);
router.get('/alerts', getBudgetAlerts);

module.exports = router;
