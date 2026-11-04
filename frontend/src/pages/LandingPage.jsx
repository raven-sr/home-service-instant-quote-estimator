// import {Link} from 'react-router-dom'; export default function LandingPage(){return <><section className="hero"><div className="container row align-items-center g-4"><div className="col-lg-7"><span className="text-warning small fw-bold">HOME IMPROVEMENT ESTIMATES</span><h1 className="display-5 fw-bold mt-2">Instant quotes for roofing and painting</h1><p className="lead">Describe your project, upload property photos, and organize a structured estimate based on verified measurements and contractor pricing.</p><Link to="/register" className="btn btn-warning fw-semibold">Start an estimate</Link></div><div className="col-lg-5"><div className="bg-white text-dark rounded-4 p-4"><h5>What this platform does</h5><p>AI collects project details without inventing measurements or prices.</p><p>Property photos can be stored and reviewed.</p><p className="mb-0">Estimates depend on verified measurements and contractor-configured rates.</p></div></div></div></section><section className="container py-5"><h3>Services</h3><div className="row g-4 mt-1">{['Roofing','Painting'].map(x=><div className="col-md-6" key={x}><div className="service-card"><h5>{x}</h5><p className="text-secondary mb-0">Create a project request for your {x.toLowerCase()} work.</p></div></div>)}</div></section></>;}



import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheckCircle,
  FaHome,
  FaPaintRoller,
  FaRobot,
  FaCamera,
  FaCalculator,
  FaClipboardCheck,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="landing-page">

      {/* HERO SECTION */}
      <section className="landing-hero">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-7">
              <div className="hero-content">

                <div className="hero-badge">
                  <FaStar />
                  SMART HOME IMPROVEMENT PLATFORM
                </div>

                <h1>
                  Plan your home project.
                  <span> Know what comes next.</span>
                </h1>

                <p className="hero-description">
                  Get started with roofing and painting estimates.
                  Share your project details, upload property photos
                  and let AI help organize the information you need.
                </p>

                <div className="hero-actions">
                  <Link to="/register" className="hero-primary-btn">
                    Start Your Estimate
                    <FaArrowRight />
                  </Link>

                  <Link to="/login" className="hero-secondary-btn">
                    Sign In
                  </Link>
                </div>

                <div className="hero-trust-points">
                  <span>
                    <FaCheckCircle />
                    Easy project setup
                  </span>

                  <span>
                    <FaCheckCircle />
                    AI-assisted analysis
                  </span>
                </div>

              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="col-lg-5">
              <div className="hero-visual">

                <div className="hero-image-placeholder">
                  <div className="hero-image-overlay">
                    <div className="hero-floating-icon">
                      <FaHome />
                    </div>

                    <div>
                      <span>YOUR NEXT PROJECT</span>
                      <h5>Make home improvements simpler.</h5>
                    </div>
                  </div>
                </div>

                <div className="hero-info-card">
                  <div className="hero-info-icon">
                    <FaRobot />
                  </div>

                  <div>
                    <strong>AI Project Assistant</strong>
                    <p>Helping organize your requirements</p>
                  </div>

                  <FaCheckCircle className="hero-info-check" />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="landing-services">
        <div className="container">

          <div className="landing-section-heading text-center">
            <span>OUR SERVICES</span>
            <h2>What are you planning to improve?</h2>
            <p>
              Start with a service, describe your requirements
              and organize your project details.
            </p>
          </div>

          <div className="row g-4 mt-3">

            <div className="col-md-6">
              <div className="landing-service-card">
                <div className="service-icon roofing-icon">
                  <FaHome />
                </div>

                <span className="service-label">ROOFING SERVICE</span>

                <h4>Roofing Estimates</h4>

                <p>
                  Organize roof replacement and repair requirements,
                  review property photos and collect the information
                  needed for a roofing estimate.
                </p>

                <Link to="/register" className="service-link">
                  Get started <FaArrowRight />
                </Link>
              </div>
            </div>

            <div className="col-md-6">
              <div className="landing-service-card">
                <div className="service-icon painting-icon">
                  <FaPaintRoller />
                </div>

                <span className="service-label">PAINTING SERVICE</span>

                <h4>Painting Estimates</h4>

                <p>
                  Share your painting requirements, upload property
                  photos and organize the details needed for
                  your painting project.
                </p>

                <Link to="/register" className="service-link">
                  Get started <FaArrowRight />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-how">
        <div className="container">

          <div className="landing-section-heading text-center">
            <span>HOW IT WORKS</span>
            <h2>From project idea to organized estimate</h2>
            <p>
              A simple workflow to help you prepare your
              home improvement project.
            </p>
          </div>

          <div className="row g-4 mt-4">

            <div className="col-md-4">
              <div className="how-card">
                <div className="how-number">01</div>
                <div className="how-icon">
                  <FaClipboardCheck />
                </div>
                <h5>Describe your project</h5>
                <p>
                  Tell us about your roofing or painting
                  requirements using the project assistant.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="how-card">
                <div className="how-number">02</div>
                <div className="how-icon">
                  <FaCamera />
                </div>
                <h5>Upload property photos</h5>
                <p>
                  Add property images and receive AI-assisted
                  observations about visible conditions.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="how-card">
                <div className="how-number">03</div>
                <div className="how-icon">
                  <FaCalculator />
                </div>
                <h5>Prepare your estimate</h5>
                <p>
                  Use verified measurements and contractor
                  pricing to prepare a structured estimate.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="landing-features">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <span className="feature-eyebrow">
                A SMARTER WORKFLOW
              </span>

              <h2>
                Everything organized in one place.
              </h2>

              <p className="feature-description">
                Keep your project requirements, property photos
                and estimation conversations organized in one
                convenient workspace.
              </p>

              <div className="feature-list">
                <div>
                  <FaCheckCircle />
                  AI-assisted project conversations
                </div>

                <div>
                  <FaCheckCircle />
                  Property image analysis
                </div>

                <div>
                  <FaCheckCircle />
                  Organized estimation requests
                </div>

                <div>
                  <FaCheckCircle />
                  Structured estimate preparation
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="feature-visual">
                <div className="feature-window">

                  <div className="feature-window-header">
                    <div className="window-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <small>PROJECT OVERVIEW</small>
                  </div>

                  <div className="feature-window-body">
                    <span>YOUR PROJECT</span>
                    <h4>Home Improvement</h4>

                    <div className="feature-project-row">
                      <div className="feature-project-icon">
                        <FaHome />
                      </div>
                      <div>
                        <strong>Roofing Project</strong>
                        <small>Project requirements</small>
                      </div>
                      <FaCheckCircle className="text-success ms-auto" />
                    </div>

                    <div className="feature-project-row">
                      <div className="feature-project-icon painting">
                        <FaPaintRoller />
                      </div>
                      <div>
                        <strong>Property Photos</strong>
                        <small>Image analysis</small>
                      </div>
                      <FaCheckCircle className="text-success ms-auto" />
                    </div>

                    <div className="feature-ai-note">
                      <FaRobot />
                      <span>
                        AI assistant helps organize your project details.
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="container text-center">
          <div className="cta-icon">
            <FaHome />
          </div>

          <h2>Ready to plan your next home project?</h2>

          <p>
            Create an account and start organizing your
            roofing or painting estimate today.
          </p>

          <Link to="/register" className="cta-button">
            Get Started Now <FaArrowRight />
          </Link>
        </div>
      </section>

    </div>
  );
}
