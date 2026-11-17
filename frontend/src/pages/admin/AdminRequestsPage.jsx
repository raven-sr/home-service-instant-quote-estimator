
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [serviceType, setServiceType] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/requests", {
        params: {
          status,
          serviceType,
        },
      });

      setRequests(response.data.requests || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load estimation requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [status, serviceType]);

  const getStatusBadge = (value) => {
    const colors = {
      submitted: "primary",
      under_review: "warning",
      awaiting_measurements: "info",
      quoted: "success",
      cancelled: "danger",
    };

    return (
      <span
        className={`badge bg-${colors[value] || "secondary"} text-capitalize`}
      >
        {value?.replaceAll("_", " ") || "Unknown"}
      </span>
    );
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Estimation Requests</h2>
          <p className="text-muted mb-0">
            Monitor all homeowner estimation requests.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchRequests}
        >
          Refresh
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label">Filter by service</label>
          <select
            className="form-select"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="">All services</option>
            <option value="roofing">Roofing</option>
            <option value="painting">Painting</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Filter by status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="awaiting_measurements">
              Awaiting Measurements
            </option>
            <option value="quoted">Quoted</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-2">Loading requests...</p>
        </div>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Request ID</th>
                <th>Homeowner</th>
                <th>Service</th>
                <th>Property Address</th>
                <th>Assigned Contractor</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>

            <tbody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request._id}>
                    <td>
                      <small className="text-muted">
                        {request._id.slice(-8).toUpperCase()}
                      </small>
                    </td>

                    <td>
                      <div className="fw-semibold">
                        {request.homeowner?.name || "—"}
                      </div>
                      <small className="text-muted">
                        {request.homeowner?.email || ""}
                      </small>
                    </td>

                    <td>
                      <span className="badge bg-light text-dark text-capitalize">
                        {request.serviceType || "—"}
                      </span>
                    </td>

                    <td>
                      {request.propertyAddress || "—"}
                    </td>

                    <td>
                      {request.assignedContractor?.name || "Not assigned"}
                    </td>

                    <td>{getStatusBadge(request.status)}</td>

                    <td>
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No estimation requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-muted mt-3 small">
        Showing {requests.length} request(s).
      </p>
    </div>
  );
}
