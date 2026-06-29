import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiSend, FiArrowLeft } from "react-icons/fi";
import { FaShieldAlt } from "react-icons/fa";
import { postData } from "../api/endpoint";
import "../Styles/Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await postData("/auth/forgot-password", { email });
      setMessage(data.message);
      console.log("Lien :", data.resetUrl);
    } catch (err) {
      setMessage(err.message || "Une erreur est survenue");
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
            <div className="auth-icon-circle"><FaShieldAlt size={28} /></div>
          </div>
          <h2>Récupération de compte</h2>
          <p>Nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.</p>
        </div>
      </motion.div>

      <div className="auth-form-side">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="auth-title">Mot de passe oublié</h1>
          <p className="auth-subtitle">Entrez votre email pour recevoir un lien de réinitialisation</p>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <div className="auth-input-wrap">
                <FiMail className="auth-input-icon" aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="auth-input"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="auth-btn">
              <FiSend aria-hidden="true" />
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </form>

          {message && <p className="auth-subtitle" style={{ marginTop: 16, color: '#10b981' }}>{message}</p>}

          <div className="auth-footer-link">
            <Link to="/login"><FiArrowLeft aria-hidden="true" /> Retour à la connexion</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
