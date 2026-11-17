
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FaTachometerAlt,
  FaUsers,
  FaHardHat,
  FaClipboardList,
  FaFileInvoiceDollar,
  FaTools,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { logoutUser } from "../features/auth/authSlice";

const menuItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: FaTachometerAlt,
    end: true,
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: FaUsers,
  },
  {
    title: "Contractors",
    path: "/admin/contractors",
    icon: FaHardHat,
  },
  {
    title: "Estimation Requests",
    path: "/admin/requests",
    icon: FaClipboardList,
  },
  {
    title: "Quotations",
    path: "/admin/quotations",
    icon: FaFileInvoiceDollar,
  },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="d-flex min-vh-100 bg-light">

      {/* Mobile / Tablet Overlay */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1040,
          }}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-dark text-white flex-column flex-shrink-0 ${
          sidebarOpen
            ? "d-flex position-fixed top-0 start-0"
            : "d-none d-lg-flex"
        }`}
        style={{
          width: "250px",
          height: "100vh",
          zIndex: 1050,
        }}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-bottom border-secondary d-flex justify-content-between align-items-center">

          <div>
            <h4 className="fw-bold mb-1">
              <FaTools className="me-2 text-warning" />
              HomeEstimator
            </h4>

            <small className="text-secondary">
              Admin Panel
            </small>
          </div>

          <button
            className="btn text-white d-lg-none"
            onClick={closeSidebar}
          >
            <FaTimes size={20} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="nav flex-column p-3 gap-2">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 rounded px-3 py-3 ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-white-50"
                  }`
                }
                style={{ textDecoration: "none" }}
              >
                <Icon />
                <span>{item.title}</span>
              </NavLink>
            );
          })}

        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto p-3 border-top border-secondary">
          <small className="text-secondary">
            Home Service Estimator
          </small>
        </div>

      </aside>

      {/* Main Content */}
      <main
        className="flex-grow-1 w-100"
        style={{ minWidth: 0 }}
      >

        {/* Header */}
        <header className="bg-white shadow-sm px-3 px-md-4 py-3 d-flex justify-content-between align-items-center">

          <div className="d-flex align-items-center gap-3">

            {/* Hamburger - Mobile and Tablet */}
            <button
              className="btn btn-outline-dark d-lg-none"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>

            <h5 className="mb-0 fw-semibold">
              Administration
            </h5>

          </div>

          <div className="d-flex align-items-center gap-2 gap-md-3">

            <span className="badge bg-dark px-2 px-md-3 py-2">
              Administrator
            </span>

            <button
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span className="d-none d-sm-inline">
                Logout
              </span>
            </button>

          </div>

        </header>

        {/* Page Content */}
        <div className="p-2 p-sm-3 p-md-4">
          <Outlet />
        </div>

      </main>

    </div>
  );
}
