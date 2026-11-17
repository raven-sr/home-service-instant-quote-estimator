
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

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <div className="d-flex min-vh-100 bg-light">

      {/* Sidebar */}
      <aside
        className="bg-dark text-white d-flex flex-column flex-shrink-0"
        style={{ width: "250px" }}
      >
        <div className="p-4 border-bottom border-secondary">
          <h4 className="fw-bold mb-1">
            <FaTools className="me-2 text-warning" />
            HomeEstimator
          </h4>
          <small className="text-secondary">Admin Panel</small>
        </div>

        <nav className="nav flex-column p-3 gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
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

        <div className="mt-auto p-3 border-top border-secondary">
          <small className="text-secondary">
            Home Service Estimator
          </small>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 overflow-auto">

        {/* Admin Header */}
        <header className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center">

          <h5 className="mb-0 fw-semibold">
            Administration
          </h5>

          <div className="d-flex align-items-center gap-3">

            <span className="badge bg-dark px-3 py-2">
              Administrator
            </span>

            <button
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>
        </header>

        {/* Page Content */}
        <div className="p-4">
          <Outlet />
        </div>

      </main>
    </div>
  );
}
