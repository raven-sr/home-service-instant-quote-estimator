// import {useEffect,useState} from 'react';import {useParams} from 'react-router-dom';import api from '../services/api';
// export default function RequestDetailPage(){const {id}=useParams();const [r,setR]=useState(null),[msg,setMsg]=useState(''),[file,setFile]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState('');const load=()=>api.get(`/estimations/${id}`).then(x=>setR(x.data.request)).catch(e=>setError(e.response?.data?.message||'Unable to load'));useEffect(()=>{load();},[id]);const send=async e=>{e.preventDefault();if(!msg.trim())return;setBusy(true);setError('');try{await api.post(`/estimations/${id}/chat`,{message:msg});setMsg('');await load();}catch(e){setError(e.response?.data?.message||'Chat failed');}finally{setBusy(false);}};const upload=async e=>{e.preventDefault();if(!file)return;const fd=new FormData();fd.append('image',file);setBusy(true);setError('');try{await api.post(`/estimations/${id}/images`,fd);setFile(null);await load();}catch(e){setError(e.response?.data?.message||'Upload failed');}finally{setBusy(false);}};if(!r)return <div className="container py-5">{error||'Loading...'}</div>;return <div className="page-wrap"><div className="container"><div className="panel p-4 mb-4"><h2 className="text-capitalize">{r.serviceType} request</h2><p>{r.propertyAddress}</p><span className="badge text-bg-info">{r.status}</span><p className="mt-2">{r.description}</p></div><div className="row g-4"><div className="col-lg-7"><div className="panel p-4"><h4>AI project assistant</h4><p className="small text-secondary">OpenAI API key required. The assistant will not invent measurements or prices.</p><div className="chat-window mb-3">{r.conversation?.map((m,i)=><div key={i} className={`chat-bubble ${m.role==='user'?'chat-user':'chat-ai'}`}><b>{m.role==='user'?'You':'Assistant'}</b><br/>{m.text}</div>)||'Start by describing your project.'}</div><form onSubmit={send} className="d-flex gap-2"><input className="form-control" value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Describe your project..."/><button className="btn btn-primary" disabled={busy}>Send</button></form></div></div><div className="col-lg-5"><div className="panel p-4"><h4>Property photos</h4><form onSubmit={upload}><input className="form-control mb-3" type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])}/><button className="btn btn-outline-primary" disabled={!file||busy}>Upload image</button></form>{r.images?.map((im,i)=><div className="mt-3" key={i}><img className="img-fluid rounded" src={im.url} alt="Property"/><p className="small mt-2">{im.analysis}</p></div>)}</div></div></div>{error&&<div className="alert alert-danger mt-3">{error}</div>}</div></div>;}



import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaHome,
  FaPaintRoller,
  FaMapMarkerAlt,
  FaRobot,
  FaPaperPlane,
  FaImage,
  FaCloudUploadAlt,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaStar,
  FaCamera,
  FaFileAlt,
  FaSyncAlt,
} from "react-icons/fa";
import api from "../services/api";

