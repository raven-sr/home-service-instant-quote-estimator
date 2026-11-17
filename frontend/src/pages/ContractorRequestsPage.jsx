
import { useEffect, useState } from "react";

import {
  getContractorRequests,
  claimContractorRequest,
  verifyRoofMeasurements,
  calculateRoofingQuotation,
  verifyPaintingMeasurements,
  calculatePaintingQuotation,
  getMyQuotations,
} from "../services/api";

export default function ContractorRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [measurements, setMeasurements] = useState({});
  const [wastage, setWastage] = useState({});
  const [quotations, setQuotations] = useState({});

  // LOAD REQUESTS AND SAVED QUOTATIONS
  const loadRequests = async () => {
    try {
      setError("");

      const [requestData, quotationData] = await Promise.all([
        getContractorRequests(),
        getMyQuotations(),
      ]);

      setRequests(requestData.requests || []);

      // Restore saved quotations
      const quotationMap = {};

      (quotationData.quotations || []).forEach((quotation) => {
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
          "Unable to load contractor requests and quotations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // CLAIM REQUEST
  const handleClaim = async (requestId) => {
    setBusyId(requestId);
    setError("");
    setSuccess("");

    try {
      await claimContractorRequest(requestId);

      setSuccess("Request claimed successfully.");
      await loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to claim this request."
      );
    } finally {
      setBusyId("");
    }
  };

  // HANDLE MEASUREMENT INPUTS
  const handleMeasurementChange = (requestId, field, value) => {
    setMeasurements((prev) => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [field]: value,
      },
    }));
  };

  // VERIFY ROOF MEASUREMENTS
  const handleVerifyRoof = async (request) => {
    const values = measurements[request._id] || {};

    if (
      !values.length ||
      !values.width ||
      Number(values.length) <= 0 ||
      Number(values.width) <= 0
    ) {
      setError("Enter valid roof length and width.");
      return;
    }

    setBusyId(request._id);
    setError("");
    setSuccess("");

    try {
      await verifyRoofMeasurements(request._id, {
        length: Number(values.length),
        width: Number(values.width),
      });

      setSuccess("Roof measurements verified successfully.");
      await loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to verify roof measurements."
      );
    } finally {
      setBusyId("");
    }
  };

  // VERIFY PAINTING AREA
  const handleVerifyPainting = async (request) => {
    const area = Number(
      measurements[request._id]?.paintableArea
    );

    if (!Number.isFinite(area) || area <= 0) {
      setError("Enter a valid paintable area.");
      return;
    }

    setBusyId(request._id);
    setError("");
    setSuccess("");

    try {
      await verifyPaintingMeasurements(request._id, area);

      setSuccess("Painting area verified successfully.");
      await loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to verify painting area."
      );
    } finally {
      setBusyId("");
    }
  };

  // GENERATE ROOFING QUOTATION
  const handleCalculateRoofing = async (request) => {
    const wastagePercentage = Number(
      wastage[request._id] ?? 0
    );

    if (
      !Number.isFinite(wastagePercentage) ||
      wastagePercentage < 0 ||
      wastagePercentage > 100
    ) {
      setError("Wastage must be between 0 and 100.");
      return;
    }

    setBusyId(request._id);
    setError("");
    setSuccess("");

    try {
      await calculateRoofingQuotation(
        request._id,
        wastagePercentage
      );

      setSuccess("Roofing quotation generated successfully.");

      await loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to calculate roofing quotation."
      );
    } finally {
      setBusyId("");
    }
  };

  // GENERATE PAINTING QUOTATION
  const handleCalculatePainting = async (request) => {
    setBusyId(request._id);
    setError("");
    setSuccess("");

    try {
      await calculatePaintingQuotation(request._id);

      setSuccess("Painting quotation generated successfully.");

      await loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to calculate painting quotation."
      );
    } finally {
      setBusyId("");
    }
  };

  // FORMAT CURRENCY
  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  if (loading) {
    return (
      <div className="container py-5">
        Loading contractor requests...
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* PAGE HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold">Contractor Requests</h2>

          <p className="text-muted mb-0">
            Review roofing and painting requests and prepare quotations.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={loadRequests}
          disabled={Boolean(busyId)}
        >
          Refresh Requests
        </button>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* EMPTY STATE */}
      {requests.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <h5>No service requests available</h5>

            <p className="text-muted mb-0">
              New homeowner requests will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {requests.map((request) => {
            const isRoofing = request.serviceType === "roofing";
            const isPainting = request.serviceType === "painting";

            const isAssigned = Boolean(request.assignedContractor);
            const isQuoted = request.status === "quoted";

            const isVerified = isRoofing
              ? Boolean(request.propertyDetails?.measurementsVerified)
              : Boolean(
                  request.paintingMeasurements?.verifiedAt &&
                    request.paintingMeasurements?.verifiedBy
                );

            const quotation = quotations[request._id];

            return (
              <div className="col-12" key={request._id}>
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">

                    {/* REQUEST HEADER */}
                    <div className="d-flex flex-wrap justify-content-between gap-3">
                      <div>
                        <h5 className="fw-bold mb-1">
                          {isRoofing
                            ? "Roofing Request"
                            : "Painting Request"}
                        </h5>

                        <p className="text-muted mb-1">
                          {request.propertyAddress}
                        </p>

                        <small className="text-muted">
                          Request ID: {request._id}
                        </small>
                      </div>

                      <div className="d-flex gap-2 align-items-start">
                        <span
                          className={`badge ${
                            isRoofing
                              ? "bg-primary"
                              : "bg-info text-dark"
                          }`}
                        >
                          {request.serviceType}
                        </span>

                        <span className="badge bg-light text-dark border">
                          {request.status?.replaceAll("_", " ")}
                        </span>
                      </div>
                    </div>

                    <hr />

                    {/* HOMEOWNER DETAILS */}
                    <div className="row mb-3">
                      <div className="col-md-6 mb-2">
                        <strong>Homeowner:</strong>{" "}
                        {request.homeowner?.name || "Not available"}
                      </div>

                      <div className="col-md-6 mb-2">
                        <strong>Email:</strong>{" "}
                        {request.homeowner?.email || "Not available"}
                      </div>

                      <div className="col-12">
                        <strong>Description:</strong>{" "}
                        {request.description ||
                          "No description provided."}
                      </div>
                    </div>

                    {/* CLAIM REQUEST */}
                    {!isAssigned ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleClaim(request._id)}
                        disabled={Boolean(busyId)}
                      >
                        {busyId === request._id
                          ? "Claiming..."
                          : "Claim Request"}
                      </button>
                    ) : (
                      <>
                        <div className="alert alert-info">
                          This request is assigned to you.
                        </div>

                        {!isQuoted && (
                          <>
                            {/* ROOFING WORKFLOW */}
                            {isRoofing && (
                              <>
                                {!isVerified ? (
                                  <div className="border rounded p-3 mb-3">
                                    <h6 className="fw-bold">
                                      Verify Roof Measurements
                                    </h6>

                                    <p className="text-muted small">
                                      Enter the physically verified roof
                                      dimensions in feet.
                                    </p>

                                    <div className="row">
                                      <div className="col-md-5 mb-3">
                                        <label className="form-label">
                                          Length (ft)
                                        </label>

                                        <input
                                          type="number"
                                          min="0.01"
                                          step="0.01"
                                          className="form-control"
                                          value={
                                            measurements[request._id]?.length ||
                                            ""
                                          }
                                          onChange={(e) =>
                                            handleMeasurementChange(
                                              request._id,
                                              "length",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      <div className="col-md-5 mb-3">
                                        <label className="form-label">
                                          Width (ft)
                                        </label>

                                        <input
                                          type="number"
                                          min="0.01"
                                          step="0.01"
                                          className="form-control"
                                          value={
                                            measurements[request._id]?.width ||
                                            ""
                                          }
                                          onChange={(e) =>
                                            handleMeasurementChange(
                                              request._id,
                                              "width",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      <div className="col-md-2 d-flex align-items-end mb-3">
                                        <button
                                          className="btn btn-success w-100"
                                          onClick={() =>
                                            handleVerifyRoof(request)
                                          }
                                          disabled={Boolean(busyId)}
                                        >
                                          {busyId === request._id
                                            ? "Saving..."
                                            : "Verify"}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="alert alert-success">
                                    <strong>
                                      Measurements verified:
                                    </strong>{" "}
                                    {request.verifiedMeasurements?.length} ft ×{" "}
                                    {request.verifiedMeasurements?.width} ft ={" "}
                                    {request.propertyDetails?.verifiedArea} sq. ft.
                                  </div>
                                )}

                                {isVerified && (
                                  <div className="border rounded p-3">
                                    <h6 className="fw-bold">
                                      Generate Roofing Quotation
                                    </h6>

                                    <div className="row align-items-end">
                                      <div className="col-md-4 mb-3">
                                        <label className="form-label">
                                          Material Wastage (%)
                                        </label>

                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          step="0.1"
                                          className="form-control"
                                          value={wastage[request._id] ?? 0}
                                          onChange={(e) =>
                                            setWastage((prev) => ({
                                              ...prev,
                                              [request._id]: e.target.value,
                                            }))
                                          }
                                        />
                                      </div>

                                      <div className="col-md-4 mb-3">
                                        <button
                                          className="btn btn-primary"
                                          onClick={() =>
                                            handleCalculateRoofing(request)
                                          }
                                          disabled={Boolean(busyId)}
                                        >
                                          {busyId === request._id
                                            ? "Calculating..."
                                            : "Generate Quotation"}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            {/* PAINTING WORKFLOW */}
                            {isPainting && (
                              <>
                                {!isVerified ? (
                                  <div className="border rounded p-3 mb-3">
                                    <h6 className="fw-bold">
                                      Verify Painting Area
                                    </h6>

                                    <p className="text-muted small">
                                      Enter the physically verified paintable
                                      area in square feet.
                                    </p>

                                    <div className="row align-items-end">
                                      <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                          Paintable Area (sq. ft.)
                                        </label>

                                        <input
                                          type="number"
                                          min="0.01"
                                          step="0.01"
                                          className="form-control"
                                          value={
                                            measurements[request._id]
                                              ?.paintableArea || ""
                                          }
                                          onChange={(e) =>
                                            handleMeasurementChange(
                                              request._id,
                                              "paintableArea",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      <div className="col-md-4 mb-3">
                                        <button
                                          className="btn btn-success"
                                          onClick={() =>
                                            handleVerifyPainting(request)
                                          }
                                          disabled={Boolean(busyId)}
                                        >
                                          {busyId === request._id
                                            ? "Saving..."
                                            : "Verify Area"}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="alert alert-success">
                                    <strong>
                                      Painting area verified:
                                    </strong>{" "}
                                    {request.paintingMeasurements?.paintableArea} sq. ft.
                                  </div>
                                )}

                                {isVerified && (
                                  <div className="border rounded p-3">
                                    <h6 className="fw-bold">
                                      Generate Painting Quotation
                                    </h6>

                                    <p className="text-muted small">
                                      The quotation will use your saved
                                      painting rates, paint coverage,
                                      and number of coats.
                                    </p>

                                    <button
                                      className="btn btn-primary"
                                      onClick={() =>
                                        handleCalculatePainting(request)
                                      }
                                      disabled={Boolean(busyId)}
                                    >
                                      {busyId === request._id
                                        ? "Calculating..."
                                        : "Generate Quotation"}
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}

                        {/* QUOTATION STATUS */}
                        {isQuoted && (
                          <div className="alert alert-info">
                            A quotation has already been generated for
                            this request.
                          </div>
                        )}

                        {/* SAVED QUOTATION RESULT */}
                        {quotation && (
                          <div className="alert alert-success mt-3 mb-0">
                            <h6 className="fw-bold">
                              Quotation Generated
                            </h6>

                            {isRoofing && (
                              <p className="mb-1">
                                Roof Area:{" "}
                                {quotation.measurements?.roofArea} sq. ft.
                              </p>
                            )}

                            {isPainting && (
                              <p className="mb-1">
                                Paintable Area:{" "}
                                {quotation.paintingMeasurements
                                  ?.paintableArea ??
                                  quotation.measurements?.verifiedArea} sq. ft.
                              </p>
                            )}

                            <p className="mb-1">
                              Material Cost: ₹
                              {formatCurrency(
                                quotation.material?.cost
                              )}
                            </p>

                            <p className="mb-1">
                              Labour Cost: ₹
                              {formatCurrency(
                                quotation.labour?.cost
                              )}
                            </p>

                            {quotation.paint?.quantityLitres && (
                              <p className="mb-1">
                                Paint Required:{" "}
                                {quotation.paint.quantityLitres} litres
                              </p>
                            )}

                            <h5 className="fw-bold mt-2 mb-0">
                              Total: ₹
                              {formatCurrency(quotation.totalCost)}
                            </h5>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
