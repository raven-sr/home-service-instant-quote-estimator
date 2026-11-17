
import { useEffect, useState } from "react";
import {
  FaUsers,
  FaUser,
  FaHardHat,
  FaClipboardList,
  FaHome,
  FaPaintRoller,
  FaClock,
  FaFileInvoiceDollar,
  FaSyncAlt,
} from "react-icons/fa";

import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setError("");

      const response = await api.get("/admin/stats");

      setStats(response.data.stats);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers,
      icon: <FaUsers />,
      color: "primary",
    },
    {
      title: "Homeowners",
      value: stats?.totalHomeowners,
      icon: <FaUser />,
      color: "info",
    },
    {
      title: "Contractors",
      value: stats?.totalContractors,
      icon: <FaHardHat />,
      color: "warning",
    },
    {
      title: "Total Requests",
      value: stats?.totalRequests,
      icon: <FaClipboardList />,
      color: "success",
    },
    {
      title: "Roofing Requests",
      value: stats?.totalRoofingRequests,
      icon: <FaHome />,
      color: "primary",
    },
    {
      title: "Painting Requests",
      value: stats?.totalPaintingRequests,
      icon: <FaPaintRoller />,
      color: "warning",
    },
    {
      title: "Pending Requests",
      value: stats?.pendingRequests,
      icon: <FaClock />,
      color: "danger",
    },
    {
      title: "Quoted Requests",
      value: stats?.completedRequests,
      icon: <FaFileInvoiceDollar />,
      color: "success",
    },
    {
      title: "Total Quotations",
      value: stats?.totalQuotations,
      icon: <FaFileInvoiceDollar />,
      color: "info",
    },
  ];

  if (loading) {
    return (
      <div className="container py-5">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <span className="text-uppercase text-muted small fw-bold">
            Administration
          </span>

          <h2 className="fw-bold mt-2">Admin Dashboard</h2>

          <p className="text-muted">
            Monitor users, contractors and service requests.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchStats}
        >
          <FaSyncAlt className="me-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {stats && (
        <>
          <div className="row g-4">
            {statCards.map((card) => (
              <div
                className="col-12 col-sm-6 col-lg-4"
                key={card.title}
              >
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted mb-2">
                          {card.title}
                        </p>

                        <h3 className="fw-bold mb-0">
                          {card.value ?? 0}
                        </h3>
                      </div>

                      <div
                        className={`bg-${card.color}-subtle text-${card.color} rounded-circle p-3 fs-4`}
                      >
                        {card.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card border-0 shadow-sm mt-5">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                Platform Overview
              </h5>

              <p className="text-muted mb-2">
                Total registered users: {stats.totalUsers}
              </p>

              <p className="text-muted mb-2">
                Total estimation requests: {stats.totalRequests}
              </p>

              <p className="text-muted mb-0">
                Total quotations generated: {stats.totalQuotations}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