export default function RequestDetailPage() {
  const { id } = useParams();

  const [r, setR] = useState(null);
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  // Load request details
  const load = async () => {
    try {
      const { data } = await api.get(`/estimations/${id}`);
      setR(data.request);
      setError("");
    } catch (e) {
      setError(
        e.response?.data?.message || "Unable to load request."
      );
    }
  };

  useEffect(() => {
    setR(null);
    load();
  }, [id]);

  // Image preview
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Send chatbot message using Groq
  const send = async (e) => {
    e.preventDefault();

    if (!msg.trim() || busy) return;

    setBusy(true);
    setError("");

    try {
      await api.post(`/estimations/${id}/chat`, {
        message: msg.trim(),
      });

      setMsg("");
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message || "Unable to send message."
      );
    } finally {
      setBusy(false);
    }
  };

  // Upload image and analyse using Gemini
  const upload = async (e) => {
    e.preventDefault();

    if (!file || busy) return;

    const fd = new FormData();
    fd.append("image", file);

    setBusy(true);
    setError("");

    try {
      await api.post(`/estimations/${id}/images`, fd);
      setFile(null);
      await load();
    } catch (e) {
      setError(
        e.response?.data?.message || "Image upload failed."
      );
    } finally {
      setBusy(false);
    }
  };

  // Remove selected image before uploading
  const removeSelectedFile = () => {
    setFile(null);
  };

  // Status display
  const getStatus = (status) => {
    const value = status?.toLowerCase();

    if (value === "completed" || value === "approved") {
      return {
        className: "detail-status-completed",
        icon: <FaCheckCircle />,
      };
    }

    if (value === "pending") {
      return {
        className: "detail-status-pending",
        icon: <FaClock />,
      };
    }

    if (value === "rejected" || value === "cancelled") {
      return {
        className: "detail-status-rejected",
        icon: <FaClock />,
      };
    }

    return {
      className: "detail-status-progress",
      icon: <FaClock />,
    };
  };

  if (!r) {
    return (
      <div className="request-detail-page">
        <div className="container py-5">
          {error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="request-loading">
              <div className="spinner-border text-primary" />
              <p>Loading project details...</p>
            </div>
          )}

          <Link to="/dashboard" className="detail-back-link">
            <FaArrowLeft /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const status = getStatus(r.status);
  const conversation = r.conversation || [];
  const images = r.images || [];

  return (
    <div className="request-detail-page">
      <div className="container py-5">

        {/* PAGE NAVIGATION */}
        <div className="detail-topbar">
          <Link to="/dashboard" className="detail-back-link">
            <FaArrowLeft />
            Back to Dashboard
          </Link>

          <button
            className="detail-refresh-btn"
            onClick={load}
            type="button"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        {/* PROJECT OVERVIEW */}
        <div className="detail-overview-card">

          <div className="detail-overview-main">
            <div className="detail-service-icon">
              {r.serviceType?.toLowerCase() === "roofing" ? (
                <FaHome />
              ) : (
                <FaPaintRoller />
              )}
            </div>

            <div>
              <span className="detail-eyebrow">
                HOME IMPROVEMENT PROJECT
              </span>

              <h2 className="text-capitalize">
                {r.serviceType} Request
              </h2>

              <div className="detail-address">
                <FaMapMarkerAlt />
                {r.propertyAddress}
              </div>
            </div>
          </div>

          <div className={`detail-status ${status.className}`}>
            {status.icon}
            <span className="text-capitalize">
              {r.status || "Pending"}
            </span>
          </div>

          {r.description && (
            <div className="detail-description">
              <span>PROJECT DESCRIPTION</span>
              <p>{r.description}</p>
            </div>
          )}

        </div>

        {/* QUICK INFORMATION */}
        <div className="row g-3 detail-info-row">

          <div className="col-md-4">
            <div className="detail-info-card">
              <div className="detail-info-icon blue-info">
                <FaFileAlt />
              </div>

              <div>
                <span>Service Type</span>
                <strong className="text-capitalize">
                  {r.serviceType}
                </strong>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="detail-info-card">
              <div className="detail-info-icon purple-info">
                <FaImage />
              </div>

              <div>
                <span>Property Images</span>
                <strong>{images.length} Uploaded</strong>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="detail-info-card">
              <div className="detail-info-icon green-info">
                <FaRobot />
              </div>

              <div>
                <span>AI Conversations</span>
                <strong>
                  {conversation.filter(
                    (m) => m.role === "user"
                  ).length} Messages
                </strong>
              </div>
            </div>
          </div>

        </div>

        {/* MAIN CONTENT */}
        <div className="row g-4 mt-1">

          {/* LEFT: AI ASSISTANT */}
          <div className="col-lg-7">
            <div className="detail-section-card chat-section">

              <div className="detail-section-header">
                <div className="section-heading-icon chat-heading-icon">
                  <FaRobot />
                </div>

                <div>
                  <h4>AI Project Assistant</h4>
                  <p>
                    Get help organizing your project requirements.
                  </p>
                </div>

                <span className="ai-provider-label">
                  <span />
                  GROQ AI
                </span>
              </div>

              <div className="chat-window">

                {conversation.length === 0 ? (
                  <div className="chat-empty-state">
                    <div className="chat-empty-icon">
                      <FaStar />
                    </div>

                    <h5>Let's plan your project</h5>

                    <p>
                      Tell me about your {r.serviceType} project.
                      I'll help you collect the details needed
                      for an estimate.
                    </p>

                    <div className="chat-suggestions">
                      {[
                        "What details do you need?",
                        "Help me plan my project",
                        "What information should I provide?",
                      ].map((question, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setMsg(question)}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="chat-messages">
                    {conversation.map((m, i) => (
                      <div
                        key={i}
                        className={`chat-message-row ${
                          m.role === "user"
                            ? "message-user-row"
                            : "message-ai-row"
                        }`}
                      >
                        <div className="chat-avatar">
                          {m.role === "user" ? (
                            <FaUser />
                          ) : (
                            <FaRobot />
                          )}
                        </div>

                        <div
                          className={`chat-bubble ${
                            m.role === "user"
                              ? "chat-user"
                              : "chat-ai"
                          }`}
                        >
                          <span className="chat-sender">
                            {m.role === "user"
                              ? "You"
                              : "AI Assistant"}
                          </span>

                          <p>{m.text}</p>
                        </div>
                      </div>
                    ))}

                    {busy && (
                      <div className="chat-message-row message-ai-row">
                        <div className="chat-avatar">
                          <FaRobot />
                        </div>

                        <div className="chat-bubble chat-ai">
                          <span className="chat-sender">
                            AI Assistant
                          </span>

                          <div className="chat-typing">
                            <span />
                            <span />
                            <span />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              <form onSubmit={send} className="chat-input-area">
                <input
                  type="text"
                  className="form-control"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Ask something about your project..."
                  disabled={busy}
                />

                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={busy || !msg.trim()}
                  aria-label="Send message"
                >
                  <FaPaperPlane />
                </button>
              </form>

              <div className="chat-footer-note">
                <FaCheckCircle />
                AI responses are guidance, not verified measurements
                or final contractor quotations.
              </div>

            </div>
          </div>

          {/* RIGHT: PROPERTY PHOTOS */}
          <div className="col-lg-5">
            <div className="detail-section-card image-section">

              <div className="detail-section-header">
                <div className="section-heading-icon image-heading-icon">
                  <FaCamera />
                </div>

                <div>
                  <h4>Property Photos</h4>
                  <p>Upload photos for AI-assisted analysis.</p>
                </div>
              </div>

              <div className="gemini-provider-label">
                <FaStar />
                Powered by Gemini AI
              </div>

              {/* UPLOAD FORM */}
              <form onSubmit={upload}>
                <label className="image-upload-box">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFile(e.target.files?.[0] || null)
                    }
                    hidden
                    disabled={busy}
                  />

                  <div className="upload-icon">
                    <FaCloudUploadAlt />
                  </div>

                  <strong>Choose a property image</strong>

                  <span>
                    JPG, PNG or WEBP · Maximum 8 MB
                  </span>
                </label>

                {preview && (
                  <div className="selected-image-preview">
                    <img src={preview} alt="Selected property preview" />

                    <div className="selected-image-info">
                      <span>{file?.name}</span>
                      <small>
                        {file
                          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                          : ""}
                      </small>
                    </div>

                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="remove-image-btn"
                      aria-label="Remove selected image"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="image-upload-btn"
                  disabled={!file || busy}
                >
                  <FaCloudUploadAlt />
                  {busy ? "Processing..." : "Upload & Analyse Image"}
                </button>
              </form>

              {/* UPLOADED IMAGES */}
              <div className="uploaded-images-heading">
                <h5>Uploaded Images</h5>
                <span>{images.length}</span>
              </div>

              {images.length === 0 ? (
                <div className="no-images-state">
                  <FaImage />
                  <p>No property images uploaded yet.</p>
                </div>
              ) : (
                <div className="uploaded-image-list">
                  {images.map((im, i) => (
                    <div className="uploaded-image-card" key={im.publicId || i}>

                      <a
                        href={im.url}
                        target="_blank"
                        rel="noreferrer"
                        className="uploaded-image-link"
                      >
                        <img
                          src={im.url}
                          alt={`Property ${i + 1}`}
                        />
                      </a>

                      <div className="uploaded-image-content">
                        <div className="uploaded-image-title">
                          <strong>Property Image {i + 1}</strong>
                          <span>
                            <FaCheckCircle />
                            Saved
                          </span>
                        </div>

                        <div className="gemini-analysis-heading">
                          <FaStar />
                          Gemini Image Analysis
                        </div>

                        <div className="gemini-analysis-text">
                          {im.analysis ||
                            "No image analysis available."}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="alert alert-danger detail-error">
            {error}
          </div>
        )}

      </div>
    </div>
  );
}
