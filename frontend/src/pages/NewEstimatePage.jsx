// import {useState} from 'react';import {useNavigate} from 'react-router-dom';import api from '../services/api';
// export default function NewEstimatePage(){const [f,setF]=useState({serviceType:'roofing',propertyAddress:'',description:'',propertyType:'',verifiedArea:'',areaUnit:'sqft',measurementsVerified:false}),[error,setError]=useState(''),[busy,setBusy]=useState(false),nav=useNavigate();const change=e=>setF({...f,[e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value});const submit=async e=>{e.preventDefault();setBusy(true);setError('');try{const {data}=await api.post('/estimations',{serviceType:f.serviceType,propertyAddress:f.propertyAddress,description:f.description,propertyDetails:{propertyType:f.propertyType,verifiedArea:f.verifiedArea?Number(f.verifiedArea):undefined,areaUnit:f.areaUnit,measurementsVerified:f.measurementsVerified}});nav(`/requests/${data.request._id}`);}catch(e){setError(e.response?.data?.message||'Could not create request');}finally{setBusy(false);}};return <div className="page-wrap"><div className="container"><div className="panel p-4 mx-auto" style={{maxWidth:720}}><h2>New estimation request</h2><form onSubmit={submit}><label className="form-label">Service</label><select className="form-select mb-3" name="serviceType" value={f.serviceType} onChange={change}><option value="roofing">Roofing</option><option value="painting">Painting</option></select><label className="form-label">Property address</label><input className="form-control mb-3" name="propertyAddress" value={f.propertyAddress} onChange={change} required/><label className="form-label">Property type</label><select className="form-select mb-3" name="propertyType" value={f.propertyType} onChange={change}><option value="">Select</option><option>House</option><option>Apartment</option><option>Commercial</option><option>Other</option></select><label className="form-label">Project description</label><textarea className="form-control mb-3" rows="3" name="description" value={f.description} onChange={change}/><div className="row"><div className="col"><label className="form-label">Area (optional)</label><input className="form-control" type="number" min="0" name="verifiedArea" value={f.verifiedArea} onChange={change}/></div><div className="col"><label className="form-label">Unit</label><select className="form-select" name="areaUnit" value={f.areaUnit} onChange={change}><option value="sqft">sq ft</option><option value="sqm">sq m</option></select></div></div><div className="form-check my-3"><input className="form-check-input" type="checkbox" name="measurementsVerified" checked={f.measurementsVerified} onChange={change}/><label className="form-check-label">I have verified this measurement</label></div>{error&&<div className="alert alert-danger">{error}</div>}<button className="btn btn-primary" disabled={busy}>{busy?'Creating...':'Create request'}</button></form></div></div></div>;}



import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaHome,
  FaPaintRoller,
  FaMapMarkerAlt,
  FaBuilding,
  FaRulerCombined,
  FaClipboardList,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaInfoCircle,
} from "react-icons/fa";
import api from "../services/api";

