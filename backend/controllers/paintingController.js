
const EstimationRequest = require("../models/EstimationRequest");
const ContractorPricing = require("../models/ContractorPricing");
const Quotation = require("../models/Quotation");

const {
  calculatePaintingEstimate,
} = require("../utils/paintingCalculator");

// VERIFY PAINTABLE AREA
exports.verifyPaintingMeasurements = async (req, res) => {
  try {
    const { paintableArea } = req.body;

    if (
      paintableArea === undefined ||
      paintableArea === null ||
      paintableArea === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Paintable area is required.",
      });
    }

    const area = Number(paintableArea);

    if (!Number.isFinite(area) || area <= 0) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid paintable area greater than zero.",
      });
    }

    const request = await EstimationRequest.findOne({
      _id: req.params.id,
      assignedContractor: req.user._id,
      serviceType: "painting",
      status: { $nin: ["cancelled", "quoted"] },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Assigned painting request not found.",
      });
    }

    request.paintingMeasurements = {
      paintableArea: Number(area.toFixed(2)),
      unit: "sqft",
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
    };

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Painting area verified successfully.",
      measurements: request.paintingMeasurements,
    });
  } catch (error) {
    console.error("Verify painting area error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify painting area.",
    });
  }
};

// CALCULATE PAINTING QUOTATION
exports.calculatePainting = async (req, res) => {
  try {
    const request = await EstimationRequest.findOne({
      _id: req.params.id,
      assignedContractor: req.user._id,
      serviceType: "painting",
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Assigned painting request not found.",
      });
    }

    if (request.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot quote a cancelled request.",
      });
    }

    if (request.status === "quoted") {
      return res.status(409).json({
        success: false,
        message: "This request already has a quotation.",
      });
    }

    const measurements = request.paintingMeasurements;

    if (
      !measurements ||
      !measurements.paintableArea ||
      measurements.verifiedBy?.toString() !== req.user._id.toString() ||
      !measurements.verifiedAt
    ) {
      return res.status(400).json({
        success: false,
        message: "Painting area must be verified first.",
      });
    }

    const pricing = await ContractorPricing.findOne({
      contractor: req.user._id,
    });

    if (!pricing) {
      return res.status(400).json({
        success: false,
        message: "Configure contractor pricing first.",
      });
    }

    const result = calculatePaintingEstimate({
      area: measurements.paintableArea,
      materialRatePerSqFt:
        pricing.painting.materialRatePerSqFt,
      labourRatePerSqFt:
        pricing.painting.labourRatePerSqFt,
      coverageSqFtPerLitre:
        pricing.painting.coverageSqFtPerLitre,
      coats: pricing.painting.coats,
    });

    const quotation = await Quotation.create({
  estimationRequest: request._id,
  homeowner: request.homeowner,
  contractor: req.user._id,
  serviceType: "painting",

  paintingMeasurements: {
    paintableArea: result.measurements.verifiedArea,
    unit: "sqft",
  },

  paint: result.paint,

  material: result.material,
  labour: result.labour,

  currency: result.currency,
  totalCost: result.totalCost,
});

    request.status = "quoted";
    await request.save();

    return res.status(201).json({
      success: true,
      message: "Painting quotation generated successfully.",
      quotation,
    });
  } catch (error) {
    console.error("Painting calculation error:", error);

    return res.status(400).json({
      success: false,
      message:
        error.message || "Unable to calculate painting quotation.",
    });
  }
};
