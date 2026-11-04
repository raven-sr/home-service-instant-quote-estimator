// import {useEffect,useState} from 'react';import {Link} from 'react-router-dom';import api from '../services/api';
// export default function DashboardPage(){const [items,setItems]=useState([]),[error,setError]=useState('');useEffect(()=>{api.get('/estimations').then(r=>setItems(r.data.requests)).catch(e=>setError(e.response?.data?.message||'Unable to load requests'));},[]);return <div className="page-wrap"><div className="container"><div className="d-flex justify-content-between mb-4"><div><h2>Homeowner dashboard</h2><p className="text-secondary">Your estimation requests</p></div><Link className="btn btn-primary align-self-start" to="/new-estimate">+ New estimate</Link></div>{error&&<div className="alert alert-danger">{error}</div>}{items.length===0?<div className="panel p-5 text-center"><h5>No requests yet</h5><Link className="btn btn-primary mt-2" to="/new-estimate">Create request</Link></div>:<div className="row g-3">{items.map(x=><div className="col-md-6" key={x._id}><div className="panel p-4"><h5 className="text-capitalize">{x.serviceType}</h5><p>{x.propertyAddress}</p><span className="badge text-bg-info">{x.status}</span><div><Link className="btn btn-outline-primary btn-sm mt-3" to={`/requests/${x._id}`}>Open request</Link></div></div></div>)}</div>}</div></div>;}



import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaHome,
  FaTools,
  FaPaintRoller,
  FaClock,
  FaArrowRight,
  FaMapMarkerAlt,
  FaClipboardList,
  FaCheckCircle,
  FaHourglassHalf,
  FaExclamationCircle,
  FaSyncAlt,
} from "react-icons/fa";
import api from "../services/api";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchRequests = async () => {
      try {
        const response = await api.get("/estimations");

        if (active) {
          setItems(response.data.requests || []);
          setError("");
        }
      } catch (e) {
        if (active) {
          setError(
            e.response?.data?.message ||
              "Unable to load your estimation requests."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchRequests();

    return () => {
      active = false;
    };
  }, []);

  // Dashboard statistics
  const totalRequests = items.length;

  const roofingCount = items.filter(
    (x) => x.serviceType?.toLowerCase() === "roofing"
  ).length;

  const paintingCount = items.filter(
    (x) => x.serviceType?.toLowerCase() === "painting"
  ).length;

  const pendingCount = items.filter(
    (x) => x.status?.toLowerCase() === "pending"
  ).length;

  // Status styling
  const getStatus = (status) => {
    const value = status?.toLowerCase();

    if (value === "completed" || value === "approved") {
      return {
        className: "status-completed",
        icon: <FaCheckCircle />,
        label: status,
      };
    }

    if (value === "pending") {
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

  const getServiceIcon = (serviceType) => {
    return serviceType?.toLowerCase() === "roofing" ? (
      <FaHome />
    ) : (
      <FaPaintRoller />
    );
  };

  return (
    <div className="dashboard-page">
      <div className="container py-5">

        {/* Dashboard Header */}
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

        {/* Error */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center justify-content-between">
            <span>{error}</span>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => window.location.reload()}
            >
              <FaSyncAlt /> Retry
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="row g-3 mb-5">

          <div className="col-6 col-lg-3">
            <div className="dashboard-stat-card">
              <div className="stat-icon stat-blue">
                <FaClipboardList />
              </div>

              <span>Total Requests</span>

              <h3>{loading ? "—" : totalRequests}</h3>

              <small>All your projects</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="dashboard-stat-card">
              <div className="stat-icon stat-purple">
                <FaHome />
              </div>

              <span>Roofing</span>

              <h3>{loading ? "—" : roofingCount}</h3>

              <small>Roofing projects</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="dashboard-stat-card">
              <div className="stat-icon stat-orange">
                <FaPaintRoller />
              </div>

              <span>Painting</span>

              <h3>{loading ? "—" : paintingCount}</h3>

              <small>Painting projects</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="dashboard-stat-card">
              <div className="stat-icon stat-green">
                <FaHourglassHalf />
              </div>

              <span>Pending</span>

              <h3>{loading ? "—" : pendingCount}</h3>

              <small>Awaiting next steps</small>
            </div>
          </div>

        </div>

        {/* Requests Heading */}
        <div className="dashboard-section-heading">
          <div>
            <h4>My Estimation Requests</h4>
            <p>Track and manage your home service projects.</p>
          </div>

          {!loading && (
            <span className="request-count">
              {totalRequests} {totalRequests === 1 ? "Project" : "Projects"}
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="row g-4">
            {[1, 2, 3, 4].map((item) => (
              <div className="col-md-6" key={item}>
                <div className="request-card p-4">
                  <div className="skeleton skeleton-icon mb-3" />
                  <div className="skeleton skeleton-title mb-3" />
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-button mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && items.length === 0 && (
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

        {/* Request Cards */}
        {!loading && items.length > 0 && (
          <div className="row g-4">
            {items.map((item) => {
              const status = getStatus(item.status);

              return (
                <div className="col-md-6 col-xl-4" key={item._id}>
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

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
