
const router = require("express").Router();

const {
  protect,
  authorize,
} = require("../middleware/auth");

const {
  getContractorRequests,
  claimRequest,
  verifyRoofMeasurements,
} = require("../controllers/contractorRequestController");

router.use(protect, authorize("contractor"));

router.get("/", getContractorRequests);

router.post("/:id/claim", claimRequest);

router.put("/:id/verify-measurements", verifyRoofMeasurements);

module.exports = router;
