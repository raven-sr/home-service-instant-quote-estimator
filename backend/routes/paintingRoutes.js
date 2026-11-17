
const router = require("express").Router();

const {
  protect,
  authorize,
} = require("../middleware/auth");

const {
  verifyPaintingMeasurements,
  calculatePainting,
} = require("../controllers/paintingController");

// Contractor-only access
router.use(protect, authorize("contractor"));

// Verify paintable area
router.put(
  "/:id/verify-measurements",
  verifyPaintingMeasurements
);

// Generate painting quotation
router.post(
  "/:id/calculate",
  calculatePainting
);

module.exports = router;
