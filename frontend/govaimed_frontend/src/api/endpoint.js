// src/api/endpoint.js
import axios from "axios";

//  BASE URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

//  TOKEN MANAGEMENT 
const TOKEN_KEY = "token";

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeAuthToken = () => localStorage.removeItem(TOKEN_KEY);

// AXIOS INSTANCE
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Ajouter le token automatiquement à chaque requête
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// DECODE JWT 
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const isTokenValid = (token) => {
  if (!token) return false;
  const decoded = decodeToken(token);
  return decoded && decoded.exp * 1000 > Date.now();
};

// ERROR HANDLER
export const handleApiError = (error) => {
  if (!error.response) return new Error("Erreur réseau ou serveur indisponible");

  const { status, data } = error.response;

  if (status === 401) {
    removeAuthToken();
    window.location.href = "/login";
    return new Error("Session expirée. Redirection vers login...");
  }

  if (status === 403) return new Error(data.message || "🔒 Accès refusé");
  if (status === 404) return new Error("📁 Endpoint non trouvé");

  // MongoDB doublon
  if (data?.errorName === 'MongoServerError' && data.code === 11000) {
    return new Error("⚠️ Données en doublon");
  }

  // Validation errors
  if (data?.validationErrors) {
    const errors = Object.values(data.validationErrors)
      .map(err => err.message)
      .join("; ");
    return new Error(`Validation: ${errors}`);
  }

  return new Error(data?.message || `Erreur ${status}`);
};

//  API METHODS
export const getData = async (endpoint, params = {}) => {
  try {
    const res = await axiosInstance.get(endpoint, { params });
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const postData = async (endpoint, payload) => {
  try {
    const res = await axiosInstance.post(endpoint, payload);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const putData = async (endpoint, payload) => {
  try {
    const res = await axiosInstance.put(endpoint, payload);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

export const deleteData = async (endpoint) => {
  try {
    const res = await axiosInstance.delete(endpoint);
    return res.data;
  } catch (err) {
    throw handleApiError(err);
  }
};

// EXPORT DEFAULT 
export default {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  decodeToken,
  isTokenValid,
  getData,
  postData,
  putData,
  deleteData
};