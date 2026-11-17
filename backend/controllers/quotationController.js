
const mongoose = require("mongoose");
const Quotation = require("../models/Quotation");

// GET ALL QUOTATIONS FOR LOGGED-IN USER
exports.getMyQuotations = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "contractor") {
      filter.contractor = req.user._id;
    } else if (req.user.role === "homeowner") {
      filter.homeowner = req.user._id;
    } else if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view quotations.",
      });
    }

    const quotations = await Quotation.find(filter)
      .populate("homeowner", "name email")
      .populate("contractor", "name email")
      .populate("estimationRequest", "serviceType propertyAddress status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: quotations.length,
      quotations,
    });
  } catch (error) {
    console.error("Get quotations error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve quotations.",
    });
  }
};

// GET SINGLE QUOTATION
exports.getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quotation ID.",
      });
    }

    let filter = { _id: id };

    if (req.user.role === "contractor") {
      filter.contractor = req.user._id;
    } else if (req.user.role === "homeowner") {
      filter.homeowner = req.user._id;
    } else if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this quotation.",
      });
    }

    const quotation = await Quotation.findOne(filter)
      .populate("homeowner", "name email")
      .populate("contractor", "name email")
      .populate("estimationRequest");

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      quotation,
    });
  } catch (error) {
    console.error("Get quotation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve quotation.",
    });
  }
};