export default function NewEstimatePage() {
  const [f, setF] = useState({
    serviceType: "roofing",
    propertyAddress: "",
    description: "",
    propertyType: "",
    verifiedArea: "",
    areaUnit: "sqft",
    measurementsVerified: false,
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const nav = useNavigate();

  const change = (e) => {
    setF({
      ...f,
      [e.target.name]:
        e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value,
    });
  };

  const selectService = (service) => {
    setF({ ...f, serviceType: service });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const { data } = await api.post("/estimations", {
        serviceType: f.serviceType,
        propertyAddress: f.propertyAddress,
        description: f.description,
        propertyDetails: {
          propertyType: f.propertyType,
          verifiedArea: f.verifiedArea
            ? Number(f.verifiedArea)
            : undefined,
          areaUnit: f.areaUnit,
          measurementsVerified: f.measurementsVerified,
        },
      });

      nav(`/requests/${data.request._id}`);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Could not create your estimation request."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="new-estimate-page">
      <div className="container py-5">

        {/* PAGE HEADER */}
        <div className="estimate-page-header">
          <Link to="/dashboard" className="estimate-back-link">
            <FaArrowLeft />
            Back to Dashboard
          </Link>

          <span className="estimate-eyebrow">
            PROJECT SETUP
          </span>

          <h2>Create a New Estimate</h2>

          <p>
            Tell us about your property and the work you are
            planning. We'll help organize your project details.
          </p>
        </div>

        <div className="row g-4">

          {/* MAIN FORM */}
          <div className="col-lg-8">
            <form onSubmit={submit}>

              {/* SERVICE SELECTION */}
              <div className="estimate-form-card">
                <div className="estimate-card-heading">
                  <div className="estimate-step-number">01</div>

                  <div>
                    <h5>Select your service</h5>
                    <p>What type of home improvement do you need?</p>
                  </div>
                </div>

                <div className="row g-3">

                  <div className="col-md-6">
                    <button
                      type="button"
                      className={`service-select-card ${
                        f.serviceType === "roofing" ? "selected" : ""
                      }`}
                      onClick={() => selectService("roofing")}
                    >
                      <div className="service-select-icon roofing-select">
                        <FaHome />
                      </div>

                      <div className="service-select-info">
                        <strong>Roofing</strong>
                        <span>Roof repair and replacement</span>
                      </div>

                      {f.serviceType === "roofing" && (
                        <FaCheckCircle className="service-selected-check" />
                      )}
                    </button>
                  </div>

                  <div className="col-md-6">
                    <button
                      type="button"
                      className={`service-select-card ${
                        f.serviceType === "painting" ? "selected" : ""
                      }`}
                      onClick={() => selectService("painting")}
                    >
                      <div className="service-select-icon painting-select">
                        <FaPaintRoller />
                      </div>

                      <div className="service-select-info">
                        <strong>Painting</strong>
                        <span>Interior and exterior painting</span>
                      </div>

                      {f.serviceType === "painting" && (
                        <FaCheckCircle className="service-selected-check" />
                      )}
                    </button>
                  </div>

                </div>
              </div>

              {/* PROPERTY INFORMATION */}
              <div className="estimate-form-card">
                <div className="estimate-card-heading">
                  <div className="estimate-step-number">02</div>

                  <div>
                    <h5>Property information</h5>
                    <p>Tell us where the project will take place.</p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="estimate-label">
                    Property address <span>*</span>
                  </label>

                  <div className="estimate-input-wrapper">
                    <FaMapMarkerAlt />

                    <input
                      type="text"
                      className="form-control estimate-input"
                      name="propertyAddress"
                      placeholder="Enter your complete property address"
                      value={f.propertyAddress}
                      onChange={change}
                      required
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="estimate-label">
                    Property type
                  </label>

                  <div className="estimate-input-wrapper">
                    <FaBuilding />

                    <select
                      className="form-select estimate-input"
                      name="propertyType"
                      value={f.propertyType}
                      onChange={change}
                    >
                      <option value="">Select property type</option>
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PROJECT DESCRIPTION */}
              <div className="estimate-form-card">
                <div className="estimate-card-heading">
                  <div className="estimate-step-number">03</div>

                  <div>
                    <h5>Project details</h5>
                    <p>Describe what you want to accomplish.</p>
                  </div>
                </div>

                <div>
                  <label className="estimate-label">
                    Project description
                  </label>

                  <textarea
                    className="form-control estimate-textarea"
                    rows="5"
                    name="description"
                    placeholder={
                      f.serviceType === "roofing"
                        ? "Example: I want to replace my old roof. There are some damaged shingles and I would like to explore new roofing materials..."
                        : "Example: I want to repaint the exterior walls of my house. The existing paint is fading and needs improvement..."
                    }
                    value={f.description}
                    onChange={change}
                  />

                  <small className="estimate-field-hint">
                    Include any requirements, concerns or preferences.
                  </small>
                </div>
              </div>

              {/* MEASUREMENTS */}
              <div className="estimate-form-card">
                <div className="estimate-card-heading">
                  <div className="estimate-step-number">04</div>

                  <div>
                    <h5>Property measurements</h5>
                    <p>
                      Add verified measurements if you already have them.
                    </p>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="estimate-label">
                      Area <span className="optional-label">OPTIONAL</span>
                    </label>

                    <div className="estimate-input-wrapper">
                      <FaRulerCombined />

                      <input
                        type="number"
                        min="0"
                        step="any"
                        className="form-control estimate-input"
                        name="verifiedArea"
                        placeholder="Enter measured area"
                        value={f.verifiedArea}
                        onChange={change}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="estimate-label">
                      Unit
                    </label>

                    <select
                      className="form-select estimate-input"
                      name="areaUnit"
                      value={f.areaUnit}
                      onChange={change}
                    >
                      <option value="sqft">Sq. ft</option>
                      <option value="sqm">Sq. m</option>
                    </select>
                  </div>
                </div>

                <div className="measurement-note">
                  <FaInfoCircle />
                  <span>
                    Only enter measurements that have been physically
                    measured or otherwise verified. An ordinary property
                    photograph cannot establish exact area.
                  </span>
                </div>

                <div className="measurement-checkbox">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="measurementsVerified"
                    id="measurementsVerified"
                    checked={f.measurementsVerified}
                    onChange={change}
                  />

                  <label htmlFor="measurementsVerified">
                    I confirm that the entered measurement has been verified.
                  </label>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <div className="estimate-submit-area">
                <button
                  type="submit"
                  className="estimate-submit-btn"
                  disabled={busy}
                >
                  {busy ? (
                    "Creating your request..."
                  ) : (
                    <>
                      Create Estimation Request
                      <FaArrowRight />
                    </>
                  )}
                </button>

                <p>
                  You can add photos and discuss your project
                  with the AI assistant after creating the request.
                </p>
              </div>

            </form>
          </div>

          {/* SIDE PANEL */}
          <div className="col-lg-4">
            <div className="estimate-sidebar">

              <div className="estimate-summary-card">
                <div className="summary-icon">
                  <FaClipboardList />
                </div>

                <span>PROJECT SUMMARY</span>

                <h5>Your project overview</h5>

                <div className="summary-divider" />

                <div className="summary-item">
                  <span>Service</span>
                  <strong className="text-capitalize">
                    {f.serviceType}
                  </strong>
                </div>

                <div className="summary-item">
                  <span>Property</span>
                  <strong>
                    {f.propertyType || "Not selected"}
                  </strong>
                </div>

                <div className="summary-item">
                  <span>Area</span>
                  <strong>
                    {f.verifiedArea
                      ? `${f.verifiedArea} ${f.areaUnit}`
                      : "Not provided"}
                  </strong>
                </div>

                <div className="summary-item">
                  <span>Measurements</span>
                  <strong>
                    {f.measurementsVerified ? "Verified" : "Not verified"}
                  </strong>
                </div>
              </div>

              <div className="estimate-help-card">
                <div className="estimate-help-icon">
                  <FaCheckCircle />
                </div>

                <h6>What happens next?</h6>

                <p>
                  After creating your request, you can upload
                  property photos, use the AI assistant and
                  provide additional project details.
                </p>
              </div>

              <div className="estimate-help-card estimate-ai-card">
                <div className="estimate-help-icon">
                  <FaHome />
                </div>

                <h6>Need help with your project?</h6>

                <p>
                  You can discuss your roofing or painting
                  requirements with the AI assistant after
                  creating your request.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
