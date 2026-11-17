
const router = require("express").Router();

const {
  protect,
  authorize,
} = require("../middleware/auth");

const {
  getDashboardStats,
  getAllUsers,
  getAllContractors,
  getAllEstimationRequests,
  getAllQuotations,
} = require("../controllers/AdminController");

// All admin routes require admin authentication
router.use(protect, authorize("admin"));

// Dashboard statistics
router.get("/stats", getDashboardStats);

// User management
router.get("/users", getAllUsers);

// Contractor management
router.get("/contractors", getAllContractors);

// Estimation request management
router.get("/requests", getAllEstimationRequests);

// Quotation management
router.get("/quotations", getAllQuotations);

module.exports = router;
