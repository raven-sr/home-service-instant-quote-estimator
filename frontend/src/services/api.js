
import axios from "axios";

// ========================================
// AXIOS INSTANCE
// ========================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
    : "http://localhost:5000/api",
  withCredentials: true,
});

// ========================================
// REQUEST INTERCEPTOR
// ========================================

api.interceptors.request.use(
  (config) => {
    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData
    ) {
      if (config.headers?.delete) {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ========================================
// CONTRACTOR PROFILE APIs
// ========================================

export const getContractorProfile = async () => {
  const response = await api.get("/contractors/profile");
  return response.data;
};

export const updateContractorProfile = async (profileData) => {
  const response = await api.put(
    "/contractors/profile",
    profileData
  );
  return response.data;
};



// ========================================
// CONTRACTOR PRICING APIs
// ========================================

export const getContractorPricing = async () => {
  const response = await api.get("/contractor-pricing");
  return response.data;
};

export const updateContractorPricing = async (pricingData) => {
  const response = await api.put(
    "/contractor-pricing",
    pricingData
  );

  return response.data;
};


// ========================================
// CONTRACTOR REQUEST APIs
// ========================================

export const getContractorRequests = async () => {
  const response = await api.get("/contractors/requests");
  return response.data;
};

export const claimContractorRequest = async (requestId) => {
  const response = await api.patch(
    `/contractors/requests/${requestId}/claim`
  );
  return response.data;
};

// ========================================
// ROOFING APIs
// ========================================

export const verifyRoofMeasurements = async (
  requestId,
  measurements
) => {
  const response = await api.put(
    `/roofing/${requestId}/verify`,
    measurements
  );

  return response.data;
};

export const calculateRoofingQuotation = async (
  requestId,
  wastagePercentage = 0
) => {
  const response = await api.post(
    `/roofing/${requestId}/calculate`,
    { wastagePercentage }
  );

  return response.data;
};

// ========================================
// PAINTING APIs
// ========================================

export const verifyPaintingMeasurements = async (
  requestId,
  paintableArea
) => {
  const response = await api.put(
    `/painting/${requestId}/verify`,
    { paintableArea }
  );

  return response.data;
};

export const calculatePaintingQuotation = async (requestId) => {
  const response = await api.post(
    `/painting/${requestId}/calculate`
  );

  return response.data;
};

// ========================================
// QUOTATION APIs
// ========================================

export const getMyQuotations = async () => {
  const response = await api.get("/quotations");
  return response.data;
};

export const getQuotationById = async (quotationId) => {
  const response = await api.get(
    `/quotations/${quotationId}`
  );

  return response.data;
};

export const downloadQuotationPDF = async (quotationId) => {
  const response = await api.get(
    `/quotations/${quotationId}/pdf`,
    {
      responseType: "blob",
    }
  );

  const pdfBlob = new Blob([response.data], {
    type: "application/pdf",
  });

  const downloadUrl = window.URL.createObjectURL(pdfBlob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `quotation-${quotationId}.pdf`;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(downloadUrl);

  return response.data;
};

// ========================================
// EXPORT AXIOS INSTANCE
// ========================================

export default api;
