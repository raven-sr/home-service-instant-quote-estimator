
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../features/auth/authSlice";

import {
  FaHome,
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from "react-icons/fa";

export default function AuthPage({ mode }) {
  const reg = mode === "register";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "homeowner",
  });

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const nav = useNavigate();

  const { loading, error } = useSelector((s) => s.auth);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      reg
        ? registerUser(form)
        : loginUser({
            email: form.email,
            password: form.password,
          })
    );

    if (result.meta.requestStatus === "fulfilled") {
      if (reg) {
        nav("/dashboard");
        return;
      }

      const user = result.payload?.user || result.payload;

      if (user?.role === "admin") {
        nav("/admin");
      } else if (user?.role === "contractor") {
        nav("/contractor/requests");
      } else {
        nav("/dashboard");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="container-fluid">
        <div className="row min-vh-100">

          {/* Left branding section */}
          <div className="col-lg-6 auth-brand-section d-none d-lg-flex">
            <div className="auth-brand-content">

              <Link to="/" className="auth-logo">
                <span className="auth-logo-icon">
                  <FaHome />
                </span>
                HomeEstimate
              </Link>

              <div className="auth-brand-main">
                <span className="auth-tagline">
                  SMART HOME SERVICE ESTIMATES
                </span>

                <h1>
                  Your home project.
                  <br />
                  <span>Made simpler.</span>
                </h1>

                <p>
                  Get started with a smarter way to plan your
                  roofing and painting projects. Upload photos,
                  share your requirements and explore your
                  project details in one place.
                </p>

                <div className="auth-benefits">
                  <div>
                    <FaCheckCircle />
                    Easy project creation
                  </div>

                  <div>
                    <FaCheckCircle />
                    AI-powered image analysis
                  </div>

                  <div>
                    <FaCheckCircle />
                    Organized project tracking
                  </div>
                </div>
              </div>

              <div className="auth-brand-footer">
                © 2026 HomeEstimate. All rights reserved.
              </div>

            </div>
          </div>

          {/* Right authentication section */}
          <div className="col-lg-6 auth-form-section">
            <div className="auth-form-wrapper">

              <div className="auth-mobile-logo d-lg-none">
                <Link to="/" className="auth-logo">
                  <span className="auth-logo-icon">
                    <FaHome />
                  </span>
                  HomeEstimate
                </Link>
              </div>

              <div className="auth-form-header">
                <span className="auth-welcome">
                  {reg ? "GET STARTED" : "WELCOME BACK"}
                </span>

                <h2>
                  {reg
                    ? "Create your account"
                    : "Sign in to your account"}
                </h2>

                <p>
                  {reg
                    ? "Create an account to start planning your home project."
                    : "Enter your details to access your projects."}
                </p>
              </div>

              <form onSubmit={submit}>

                {/* Name */}
                {reg && (
                  <div className="mb-4">
                    <label className="form-label">
                      Full name
                    </label>

                    <div className="auth-input-wrapper">
                      <FaUser className="auth-input-icon" />

                      <input
                        className="form-control auth-input"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={change}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Account type */}
                {reg && (
                  <div className="mb-4">
                    <label className="form-label">
                      Register as
                    </label>

                    <div className="auth-input-wrapper">
                      <FaUser className="auth-input-icon" />

                      <select
                        className="form-select auth-input"
                        name="role"
                        value={form.role}
                        onChange={change}
                        required
                      >
                        <option value="homeowner">
                          Homeowner
                        </option>

                        <option value="contractor">
                          Contractor
                        </option>
                      </select>
                    </div>

                    <small className="text-muted mt-2 d-block">
                      {form.role === "homeowner"
                        ? "Choose this if you want to plan and estimate your home projects."
                        : "Choose this if you provide roofing or painting services."}
                    </small>
                  </div>
                )}

                {/* Email */}
                <div className="mb-4">
                  <label className="form-label">
                    Email address
                  </label>

                  <div className="auth-input-wrapper">
                    <FaEnvelope className="auth-input-icon" />

                    <input
                      className="form-control auth-input"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={change}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label">
                    Password
                  </label>

                  <div className="auth-input-wrapper">
                    <FaLock className="auth-input-icon" />

                    <input
                      className="form-control auth-input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      minLength={8}
                      value={form.password}
                      onChange={change}
                      required
                    />

                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger auth-error">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="btn auth-submit-btn w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : reg
                    ? "Create account"
                    : "Sign in"}
                </button>

              </form>

              <div className="auth-switch">
                {reg
                  ? "Already have an account?"
                  : "Don't have an account?"}

                <Link to={reg ? "/login" : "/register"}>
                  {reg ? " Sign in" : " Create account"}
                </Link>
              </div>

              <div className="auth-security-note">
                <FaLock />
                Your account information is securely protected.
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
