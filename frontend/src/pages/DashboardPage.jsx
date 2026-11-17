
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaPlus,
  FaHome,
  FaPaintRoller,
  FaClock,
  FaArrowRight,
  FaMapMarkerAlt,
  FaClipboardList,
  FaCheckCircle,
  FaHourglassHalf,
  FaExclamationCircle,
  FaSyncAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";

import {
  getMyQuotations,
  downloadQuotationPDF,
} from "../services/api";

import api from "../services/api";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [quotations, setQuotations] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  // DOWNLOAD QUOTATION PDF
  const handleDownloadPDF = async (quotationId) => {
    try {
      setError("");
      setDownloadingId(quotationId);

      await downloadQuotationPDF(quotationId);
    } catch (error) {
      console.error("PDF download error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to download quotation PDF."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // FETCH REQUESTS AND QUOTATIONS
  const fetchDashboardData = async () => {
    try {
      setError("");

      const [requestResponse, quotationResponse] =
        await Promise.all([
          api.get("/estimations"),
          getMyQuotations(),
        ]);

      const requests = requestResponse.data.requests || [];
      const quotationList = quotationResponse.quotations || [];

      setItems(requests);

      // Match quotations with estimation request IDs
      const quotationMap = {};

      quotationList.forEach((quotation) => {
        const requestId =
          typeof quotation.estimationRequest === "object"
            ? quotation.estimationRequest?._id
            : quotation.estimationRequest;

        if (requestId) {
          quotationMap[requestId] = quotation;
        }
      });

      setQuotations(quotationMap);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // DASHBOARD STATISTICS
  const totalRequests = items.length;

  const roofingCount = items.filter(
    (x) => x.serviceType?.toLowerCase() === "roofing"
  ).length;

  const paintingCount = items.filter(
    (x) => x.serviceType?.toLowerCase() === "painting"
  ).length;

  const pendingCount = items.filter((x) =>
    ["submitted", "under_review", "awaiting_measurements"].includes(
      x.status?.toLowerCase()
    )
  ).length;

  const quotationCount = Object.keys(quotations).length;

  // STATUS STYLING
  const getStatus = (status) => {
    const value = status?.toLowerCase();

    if (
      value === "quoted" ||
      value === "completed" ||
      value === "approved"
    ) {
      return {
        className: "status-completed",
        icon: <FaCheckCircle />,
        label: status,
      };
    }

    if (value === "submitted" || value === "pending") {
      return {
        className: "status-pending",
        icon: <FaHourglassHalf />,
        label: status,
      };
    }

    if (value === "rejected" || value === "cancelled") {
      return {
        className: "status-rejected",
        icon: <FaExclamationCircle />,
        label: status,
      };
    }

    return {
      className: "status-progress",
      icon: <FaClock />,
      label: status || "In progress",
    };
  };

  // SERVICE ICON
  const getServiceIcon = (serviceType) => {
    return serviceType?.toLowerCase() === "roofing" ? (
      <FaHome />
    ) : (
      <FaPaintRoller />
    );
  };

  // CURRENCY FORMAT
  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  if (loading) {
    return (
      <div className="container py-5">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container py-5">

        {/* DASHBOARD HEADER */}
        <div className="dashboard-header d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="dashboard-eyebrow">
              HOMEOWNER WORKSPACE
            </span>

            <h2>My Dashboard</h2>

            <p>
              Manage your home improvement projects and estimation requests.
            </p>
          </div>

          <Link
            to="/new-estimate"
            className="btn dashboard-primary-btn"
          >
            <FaPlus />
            New Estimate
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center justify-content-between">
            <span>{error}</span>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={fetchDashboardData}
            >
              <FaSyncAlt /> Retry
            </button>
          </div>
        )}

        {/* STATISTICS */}
        <div className="row g-3 mb-5">

          <div className="col-6 col-lg-3">
            <div className="dashboard-stat-card">
              <div className="stat-icon stat-blue">
                <FaClipboardList />
              </div>

              <span>Total Requests</span>
              <h3>{totalRequests}</h3>
              <small>All your projects</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="dashboard-stat-card">
              <div className="stat-icon stat-purple">
                <FaHome />
              </div>

              <span>Roofing</span>
              <h3>{roofingCount}</h3>
              <small>Roofing projects</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="dashboard-stat-card">
              <div className="stat-icon stat-orange">
                <FaPaintRoller />
              </div>

              <span>Painting</span>
              <h3>{paintingCount}</h3>
              <small>Painting projects</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="dashboard-stat-card">
              <div className="stat-icon stat-green">
                <FaHourglassHalf />
              </div>

              <span>Pending</span>
              <h3>{pendingCount}</h3>
              <small>Awaiting next steps</small>
            </div>
          </div>

        </div>

        {/* REQUESTS HEADING */}
        <div className="dashboard-section-heading">
          <div>
            <h4>My Estimation Requests</h4>
            <p>Track and manage your home service projects.</p>
          </div>

          <span className="request-count">
            {totalRequests}{" "}
            {totalRequests === 1 ? "Project" : "Projects"}
          </span>
        </div>

        {/* EMPTY STATE */}
        {items.length === 0 && (
          <div className="dashboard-empty-state">
            <div className="empty-icon">
              <FaHome />
            </div>

            <h4>No projects yet</h4>

            <p>
              Start your first roofing or painting project.
              Your estimation requests will appear here.
            </p>

            <Link
              to="/new-estimate"
              className="btn dashboard-primary-btn"
            >
              <FaPlus />
              Create Your First Estimate
            </Link>
          </div>
        )}

        {/* REQUEST CARDS */}
        {items.length > 0 && (
          <div className="row g-4">
            {items.map((item) => {
              const status = getStatus(item.status);
              const quotation = quotations[item._id];

              return (
                <div
                  className="col-md-6 col-xl-4"
                  key={item._id}
                >
                  <div className="request-card">

                    <div className="request-card-top">
                      <div className="request-service-icon">
                        {getServiceIcon(item.serviceType)}
                      </div>

                      <span className={`request-status ${status.className}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>

                    <div className="request-card-content">
                      <span className="request-category">
                        HOME SERVICE PROJECT
                      </span>

                      <h5 className="text-capitalize">
                        {item.serviceType} Estimate
                      </h5>

                      <div className="request-address">
                        <FaMapMarkerAlt />
                        <span>
                          {item.propertyAddress || "Address not provided"}
                        </span>
                      </div>
                    </div>

                    <div className="request-card-footer">
                      <span>View project details</span>

                      <Link
                        to={`/requests/${item._id}`}
                        className="request-open-link"
                        aria-label={`Open ${item.serviceType} request`}
                      >
                        <FaArrowRight />
                      </Link>
                    </div>

                    {/* QUOTATION DETAILS */}
                    {quotation && (
                      <div className="border rounded p-3 mt-3">

                        <div className="d-flex align-items-center gap-2 mb-3">
                          <FaFileInvoiceDollar className="text-success" />

                          <h6 className="fw-bold mb-0">
                            Contractor Quotation
                          </h6>
                        </div>

                        {item.serviceType === "roofing" && (
                          <p className="mb-2 small">
                            <strong>Roof Area:</strong>{" "}
                            {quotation.measurements?.roofArea ?? "—"} sq. ft.
                          </p>
                        )}

                        {item.serviceType === "painting" && (
                          <p className="mb-2 small">
                            <strong>Paintable Area:</strong>{" "}
                            {quotation.paintingMeasurements?.paintableArea ??
                              quotation.measurements?.verifiedArea ??
                              "—"} sq. ft.
                          </p>
                        )}

                        <p className="mb-2 small">
                          <strong>Material Cost:</strong>{" "}
                          ₹{formatCurrency(quotation.material?.cost)}
                        </p>

                        <p className="mb-2 small">
                          <strong>Labour Cost:</strong>{" "}
                          ₹{formatCurrency(quotation.labour?.cost)}
                        </p>

                        {quotation.paint?.quantityLitres && (
                          <p className="mb-2 small">
                            <strong>Paint Required:</strong>{" "}
                            {quotation.paint.quantityLitres} litres
                          </p>
                        )}

                        <hr />

                        <div className="d-flex justify-content-between align-items-center">
                          <strong>Estimated Total</strong>

                          <h5 className="text-success fw-bold mb-0">
                            ₹{formatCurrency(quotation.totalCost)}
                          </h5>
                        </div>

                        <span className="badge bg-success mt-3">
                          Quotation Available
                        </span>

                        {/* DOWNLOAD PDF BUTTON */}
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm w-100 mt-3"
                          onClick={() =>
                            handleDownloadPDF(quotation._id)
                          }
                          disabled={downloadingId === quotation._id}
                        >
                          {downloadingId === quotation._id
                            ? "Generating PDF..."
                            : "Download Quotation PDF"}
                        </button>

                      </div>
                    )}

                    {!quotation && item.status === "quoted" && (
                      <div className="alert alert-warning mt-3 mb-0 small">
                        Your request is marked as quoted, but quotation
                        details could not be loaded.
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* QUOTATION SUMMARY */}
        <div className="dashboard-section-heading mt-5">
          <div>
            <h4>My Quotations</h4>
            <p>Review estimates prepared by your contractors.</p>
          </div>

          <span className="request-count">
            {quotationCount}{" "}
            {quotationCount === 1 ? "Quotation" : "Quotations"}
          </span>
        </div>

        {quotationCount === 0 && (
          <div className="panel p-4 text-center">
            <FaFileInvoiceDollar className="fs-2 text-secondary mb-2" />

            <h5>No quotations available yet</h5>

            <p className="text-muted mb-0">
              When a contractor prepares a quotation for your request,
              it will appear here.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
