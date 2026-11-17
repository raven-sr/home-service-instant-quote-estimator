
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const contractorProfileSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    services: {
      type: [
        {
          type: String,
          enum: ["roofing", "painting"],
        },
      ],
      default: [],
    },

    experienceYears: {
      type: Number,
      min: 0,
      default: 0,
    },

    serviceAreas: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["homeowner", "contractor", "admin"],
      default: "homeowner",
    },

    contractorProfile: {
      type: contractorProfileSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
