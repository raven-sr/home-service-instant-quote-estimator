
const router = require("express").Router();

const {
  protect,
  authorize,
} = require("../middleware/auth");

const {
  calculateRoofing,
} = require("../controllers/roofingController");

router.use(protect, authorize("contractor"));

router.post(
  "/:requestId/calculate",
  calculateRoofing
);

module.exports = router;
