
import { useEffect, useState } from "react";
import { getContractorProfile, updateContractorProfile } from "../services/api";

const initialForm = {
  businessName: "",
  phone: "",
  services: [],
  experienceYears: 0,
  serviceAreas: [],
  description: "",
};

export default function ContractorProfilePage() {
  const [form, setForm] = useState(initialForm);
  const [areaInput, setAreaInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getContractorProfile();
        const profile = data.profile?.contractorProfile || {};

        setForm({
          businessName: profile.businessName || "",
          phone: profile.phone || "",
          services: profile.services || [],
          experienceYears: profile.experienceYears || 0,
          serviceAreas: profile.serviceAreas || [],
          description: profile.description || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load contractor profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (service) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((item) => item !== service)
        : [...prev.services, service],
    }));
  };

  const addArea = () => {
    const area = areaInput.trim();

    if (!area) return;

    if (
      form.serviceAreas.some(
        (existing) => existing.toLowerCase() === area.toLowerCase()
      )
    ) {
      setAreaInput("");
      return;
    }

    setForm((prev) => ({
      ...prev,
      serviceAreas: [...prev.serviceAreas, area],
    }));

    setAreaInput("");
  };

  const removeArea = (areaToRemove) => {
    setForm((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter(
        (area) => area !== areaToRemove
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateContractorProfile({
        ...form,
        experienceYears: Number(form.experienceYears),
      });

      setSuccess("Contractor profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update contractor profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container py-5">Loading profile...</div>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="mb-4">
            <h2 className="fw-bold">Contractor Profile</h2>
            <p className="text-muted">
              Manage your business details and the services you provide.
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-semibold mb-3">Business Information</h5>

                <div className="mb-3">
                  <label className="form-label">Business Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    name="experienceYears"
                    value={form.experienceYears}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Business Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your business and experience"
                  />
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-semibold mb-3">Services Offered</h5>

                {["roofing", "painting"].map((service) => (
                  <div className="form-check mb-2" key={service}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={service}
                      checked={form.services.includes(service)}
                      onChange={() => handleServiceChange(service)}
                    />
                    <label className="form-check-label" htmlFor={service}>
                      {service.charAt(0).toUpperCase() + service.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-semibold mb-3">Service Areas</h5>

                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                    placeholder="Enter a city or service area"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArea();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={addArea}
                  >
                    Add Area
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {form.serviceAreas.map((area) => (
                    <span
                      className="badge bg-light text-dark border p-2"
                      key={area}
                    >
                      {area}
                      <button
                        type="button"
                        className="btn-close ms-2"
                        style={{ fontSize: "9px" }}
                        aria-label={`Remove ${area}`}
                        onClick={() => removeArea(area)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
