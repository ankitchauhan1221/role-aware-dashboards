const express = require('express');
const reportController = require('../controllers/reportController');
const requireAuth = require('../middlewares/authMiddleware');
const requirePermission = require('../middlewares/permissionMiddleware');

const router = express.Router();

router.get('/', requireAuth, requirePermission('view:reports'), reportController.getReports);

module.exports = router;