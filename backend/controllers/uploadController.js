
const multer = require("multer");

const {
  cloudinary,
  cloudinaryConfigured,
} = require("../config/cloudinary");

const EstimationRequest = require("../models/EstimationRequest");
const gemini = require("../config/gemini");

// Image upload configuration
exports.upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 8 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

// Upload image to Cloudinary
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

// Analyse house image using Gemini
async function analyzeHouseImage(imageUrl, serviceType) {
  if (!process.env.GEMINI_API_KEY) {
    return "Image uploaded successfully. Gemini API key is not configured.";
  }

  const response = await gemini.models.generateContent({
    model: process.env.GEMINI_MODEL,

    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
You are a home-service property image analyst.

Analyse this house photograph for a ${serviceType} project.

Provide:
1. Visible property features.
2. Roof type and visible roofing material, if identifiable.
3. Visible exterior wall conditions.
4. Visible signs of deterioration.
5. Possible maintenance requirements.
6. Additional information required to prepare an estimate.

Important rules:
- Do not invent measurements or dimensions.
- Do not calculate roof area from an ordinary photograph.
- Do not invent prices or material quantities.
- Do not claim to detect hidden structural damage.
- Clearly mention when something cannot be identified.
            `,
          },
          {
            fileData: {
              fileUri: imageUrl,
              mimeType: "image/jpeg",
            },
          },
        ],
      },
    ],
  });

  return response.text || "No image analysis was returned.";
}

// Save image and AI analysis
exports.saveImage = async (req, res) => {
  try {
    if (!cloudinaryConfigured) {
      return res.status(503).json({
        success: false,
        message: "Configure Cloudinary in backend/.env",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please choose an image.",
      });
    }

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
        uploadedImage.secure_url,
        request.serviceType
      );
    } catch (error) {
      console.error("Gemini Image Analysis Error:", error.message);

      analysis =
        "Image saved successfully, but Gemini analysis failed: " +
        error.message;
    }

    // 3. Save image and analysis in MongoDB
    request.images.push({
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      analysis,
    });

    await request.save();

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      image: request.images[request.images.length - 1],
    });

  } catch (error) {
    console.error("Image Upload Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Image upload failed.",
    });
  }
};
