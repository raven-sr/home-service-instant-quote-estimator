
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const Quotation = require("../models/Quotation");

exports.downloadQuotationPDF = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate quotation ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quotation ID.",
      });
    }

    // Restrict access based on logged-in user's role
    let filter = { _id: id };

    if (req.user.role === "homeowner") {
      filter.homeowner = req.user._id;
    } else if (req.user.role === "contractor") {
      filter.contractor = req.user._id;
    } else if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to download this quotation.",
      });
    }

    // Fetch quotation with related details
    const quotation = await Quotation.findOne(filter)
      .populate("homeowner", "name email")
      .populate("contractor", "name email")
      .populate("estimationRequest");

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found.",
      });
    }

    const request = quotation.estimationRequest;

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=quotation-${quotation._id}.pdf`
    );

    doc.pipe(res);

    // Header
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("HOME SERVICE QUOTATION", { align: "center" });

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Quotation ID: ${quotation._id}`);

    doc.text(
      `Date: ${new Date(quotation.createdAt).toLocaleDateString("en-IN")}`
    );

    doc.moveDown();

    // Property details
    doc.fontSize(14).font("Helvetica-Bold").text("Property Details");
    doc.moveDown(0.5);

    doc.fontSize(11).font("Helvetica");
    doc.text(`Service: ${quotation.serviceType.toUpperCase()}`);
    doc.text(`Address: ${request?.propertyAddress || "Not available"}`);

    doc.moveDown();

    // Homeowner details
    doc.fontSize(14).font("Helvetica-Bold").text("Homeowner Details");
    doc.moveDown(0.5);

    doc.fontSize(11).font("Helvetica");
    doc.text(`Name: ${quotation.homeowner?.name || "Not available"}`);
    doc.text(`Email: ${quotation.homeowner?.email || "Not available"}`);

    doc.moveDown();

    // Contractor details
    doc.fontSize(14).font("Helvetica-Bold").text("Contractor Details");
    doc.moveDown(0.5);

    doc.fontSize(11).font("Helvetica");
    doc.text(`Name: ${quotation.contractor?.name || "Not available"}`);
    doc.text(`Email: ${quotation.contractor?.email || "Not available"}`);

    doc.moveDown();

    // Measurements
    doc.fontSize(14).font("Helvetica-Bold").text("Verified Measurements");
    doc.moveDown(0.5);

    doc.fontSize(11).font("Helvetica");

    if (quotation.serviceType === "roofing") {
      doc.text(
        `Length: ${quotation.measurements?.length ?? "N/A"} ft`
      );
      doc.text(
        `Width: ${quotation.measurements?.width ?? "N/A"} ft`
      );
      doc.text(
        `Roof Area: ${quotation.measurements?.roofArea ?? "N/A"} sqft`
      );
      doc.text(
        `Billable Area: ${quotation.material?.billableArea ?? "N/A"} sqft`
      );
      doc.text(
        `Wastage: ${quotation.material?.wastagePercentage ?? 0}%`
      );
    } else {
      doc.text(
        `Paintable Area: ${
          quotation.paintingMeasurements?.paintableArea ?? "N/A"
        } sqft`
      );
      doc.text(
        `Paint Coverage: ${
          quotation.paint?.coverageSqFtPerLitre ?? "N/A"
        } sqft/litre`
      );
      doc.text(`Coats: ${quotation.paint?.coats ?? "N/A"}`);
      doc.text(
        `Paint Quantity: ${
          quotation.paint?.quantityLitres ?? "N/A"
        } litres`
      );
    }

    doc.moveDown();

    // Cost breakdown
    doc.fontSize(14).font("Helvetica-Bold").text("Cost Breakdown");
    doc.moveDown(0.5);

    doc.fontSize(11).font("Helvetica");

    doc.text(
      `Material Rate: Rs. ${quotation.material?.ratePerSqFt ?? 0} / sqft`
    );
    doc.text(
      `Material Cost: Rs. ${quotation.material?.cost ?? 0}`
    );
    doc.moveDown(0.3);

    doc.text(
      `Labour Rate: Rs. ${quotation.labour?.ratePerSqFt ?? 0} / sqft`
    );
    doc.text(
      `Labour Cost: Rs. ${quotation.labour?.cost ?? 0}`
    );

    doc.moveDown();

    // Total
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(
        `TOTAL ESTIMATED COST: Rs. ${Number(
          quotation.totalCost
        ).toLocaleString("en-IN")}`,
        { align: "right" }
      );

    doc.moveDown(2);

    doc
      .fontSize(9)
      .font("Helvetica")
      .text(
        "This quotation is based on contractor-verified measurements and the pricing available at the time of calculation."
      );

    doc.moveDown();

    doc.text("Thank you for using our Home Service Estimator.", {
      align: "center",
    });

    doc.end();
  } catch (error) {
    console.error("Download quotation PDF error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to generate quotation PDF.",
      });
    }

    res.destroy(error);
  }
};
