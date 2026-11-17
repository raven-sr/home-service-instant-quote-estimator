
const mongoose = require("mongoose");

const contractorPricingSchema = new mongoose.Schema(
  {
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    currency: {
      type: String,
      default: "INR",
      enum: ["INR"],
    },

    roofing: {
      materialRatePerSqFt: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      labourRatePerSqFt: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
    },

    painting: {
      materialRatePerSqFt: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      labourRatePerSqFt: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      coverageSqFtPerLitre: {
        type: Number,
        required: true,
        min: 0.01,
        default: 100,
      },
      coats: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        default: 2,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ContractorPricing",
  contractorPricingSchema
);
 