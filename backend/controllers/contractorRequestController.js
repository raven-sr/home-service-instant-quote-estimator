
const EstimationRequest = require("../models/EstimationRequest");

// GET AVAILABLE AND ASSIGNED REQUESTS
exports.getContractorRequests = async (req, res) => {
  try {
    const requests = await EstimationRequest.find({
      serviceType: { $in: ["roofing", "painting"] },
      status: { $ne: "cancelled" },
      $or: [
        { assignedContractor: null },
        { assignedContractor: req.user._id },
      ],
    })
      .populate("homeowner", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get contractor requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve requests.",
    });
  }
};

// CLAIM A REQUEST
exports.claimRequest = async (req, res) => {
  try {
    const request = await EstimationRequest.findOneAndUpdate(
      {
        _id: req.params.id,
        serviceType: { $in: ["roofing", "painting"] },
        assignedContractor: null,
        status: {
          $in: [
            "submitted",
            "under_review",
            "awaiting_measurements",
          ],
        },
      },
      {
        $set: {
          assignedContractor: req.user._id,
          status: "under_review",
        },
      },
      { new: true }
    ).populate("homeowner", "name email");

    if (!request) {
      return res.status(409).json({
        success: false,
        message:
          "This request is unavailable or has already been assigned.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request assigned to you successfully.",
      request,
    });
  } catch (error) {
    console.error("Claim request error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to claim this request.",
    });
  }
};

// VERIFY ROOF MEASUREMENTS
exports.verifyRoofMeasurements = async (req, res) => {
  try {
    const { length, width } = req.body;

    if (
      length === undefined ||
      length === null ||
      length === "" ||
      width === undefined ||
      width === null ||
      width === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Length and width are required.",
      });
    }

    const roofLength = Number(length);
    const roofWidth = Number(width);

    if (
      !Number.isFinite(roofLength) ||
      !Number.isFinite(roofWidth) ||
      roofLength <= 0 ||
      roofWidth <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter valid roof length and width in feet.",
      });
    }

    const request = await EstimationRequest.findOne({
      _id: req.params.id,
      assignedContractor: req.user._id,
      serviceType: "roofing",
      status: { $nin: ["cancelled", "quoted"] },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Assigned roofing request not found.",
      });
    }

    const roofArea = roofLength * roofWidth;

    request.verifiedMeasurements = {
      length: roofLength,
      width: roofWidth,
      unit: "ft",
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
    };

    request.propertyDetails.verifiedArea = Number(
      roofArea.toFixed(2)
    );

    request.propertyDetails.areaUnit = "sqft";
    request.propertyDetails.measurementsVerified = true;

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Roof measurements verified successfully.",
      measurements: {
        length: roofLength,
        width: roofWidth,
        area: Number(roofArea.toFixed(2)),
        unit: "sqft",
      },
      request,
    });
  } catch (error) {
    console.error("Verify roof measurements error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify roof measurements.",
    });
  }
};
