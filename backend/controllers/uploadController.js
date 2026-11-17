
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

  return response.text || "No image analysis was returned.";
}

// ==========================================
// BACKGROUND IMAGE ANALYSIS
// ==========================================

async function processImageAnalysis({
  buffer,
  mimeType,
  serviceType,
  requestId,
  publicId,
}) {
  try {
    console.log("Starting Gemini image analysis...");

    const analysis = await analyzeHouseImage(
      buffer,
      mimeType,
      serviceType
    );

    await EstimationRequest.updateOne(
      {
        _id: requestId,
        "images.publicId": publicId,
      },
      {
        $set: {
          "images.$.analysis": analysis,
        },
      }
    );

    console.log("Gemini analysis completed and saved.");
  } catch (error) {
    console.error(
      "Gemini Background Analysis Error:",
      error.message
    );

    try {
      await EstimationRequest.updateOne(
        {
          _id: requestId,
          "images.publicId": publicId,
        },
        {
          $set: {
            "images.$.analysis":
              "Image saved successfully, but Gemini analysis failed. Please try again later.",
          },
        }
      );
    } catch (dbError) {
      console.error(
        "Failed to update image analysis status:",
        dbError.message
      );
    }
  }
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

    console.log("1. Image received by backend.");

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

    console.log("2. Estimation request found.");

    // Preserve image data for background processing
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const serviceType = request.serviceType;
    const requestId = request._id;

    // Upload image to Cloudinary
    const uploadedImage = await uploadToCloudinary(
      imageBuffer
    );

    console.log("3. Cloudinary upload completed.");

    // Save image in MongoDB first
    request.images.push({
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      analysis: "Image uploaded. AI analysis is processing...",
    });

    await request.save();

    const savedImage =
      request.images[request.images.length - 1];

    console.log("4. Image saved in MongoDB.");

    // Respond immediately without waiting for Gemini
    res.status(201).json({
      success: true,
      message:
        "Image uploaded successfully. AI analysis is processing.",
      image: savedImage,
    });

    // Run Gemini analysis in the background
    processImageAnalysis({
      buffer: imageBuffer,
      mimeType,
      serviceType,
      requestId,
      publicId: uploadedImage.public_id,
    });

  } catch (error) {
    console.error("Image Upload Error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed. Please try again.",
      });
    }
  }
};
