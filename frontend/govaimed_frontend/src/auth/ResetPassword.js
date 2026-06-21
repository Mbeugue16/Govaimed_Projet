import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/ResetPassword.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (form.password !== form.confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    try {
      setLoading(true);

      await axios.post(
        `http://localhost:5000/auth/reset-password/${token}`,
        {
          email: form.email,
          password: form.password,
          otp: form.otp,
        }
      );

      setMessage("Mot de passe mis à jour avec succès.");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setError("Informations invalides ou expirées.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">

        <div className="form-header">
          <h1>Réinitialisation du mot de passe</h1>
          <p>Veuillez confirmer votre identité pour continuer.</p>
        </div>

        <form className="medical-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email d'inscription</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Code de confirmation (OTP)</label>
            <input
              type="text"
              name="otp"
              required
              value={form.otp}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Vérification en cours..." : "Valider la réinitialisation"}
          </button>

        </form>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

      </div>
    </div>
  );
}