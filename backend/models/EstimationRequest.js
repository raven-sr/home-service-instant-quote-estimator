
const mongoose = require("mongoose");

const estimationSchema = new mongoose.Schema(
  {
    homeowner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignedContractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    serviceType: {
      type: String,
      enum: ["roofing", "painting"],
      required: true,
    },

    propertyAddress: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    propertyDetails: {
      propertyType: String,
      verifiedArea: {
        type: Number,
        min: 0,
      },
      areaUnit: {
        type: String,
        enum: ["sqft", "sqm"],
        default: "sqft",
      },
      measurementsVerified: {
        type: Boolean,
        default: false,
      },
    },

    verifiedMeasurements: {
      length: {
        type: Number,
        min: 0,
      },
      width: {
        type: Number,
        min: 0,
      },
      unit: {
        type: String,
        enum: ["ft"],
        default: "ft",
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: Date,
    },

    paintingMeasurements: {
      paintableArea: {
        type: Number,
        min: 0,
      },
      unit: {
        type: String,
        enum: ["sqft"],
        default: "sqft",
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: Date,
    },


    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "awaiting_measurements",
        "quoted",
        "cancelled",
      ],
      default: "submitted",
    },

    images: [
      {
        url: String,
        publicId: String,
        analysis: String,
      },
    ],

    conversation: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("EstimationRequest", estimationSchema);
