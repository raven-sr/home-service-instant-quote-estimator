
const ContractorPricing = require("../models/ContractorPricing");

const defaultPricing = {
  roofing: {
    materialRatePerSqFt: 0,
    labourRatePerSqFt: 0,
  },
  painting: {
    materialRatePerSqFt: 0,
    labourRatePerSqFt: 0,
    coverageSqFtPerLitre: 100,
    coats: 2,
  },
};

// GET CONTRACTOR PRICING
exports.getPricing = async (req, res) => {
  try {
    let pricing = await ContractorPricing.findOne({
      contractor: req.user._id,
    });

    if (!pricing) {
      return res.status(200).json({
        success: true,
        pricing: {
          currency: "INR",
          ...defaultPricing,
        },
      });
    }

    return res.status(200).json({
      success: true,
      pricing,
    });
  } catch (error) {
    console.error("Get contractor pricing error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve pricing.",
    });
  }
};

// UPDATE CONTRACTOR PRICING
exports.updatePricing = async (req, res) => {
  try {
    const { roofing, painting } = req.body;

    if (!roofing || !painting) {
      return res.status(400).json({
        success: false,
        message: "Roofing and painting pricing are required.",
      });
    }

    const fields = [
      ["Roofing material rate", roofing.materialRatePerSqFt],
      ["Roofing labour rate", roofing.labourRatePerSqFt],
      ["Painting material rate", painting.materialRatePerSqFt],
      ["Painting labour rate", painting.labourRatePerSqFt],
      ["Paint coverage", painting.coverageSqFtPerLitre],
      ["Paint coats", painting.coats],
    ];

    for (const [label, value] of fields) {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        !Number.isFinite(Number(value))
      ) {
        return res.status(400).json({
          success: false,
          message: `${label} must be a valid number.`,
        });
      }

      if (Number(value) < 0) {
        return res.status(400).json({
          success: false,
          message: `${label} cannot be negative.`,
        });
      }
    }

    const coverage = Number(painting.coverageSqFtPerLitre);
    const coats = Number(painting.coats);

    if (coverage <= 0) {
      return res.status(400).json({
        success: false,
        message: "Paint coverage must be greater than zero.",
      });
    }

    if (!Number.isInteger(coats) || coats < 1 || coats > 10) {
      return res.status(400).json({
        success: false,
        message: "Paint coats must be a whole number between 1 and 10.",
      });
    }

    const pricingData = {
      contractor: req.user._id,
      currency: "INR",
      roofing: {
        materialRatePerSqFt: Number(roofing.materialRatePerSqFt),
        labourRatePerSqFt: Number(roofing.labourRatePerSqFt),
      },
      painting: {
        materialRatePerSqFt: Number(painting.materialRatePerSqFt),
        labourRatePerSqFt: Number(painting.labourRatePerSqFt),
        coverageSqFtPerLitre: coverage,
        coats,
      },
    };

    const pricing = await ContractorPricing.findOneAndUpdate(
      { contractor: req.user._id },
      { $set: pricingData },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Contractor pricing saved successfully.",
      pricing,
    });
  } catch (error) {
    console.error("Update contractor pricing error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save contractor pricing.",
    });
  }
};
