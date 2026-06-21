import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postData } from '../api/endpoint';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Patient"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await postData('/auth/register', formData);
      alert(data.message || "Inscription réussie ! Veuillez vous connecter.");
      navigate('/login');
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          color: '#0b3c5d', 
          fontSize: '28px', 
          fontWeight: 'bold' 
        }}>
          Inscription
        </h2>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fcc',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              name="fullName"
              placeholder="Nom complet"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: loading ? '#f9f9f9' : 'white'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              name="email"
              placeholder="email@exemple.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: loading ? '#f9f9f9' : 'white'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: loading ? '#f9f9f9' : 'white'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: loading ? '#f9f9f9' : 'white'
              }}
            >
              <option value="Patient">Patient</option>
              <option value="Medecin">Médecin</option>
              <option value="Pharmacien">Pharmacien</option>
              <option value="Assistant">Assistant / Guichet</option>
              <option value="AideSoignant">Aide-soignant</option>
              <option value="Stagiaire">Stagiaire</option>
              <option value="MediateurNumerique">Médiateur numérique</option>
              <option value="Moderateur">Modérateur</option>
              <option value="Admin">Administration</option>
              <option value="SuperAdmin">Super Administrateur</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: loading ? '#ccc' : '#0b3c5d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/login" style={{ color: '#0b3c5d', textDecoration: 'none', fontWeight: '500' }}>
            Déjà inscrit ? Connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;