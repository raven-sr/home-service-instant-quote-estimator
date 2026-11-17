
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FaHome,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaPlus,
  FaUserShield,
} from "react-icons/fa";

import { logoutUser } from "../features/auth/authSlice";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    await dispatch(logoutUser());
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="app-navbar">
      <div className="container">
        <div className="app-navbar-inner">

          {/* Brand */}
          <Link
            to="/"
            className="app-navbar-brand"
            onClick={() => setMenuOpen(false)}
          >
            <span className="brand-icon">
              <FaHome />
            </span>

            <span>
              Home<span className="brand-highlight">Estimate</span>
              <small>SMART HOME SERVICE QUOTES</small>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="app-navbar-links">
            {user ? (
              <>
                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="nav-link-custom"
                  >
                    <FaUserShield />
                    Admin Panel
                  </Link>
                ) : user.role === "contractor" ? (
                  <Link
                    to="/contractor/requests"
                    className="nav-link-custom"
                  >
                    <FaClipboardList />
                    My Requests
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="nav-link-custom"
                    >
                      <FaClipboardList />
                      Dashboard
                    </Link>

                    <Link
                      to="/new-estimate"
                      className="nav-create-btn"
                    >
                      <FaPlus />
                      New Estimate
                    </Link>
                  </>
                )}

                <div className="nav-user">
                  <FaUserCircle />
                  <span>{user.name}</span>
                </div>

                <button
                  className="nav-logout-btn"
                  onClick={logout}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link-custom">
                  Sign in
                </Link>

                <Link to="/register" className="nav-create-btn">
                  Create account
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="nav-mobile-menu">
            {user ? (
              <>
                <div className="nav-mobile-user">
                  <FaUserCircle />
                  <span>{user.name}</span>
                </div>

                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUserShield /> Admin Panel
                  </Link>
                ) : user.role === "contractor" ? (
                  <Link
                    to="/contractor/requests"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaClipboardList /> My Requests
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaClipboardList /> Dashboard
                    </Link>

                    <Link
                      to="/new-estimate"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaPlus /> New Estimate
                    </Link>
                  </>
                )}

                <button onClick={logout}>
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
