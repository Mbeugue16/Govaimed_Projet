import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { postData, setAuthToken, decodeToken } from "../api/endpoint";

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
      const data = await postData("/auth/login", {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      });

      setAuthToken(data.token);

      const decoded = decodeToken(data.token);
      localStorage.setItem("user", JSON.stringify(decoded));

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

      navigate(roleRoutes[decoded.role] || "/", { replace: true });

    } catch (err) {
      setError(err.message || "Erreur de connexion, vérifiez vos identifiants");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Connexion</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={loading}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={loading}
            style={styles.input}
          />

          {/* 🔥 Lien Mot de passe oublié */}
          <div style={styles.forgotContainer}>
            <Link to="/forgot-password" style={styles.forgotLink}>
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? "#ccc" : "#0b3c5d",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <div style={styles.registerContainer}>
            <Link to="/register" style={styles.registerLink}>
              Pas de compte ? S'inscrire
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

//STYLES 

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#0b3c5d",
    fontSize: "28px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "15px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
    marginBottom: "15px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "15px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  forgotContainer: {
    textAlign: "right",
    marginBottom: "20px",
  },
  forgotLink: {
    fontSize: "14px",
    color: "#0b3c5d",
    textDecoration: "none",
    fontWeight: "500",
  },
  registerContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  registerLink: {
    color: "#0b3c5d",
    textDecoration: "none",
    fontWeight: "500",
  },
  error: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #fcc",
    fontSize: "14px",
  },
};

export default Login;