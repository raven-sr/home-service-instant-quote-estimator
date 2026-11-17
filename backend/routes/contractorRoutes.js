
const router = require("express").Router();

const {
  getProfile,
  updateProfile,
} = require("../controllers/contractorController");

const {
  protect,
  authorize,
} = require("../middleware/auth");

// All routes require contractor authentication
router.use(protect, authorize("contractor"));

// Get contractor profile
router.get("/profile", getProfile);

// Update contractor profile
router.put("/profile", updateProfile);

module.exports = router;
