
const EstimationRequest = require("../models/EstimationRequest");
const ContractorPricing = require("../models/ContractorPricing");
const Quotation = require("../models/Quotation");

const {
  calculateRoofingEstimate,
} = require("../utils/roofingCalculator");

exports.calculateRoofing = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { wastagePercentage = 0 } = req.body;

    const request = await EstimationRequest.findOne({
      _id: requestId,
      assignedContractor: req.user._id,
      serviceType: "roofing",
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Assigned roofing request not found.",
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

    if (!request.propertyDetails?.measurementsVerified) {
      return res.status(400).json({
        success: false,
        message: "Roof measurements must be verified first.",
      });
    }

    const measurements = request.verifiedMeasurements;

    if (
      !measurements ||
      measurements.verifiedBy?.toString() !== req.user._id.toString() ||
      !measurements.verifiedAt ||
      measurements.unit !== "ft"
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid contractor-verified measurements are required.",
      });
    }

    const contractorPricing = await ContractorPricing.findOne({
      contractor: req.user._id,
    });

    if (!contractorPricing) {
      return res.status(400).json({
        success: false,
        message: "Please configure your contractor pricing first.",
      });
    }

    const result = calculateRoofingEstimate({
      length: measurements.length,
      width: measurements.width,
      wastagePercentage,
      materialRatePerSqFt:
        contractorPricing.roofing.materialRatePerSqFt,
      labourRatePerSqFt:
        contractorPricing.roofing.labourRatePerSqFt,
    });

    const verifiedArea = Number(
      request.propertyDetails.verifiedArea
    );

    if (
      !Number.isFinite(verifiedArea) ||
      Math.abs(verifiedArea - result.measurements.roofArea) > 0.01
    ) {
      return res.status(400).json({
        success: false,
        message: "Verified roof area does not match the stored measurements.",
      });
    }

    const quotation = await Quotation.create({
      estimationRequest: request._id,
      homeowner: request.homeowner,
      contractor: req.user._id,
      serviceType: "roofing",
      ...result,
    });

    request.status = "quoted";
    await request.save();

    return res.status(201).json({
      success: true,
      message: "Roofing quotation calculated successfully.",
      quotation,
    });
  } catch (error) {
    console.error("Roofing calculation error:", error);

    return res.status(400).json({
      success: false,
      message:
        error.message || "Unable to calculate roofing quotation.",
    });
  }
};
