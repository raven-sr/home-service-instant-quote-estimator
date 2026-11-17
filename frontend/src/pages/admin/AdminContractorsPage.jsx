
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminContractorsPage() {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContractors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/contractors");

      setContractors(response.data.contractors || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load contractors."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Contractors Management</h2>
          <p className="text-muted mb-0">
            View registered contractors and their business profiles.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchContractors}
        >
          Refresh
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-1">Total Contractors</h5>
          <h2 className="fw-bold mb-0">
            {loading ? "..." : contractors.length}
          </h2>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-2">Loading contractors...</p>
        </div>
      ) : contractors.length === 0 ? (
        <div className="alert alert-info">
          No contractors registered yet.
        </div>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Contractor</th>
                <th>Email</th>
                <th>Business Name</th>
                <th>Phone</th>
                <th>Services</th>
                <th>Experience</th>
                <th>Service Areas</th>
              </tr>
            </thead>

            <tbody>
              {contractors.map((contractor) => {
                const profile = contractor.contractorProfile || {};

                return (
                  <tr key={contractor._id}>
                    <td className="fw-semibold">
                      {contractor.name || "—"}
                    </td>

                    <td>{contractor.email || "—"}</td>

                    <td>{profile.businessName || "—"}</td>

                    <td>{profile.phone || "—"}</td>

                    <td>
                      {profile.services?.length > 0 ? (
                        profile.services.map((service) => (
                          <span
                            key={service}
                            className="badge bg-primary-subtle text-primary me-1 text-capitalize"
                          >
                            {service}
                          </span>
                        ))
                      ) : (
                        "—"
                      )}
                    </td>

                    <td>
                      {profile.experienceYears != null
                        ? `${profile.experienceYears} years`
                        : "—"}
                    </td>

                    <td>
                      {profile.serviceAreas?.length > 0
                        ? profile.serviceAreas.join(", ")
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
