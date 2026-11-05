
const multer = require("multer");

const {
  cloudinary,
  cloudinaryConfigured,
} = require("../config/cloudinary");

const EstimationRequest = require("../models/EstimationRequest");
const gemini = require("../config/gemini");

// ==========================================
// IMAGE UPLOAD CONFIGURATION
// ==========================================

exports.upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 8 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
      );
    }
  },
});

// ==========================================
// UPLOAD IMAGE TO CLOUDINARY
// ==========================================

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "home-service-estimator",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

// ==========================================
// GEMINI IMAGE ANALYSIS
// ==========================================

async function analyzeHouseImage(
  buffer,
  mimeType,
  serviceType
) {
  if (!process.env.GEMINI_API_KEY) {
    return "Image uploaded successfully. Gemini API key is not configured.";
  }

  if (!process.env.GEMINI_MODEL) {
    return "Image uploaded successfully. Gemini model is not configured.";
  }

  const base64Image = buffer.toString("base64");

  const response = await gemini.models.generateContent({
    model: process.env.GEMINI_MODEL,

    contents: [
      {
        role: "user",

        parts: [
          {
            text: `
You are a professional home-service property image analyst.

Analyse this house photograph for a ${serviceType} project.

Provide the analysis using these headings:

1. Visible Property Features
2. Roof Type and Material
3. Exterior Wall Conditions
4. Visible Signs of Deterioration
5. Possible Maintenance Requirements
6. Additional Information Required for Estimation

Important rules:

- Do not invent measurements or dimensions.
- Do not calculate roof area from an ordinary photograph.
- Do not invent prices or material quantities.
- Do not claim to detect hidden structural damage.
- Clearly mention when something cannot be identified.
- Only describe visually observable features.
- Recommend professional inspection when necessary.
            `,
          },

          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
        ],
      },
    ],
  });

  return (
    response.text ||
    "No image analysis was returned."
  );
}

// ==========================================
// SAVE IMAGE AND AI ANALYSIS
// ==========================================

exports.saveImage = async (req, res) => {
  try {
    // Check Cloudinary configuration
    if (!cloudinaryConfigured) {
      return res.status(503).json({
        success: false,
        message: "Cloudinary is not configured.",
      });
    }

    // Check uploaded image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please choose an image.",
      });
    }

    // Find homeowner's estimation request
    const request = await EstimationRequest.findOne({
      _id: req.params.id,
      homeowner: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Estimation request not found.",
      });
    }

    // 1. Upload image to Cloudinary
    const uploadedImage = await uploadToCloudinary(
      req.file.buffer
    );

    let analysis =
      "Image uploaded successfully. Analysis is not available.";

    // 2. Analyse image using Gemini
    try {
      analysis = await analyzeHouseImage(
        req.file.buffer,
        req.file.mimetype,
         request.serviceType
      );
    } catch (error) {
      console.error(
        "Gemini Image Analysis Error:",
        error.message
      );

      analysis =
        "Image saved successfully, but Gemini analysis failed. Please try again later.";
    }

    // 3. Save image and analysis in MongoDB
    request.images.push({
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      analysis: analysis,
    });

    await request.save();

    // 4. Send response
    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      image: request.images[
        request.images.length - 1
      ],
    });

  } catch (error) {
    console.error(
      "Image Upload Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Image upload failed. Please try again.",
    });
  }
};
