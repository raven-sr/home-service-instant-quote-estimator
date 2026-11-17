
const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
  {
    estimationRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EstimationRequest",
      required: true,
      unique: true,
    },

    homeowner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    serviceType: {
      type: String,
      enum: ["roofing", "painting"],
      required: true,
    },

    // ROOFING MEASUREMENTS
    measurements: {
      length: Number,
      width: Number,
      unit: {
        type: String,
        default: "ft",
      },
      roofArea: Number,
      verifiedArea: Number,
    },

    // PAINTING MEASUREMENTS
    paintingMeasurements: {
      paintableArea: Number,
      unit: {
        type: String,
        default: "sqft",
      },
    },

    // PAINT DETAILS
    paint: {
      coverageSqFtPerLitre: Number,
      coats: Number,
      quantityLitres: Number,
    },

    // MATERIAL COST
    material: {
      wastagePercentage: {
        type: Number,
        default: 0,
      },
      billableArea: Number,
      ratePerSqFt: {
        type: Number,
        required: true,
      },
      cost: {
        type: Number,
        required: true,
      },
    },

    // LABOUR COST
    labour: {
      ratePerSqFt: {
        type: Number,
        required: true,
      },
      cost: {
        type: Number,
        required: true,
      },
    },

    currency: {
      type: String,
      default: "INR",
    },

    totalCost: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "sent", "accepted", "rejected"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", quotationSchema);
