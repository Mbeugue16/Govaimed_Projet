import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from "react-icons/fi";
import { FaStethoscope, FaHospital, FaUserMd } from "react-icons/fa";
import { postData, setAuthToken } from "../api/endpoint";
import { persistUserSession } from "../utils/authSession";
import "../Styles/Auth.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await postData("/auth/login", credentials);

      setAuthToken(data.token);
      persistUserSession(data.token, data.user);

      const roleRoutes = {
        Patient: "/patient/dashboard",
        Medecin: "/medecin",
        Admin: "/admin",
        SuperAdmin: "/admin",
        Moderateur: "/moderateur",
        Pharmacien: "/pharmacien",
        Assistant: "/service",
        AideSoignant: "/service",
        Stagiaire: "/service",
        MediateurNumerique: "/service",
      };

      navigate(roleRoutes[data.user?.role] || "/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Erreur de connexion, vérifiez vos identifiants"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-illustration"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-illustration-content">
          <div className="auth-illustration-icons">
            <div className="auth-icon-circle"><FaStethoscope size={28} /></div>
            <div className="auth-icon-circle"><FaHospital size={28} /></div>
            <div className="auth-icon-circle"><FaUserMd size={28} /></div>
          </div>
          <h2>Bienvenue sur GovAiMed</h2>
          <p>
            Accédez à votre espace sécurisé pour gérer vos dossiers médicaux,
            rendez-vous et prescriptions en toute confiance.
          </p>
        </div>
      </motion.div>

      <div className="auth-form-side">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="auth-title">Connexion</h1>
          <p className="auth-subtitle">Connectez-vous à votre compte GovAiMed</p>

          {error && (
            <div className="auth-error" role="alert">
              <FiAlertCircle /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <div className="auth-input-wrap">
                <FiMail className="auth-input-icon" aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="votre.email@exemple.com"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="auth-input"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Mot de passe</label>
              <div className="auth-input-wrap">
                <FiLock className="auth-input-icon" aria-hidden="true" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Votre mot de passe"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="auth-input"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="auth-forgot">
              <Link to="/forgot-password">Mot de passe oublié ?</Link>
            </div>

            <button type="submit" disabled={loading} className="auth-btn">
              <FiLogIn aria-hidden="true" />
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>

            <div className="auth-footer-link">
              <Link to="/register">Pas de compte ? S&apos;inscrire</Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
