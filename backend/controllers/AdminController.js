
const User = require("../models/User");
const EstimationRequest = require("../models/EstimationRequest");
const Quotation = require("../models/Quotation");

// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalHomeowners,
      totalContractors,
      totalRequests,
      totalRoofingRequests,
      totalPaintingRequests,
      pendingRequests,
      completedRequests,
      totalQuotations,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "homeowner" }),
      User.countDocuments({ role: "contractor" }),
      EstimationRequest.countDocuments(),
      EstimationRequest.countDocuments({ serviceType: "roofing" }),
      EstimationRequest.countDocuments({ serviceType: "painting" }),
      EstimationRequest.countDocuments({
        status: {
          $in: [
            "submitted",
            "under_review",
            "awaiting_measurements",
          ],
        },
      }),
      EstimationRequest.countDocuments({ status: "quoted" }),
      Quotation.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalHomeowners,
        totalContractors,
        totalRequests,
        totalRoofingRequests,
        totalPaintingRequests,
        pendingRequests,
        completedRequests,
        totalQuotations,
      },
    });
  } catch (error) {
    console.error("Admin dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard statistics.",
    });
  }
};

// ==========================================
// GET ALL USERS
// ==========================================

exports.getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    const filter = {};

    if (["homeowner", "contractor", "admin"].includes(req.query.role)) {
      filter.role = req.query.role;
    }

    if (req.query.search?.trim()) {
      const search = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    console.error("Admin users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve users.",
    });
  }
};

// ==========================================
// GET ALL CONTRACTORS
// ==========================================

exports.getAllContractors = async (req, res) => {
  try {
    const contractors = await User.find({
      role: "contractor",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contractors.length,
      contractors,
    });
  } catch (error) {
    console.error("Admin contractors error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve contractors.",
    });
  }
};

// ==========================================
// GET ALL ESTIMATION REQUESTS
// ==========================================

exports.getAllEstimationRequests = async (req, res) => {
  try {
    const filter = {};

    if (["roofing", "painting"].includes(req.query.serviceType)) {
      filter.serviceType = req.query.serviceType;
    }

    if (
      [
        "submitted",
        "under_review",
        "awaiting_measurements",
        "quoted",
        "cancelled",
      ].includes(req.query.status)
    ) {
      filter.status = req.query.status;
    }

    const requests = await EstimationRequest.find(filter)
      .populate("homeowner", "name email")
      .populate("assignedContractor", "name email contractorProfile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Admin estimation requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve estimation requests.",
    });
  }
};

// ==========================================
// GET ALL QUOTATIONS
// ==========================================

exports.getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
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
    console.error("Admin quotations error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve quotations.",
    });
  }
};
