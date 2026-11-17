
const router = require("express").Router();

const {
  getPricing,
  updatePricing,
} = require("../controllers/contractorPricingController");

const {
  protect,
  authorize,
} = require("../middleware/auth");

// Contractor-only access
router.use(protect, authorize("contractor"));

router.get("/", getPricing);
router.put("/", updatePricing);

module.exports = router;
