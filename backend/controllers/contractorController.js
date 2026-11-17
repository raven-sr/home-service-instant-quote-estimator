
const User = require("../models/User");

// GET CONTRACTOR PROFILE
exports.getProfile = async (req, res) => {
  try {
    const contractor = await User.findById(req.user._id);

    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: "Contractor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      profile: {
        id: contractor._id,
        name: contractor.name,
        email: contractor.email,
        role: contractor.role,
        contractorProfile: contractor.contractorProfile,
      },
    });
  } catch (error) {
    console.error("Get contractor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve contractor profile.",
    });
  }
};

// UPDATE CONTRACTOR PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const {
      businessName,
      phone,
      services,
      experienceYears,
      serviceAreas,
      description,
    } = req.body;

    const contractor = await User.findById(req.user._id);

    if (!contractor) {
      return res.status(404).json({
        success: false,
        message: "Contractor not found.",
      });
    }

    // Validate services
    const allowedServices = ["roofing", "painting"];

    if (
      services !== undefined &&
      (!Array.isArray(services) ||
        services.some((service) => !allowedServices.includes(service)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Services must be roofing, painting, or both.",
      });
    }

    // Validate experience
    if (experienceYears !== undefined) {
      const years = Number(experienceYears);

      if (!Number.isFinite(years) || years < 0) {
        return res.status(400).json({
          success: false,
          message: "Experience years must be a valid non-negative number.",
        });
      }

      contractor.contractorProfile.experienceYears = years;
    }

    // Validate service areas
    if (serviceAreas !== undefined) {
      if (
        !Array.isArray(serviceAreas) ||
        serviceAreas.some((area) => typeof area !== "string")
      ) {
        return res.status(400).json({
          success: false,
          message: "Service areas must be an array of strings.",
        });
      }

      contractor.contractorProfile.serviceAreas = serviceAreas
        .map((area) => area.trim())
        .filter(Boolean);
    }

    // Update permitted fields only
    if (businessName !== undefined) {
      contractor.contractorProfile.businessName =
        String(businessName).trim();
    }

    if (phone !== undefined) {
      contractor.contractorProfile.phone = String(phone).trim();
    }

    if (services !== undefined) {
      contractor.contractorProfile.services = services;
    }

    if (description !== undefined) {
      contractor.contractorProfile.description =
        String(description).trim();
    }

    await contractor.save();

    return res.status(200).json({
      success: true,
      message: "Contractor profile updated successfully.",
      profile: {
        id: contractor._id,
        name: contractor.name,
        email: contractor.email,
        role: contractor.role,
        contractorProfile: contractor.contractorProfile,
      },
    });
  } catch (error) {
    console.error("Update contractor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update contractor profile.",
    });
  }
};
