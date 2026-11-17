
exports.calculatePaintingEstimate = ({
  area,
  materialRatePerSqFt,
  labourRatePerSqFt,
  coverageSqFtPerLitre,
  coats,
}) => {
  const values = {
    area: Number(area),
    materialRatePerSqFt: Number(materialRatePerSqFt),
    labourRatePerSqFt: Number(labourRatePerSqFt),
    coverageSqFtPerLitre: Number(coverageSqFtPerLitre),
    coats: Number(coats),
  };

  const {
    area: verifiedArea,
    materialRatePerSqFt: materialRate,
    labourRatePerSqFt: labourRate,
    coverageSqFtPerLitre: coverage,
    coats: numberOfCoats,
  } = values;

  // Validate inputs
  if (
    !Number.isFinite(verifiedArea) ||
    !Number.isFinite(materialRate) ||
    !Number.isFinite(labourRate) ||
    !Number.isFinite(coverage) ||
    !Number.isFinite(numberOfCoats)
  ) {
    throw new Error("Invalid painting calculation values.");
  }

  if (
    verifiedArea <= 0 ||
    materialRate <= 0 ||
    labourRate <= 0 ||
    coverage <= 0
  ) {
    throw new Error("All measurements and rates must be greater than zero.");
  }

  if (
    !Number.isInteger(numberOfCoats) ||
    numberOfCoats < 1 ||
    numberOfCoats > 10
  ) {
    throw new Error("Coats must be between 1 and 10.");
  }

  // Calculate paint quantity
  const paintQuantity =
    (verifiedArea * numberOfCoats) / coverage;

  // Calculate costs
  const materialCost =
    verifiedArea * materialRate;

  const labourCost =
    verifiedArea * labourRate;

  const totalCost =
    materialCost + labourCost;

  return {
    measurements: {
      verifiedArea: Number(verifiedArea.toFixed(2)),
      unit: "sqft",
    },

    paint: {
      coverageSqFtPerLitre: coverage,
      coats: numberOfCoats,
      quantityLitres: Number(paintQuantity.toFixed(2)),
    },

    material: {
      ratePerSqFt: materialRate,
      cost: Number(materialCost.toFixed(2)),
    },

    labour: {
      ratePerSqFt: labourRate,
      cost: Number(labourCost.toFixed(2)),
    },

    currency: "INR",

    totalCost: Number(totalCost.toFixed(2)),
  };
};
