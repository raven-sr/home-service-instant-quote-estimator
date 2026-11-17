
exports.calculateRoofingEstimate = ({
  length,
  width,
  wastagePercentage = 0,
  materialRatePerSqFt,
  labourRatePerSqFt,
}) => {
  const values = {
    length: Number(length),
    width: Number(width),
    wastagePercentage: Number(wastagePercentage),
    materialRatePerSqFt: Number(materialRatePerSqFt),
    labourRatePerSqFt: Number(labourRatePerSqFt),
  };

  for (const [key, value] of Object.entries(values)) {
    if (!Number.isFinite(value)) {
      throw new Error(`${key} must be a valid number.`);
    }
  }

  if (values.length <= 0 || values.width <= 0) {
    throw new Error("Length and width must be greater than zero.");
  }

  if (
    values.wastagePercentage < 0 ||
    values.wastagePercentage > 100
  ) {
    throw new Error("Wastage percentage must be between 0 and 100.");
  }

  if (
    values.materialRatePerSqFt <= 0 ||
    values.labourRatePerSqFt <= 0
  ) {
    throw new Error(
      "Contractor material and labour rates must be configured."
    );
  }

  const roofArea = values.length * values.width;

  const materialArea =
    roofArea * (1 + values.wastagePercentage / 100);

  const materialCost =
    materialArea * values.materialRatePerSqFt;

  const labourCost =
    roofArea * values.labourRatePerSqFt;

  const totalCost = materialCost + labourCost;

  return {
    measurements: {
      length: values.length,
      width: values.width,
      unit: "ft",
      roofArea: Number(roofArea.toFixed(2)),
    },

    material: {
      wastagePercentage: values.wastagePercentage,
      billableArea: Number(materialArea.toFixed(2)),
      ratePerSqFt: values.materialRatePerSqFt,
      cost: Number(materialCost.toFixed(2)),
    },

    labour: {
      ratePerSqFt: values.labourRatePerSqFt,
      cost: Number(labourCost.toFixed(2)),
    },

    currency: "INR",
    totalCost: Number(totalCost.toFixed(2)),
  };
};
