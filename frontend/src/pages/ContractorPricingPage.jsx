
import { useEffect, useState } from "react";
import {
  getContractorPricing,
  updateContractorPricing,
} from "../services/api";

const initialPricing = {
  roofing: {
    materialRatePerSqFt: 0,
    labourRatePerSqFt: 0,
  },
  painting: {
    materialRatePerSqFt: 0,
    labourRatePerSqFt: 0,
    coverageSqFtPerLitre: 100,
    coats: 2,
  },
};

export default function ContractorPricingPage() {
  const [pricing, setPricing] = useState(initialPricing);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const data = await getContractorPricing();

        if (data.pricing) {
          setPricing({
            roofing: {
              ...initialPricing.roofing,
              ...data.pricing.roofing,
            },
            painting: {
              ...initialPricing.painting,
              ...data.pricing.painting,
            },
          });
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load contractor pricing."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPricing();
  }, []);

  const handleChange = (section, field, value) => {
    setPricing((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const values = [
      pricing.roofing.materialRatePerSqFt,
      pricing.roofing.labourRatePerSqFt,
      pricing.painting.materialRatePerSqFt,
      pricing.painting.labourRatePerSqFt,
      pricing.painting.coverageSqFtPerLitre,
      pricing.painting.coats,
    ];

    if (
      values.some(
        (value) =>
          value === "" ||
          !Number.isFinite(Number(value)) ||
          Number(value) < 0
      )
    ) {
      setError("Enter valid non-negative pricing values.");
      return;
    }

    if (Number(pricing.painting.coverageSqFtPerLitre) <= 0) {
      setError("Paint coverage must be greater than zero.");
      return;
    }

    const coats = Number(pricing.painting.coats);

    if (!Number.isInteger(coats) || coats < 1 || coats > 10) {
      setError("Paint coats must be a whole number between 1 and 10.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        roofing: {
          materialRatePerSqFt: Number(
            pricing.roofing.materialRatePerSqFt
          ),
          labourRatePerSqFt: Number(
            pricing.roofing.labourRatePerSqFt
          ),
        },
        painting: {
          materialRatePerSqFt: Number(
            pricing.painting.materialRatePerSqFt
          ),
          labourRatePerSqFt: Number(
            pricing.painting.labourRatePerSqFt
          ),
          coverageSqFtPerLitre: Number(
            pricing.painting.coverageSqFtPerLitre
          ),
          coats,
        },
      };

      const data = await updateContractorPricing(payload);

      setPricing({
        roofing: {
          ...initialPricing.roofing,
          ...data.pricing.roofing,
        },
        painting: {
          ...initialPricing.painting,
          ...data.pricing.painting,
        },
      });

      setSuccess("Pricing saved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save pricing. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (
    section,
    field,
    label,
    suffix = "₹ / sq. ft."
  ) => (
    <div className="col-md-6 mb-3">
      <label className="form-label fw-medium">{label}</label>

      <div className="input-group">
        <input
          type="number"
          min="0"
          step="0.01"
          className="form-control"
          value={pricing[section][field]}
          onChange={(e) =>
            handleChange(section, field, e.target.value)
          }
          required
        />

        <span className="input-group-text">{suffix}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container py-5">
        Loading pricing details...
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="mb-4">
            <h2 className="fw-bold">Contractor Pricing</h2>
            <p className="text-muted">
              Configure your material and labour rates.
              These rates will be used to calculate project estimates.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {success && (
            <div className="alert alert-success">{success}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Roofing Pricing */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-1">
                  Roofing Pricing
                </h5>

                <p className="text-muted small mb-4">
                  Enter the material and labour costs for roofing
                  work.
                </p>

                <div className="row">
                  {renderInput(
                    "roofing",
                    "materialRatePerSqFt",
                    "Roofing Material Rate"
                  )}

                  {renderInput(
                    "roofing",
                    "labourRatePerSqFt",
                    "Roofing Labour Rate"
                  )}
                </div>
              </div>
            </div>

            {/* Painting Pricing */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-1">
                  Painting Pricing
                </h5>

                <p className="text-muted small mb-4">
                  Configure your painting material, labour,
                  coverage and coat details.
                </p>

                <div className="row">
                  {renderInput(
                    "painting",
                    "materialRatePerSqFt",
                    "Painting Material Rate"
                  )}

                  {renderInput(
                    "painting",
                    "labourRatePerSqFt",
                    "Painting Labour Rate"
                  )}

                  {renderInput(
                    "painting",
                    "coverageSqFtPerLitre",
                    "Paint Coverage",
                    "sq. ft. / litre"
                  )}

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium">
                      Number of Coats
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      className="form-control"
                      value={pricing.painting.coats}
                      onChange={(e) =>
                        handleChange(
                          "painting",
                          "coats",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Pricing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
