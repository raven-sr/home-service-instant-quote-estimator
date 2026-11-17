const router = require("express").Router();

const { protect } = require("../middleware/auth");

const {
  getMyQuotations,
  getQuotationById,
} = require("../controllers/quotationController");

const {
  downloadQuotationPDF,
} = require("../controllers/quotationPdfController");

router.use(protect);

router.get("/", getMyQuotations);

// PDF download route
router.get("/:id/pdf", downloadQuotationPDF);

// Get quotation details
router.get("/:id", getQuotationById);

module.exports = router;