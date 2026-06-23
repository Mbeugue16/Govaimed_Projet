// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { postData } from "../api/endpoint";

const initialFormData = {
  fullName: "",
  email: "",
  password: "",
  role: "Patient",

  // détails par rôle
  patientDetails: {
    dateNaissance: "",
    sexe: "",
    contact: "",
  },
  medecinDetails: {
    specialite: "",
    telephone: "",
    adresseCabinet: "",
  },
  pharmacienDetails: {
    nomPharmacie: "",
    adressePharmacie: "",
  },
  assistantDetails: {
    poste: "",
    serviceId: "",
  },
  adminDetails: {
    adminCode: "",
    permissions: "",
  },
  moderatorDetails: {
    moderatedSections: "",
  },
};

const Register = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // gestion des champs simples et des champs imbriqués (ex: medecinDetails.specialite)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");

    if (name.includes(".")) {
      const [group, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [group]: {
          ...prev[group],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const splitList = (text) =>
    text.split(",").map((item) => item.trim()).filter(Boolean);

  // construit le payload adapté au modèle Mongoose
  const buildPayload = () => {
    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === "Patient") {
      payload.patientDetails = {
        dateNaissance: formData.patientDetails.dateNaissance || undefined,
        sexe: formData.patientDetails.sexe || undefined,
        contact: formData.patientDetails.contact.trim(),
      };
    }

    if (formData.role === "Medecin") {
      payload.medecinDetails = {
        specialite: formData.medecinDetails.specialite.trim(),
        telephone: formData.medecinDetails.telephone.trim(),
        adresseCabinet: formData.medecinDetails.adresseCabinet.trim(),
      };
    }

    if (formData.role === "Pharmacien") {
      payload.pharmacienDetails = {
        nomPharmacie: formData.pharmacienDetails.nomPharmacie.trim(),
        adressePharmacie: formData.pharmacienDetails.adressePharmacie.trim(),
      };
    }

    if (formData.role === "Assistant") {
      payload.assistantDetails = {
        poste: formData.assistantDetails.poste.trim(),
        // attention: ici le backend attend un ObjectId.
        serviceId: formData.assistantDetails.serviceId || undefined,
      };
    }

    if (formData.role === "Admin" || formData.role === "SuperAdmin") {
      payload.adminDetails = {
        adminCode: formData.adminDetails.adminCode.trim(),
        permissions: splitList(formData.adminDetails.permissions),
      };
    }

    if (formData.role === "Moderateur") {
      payload.moderatorDetails = {
        moderatedSections: splitList(
          formData.moderatorDetails.moderatedSections
        ),
      };
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = buildPayload();
      console.log("📦 Payload envoyé à /auth/register:", payload);
      const data = await postData("/auth/register", payload);
      alert(data.message || "Inscription réussie ! Veuillez vous connecter.");
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    boxSizing: "border-box",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: 20,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 40,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: 450,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 30,
            color: "#0b3c5d",
          }}
        >
          Inscription
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#fee",
              color: "#c33",
              padding: 12,
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Nom complet"
            value={formData.fullName}
            onChange={handleChange}
            required
            disabled={loading}
            style={inputStyle}
          />
          <input
            name="email"
            type="email"
            placeholder="email@exemple.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            style={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            disabled={loading}
            style={inputStyle}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
            style={inputStyle}
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

          {/* Champs pour Patient */}
          {formData.role === "Patient" && (
            <>
              <input
                type="date"
                name="patientDetails.dateNaissance"
                value={formData.patientDetails.dateNaissance}
                onChange={handleChange}
                disabled={loading}
                style={inputStyle}
              />
              <select
                name="patientDetails.sexe"
                value={formData.patientDetails.sexe}
                onChange={handleChange}
                disabled={loading}
                style={inputStyle}
              >
                <option value="">Sexe</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
              <input
                name="patientDetails.contact"
                placeholder="Contact"
                value={formData.patientDetails.contact}
                onChange={handleChange}
                disabled={loading}
                style={inputStyle}
              />
            </>
          )}

          {/* Champs pour Médecin */}
          {formData.role === "Medecin" && (
            <>
              <input
                name="medecinDetails.specialite"
                placeholder="Spécialité"
                value={formData.medecinDetails.specialite}
                onChange={handleChange}
                required
                disabled={loading}
                style={inputStyle}
              />
              <input
                name="medecinDetails.telephone"
                placeholder="Téléphone"
                value={formData.medecinDetails.telephone}
                onChange={handleChange}
                required
                disabled={loading}
                style={inputStyle}
              />
              <input
                name="medecinDetails.adresseCabinet"
                placeholder="Adresse du cabinet"
                value={formData.medecinDetails.adresseCabinet}
                onChange={handleChange}
                required
                disabled={loading}
                style={inputStyle}
              />
            </>
          )}

          {/* Champs pour Pharmacien */}
          {formData.role === "Pharmacien" && (
            <>
              <input
                name="pharmacienDetails.nomPharmacie"
                placeholder="Nom pharmacie"
                value={formData.pharmacienDetails.nomPharmacie}
                onChange={handleChange}
                required
                disabled={loading}
                style={inputStyle}
              />
              <input
                name="pharmacienDetails.adressePharmacie"
                placeholder="Adresse pharmacie"
                value={formData.pharmacienDetails.adressePharmacie}
                onChange={handleChange}
                required
                disabled={loading}
                style={inputStyle}
              />
            </>
          )}

          {/* Champs pour Assistant */}
          {formData.role === "Assistant" && (
            <>
              <input
                name="assistantDetails.poste"
                placeholder="Poste"
                value={formData.assistantDetails.poste}
                onChange={handleChange}
                required
                disabled={loading}
                style={inputStyle}
              />
              <input
                name="assistantDetails.serviceId"
                placeholder="Service ID (ObjectId de Service)"
                value={formData.assistantDetails.serviceId}
                onChange={handleChange}
                required
                disabled={loading}
                style={inputStyle}
              />
            </>
          )}

          {/* Champs pour Admin / SuperAdmin */}
          {(formData.role === "Admin" || formData.role === "SuperAdmin") && (
            <>
              <input
                name="adminDetails.adminCode"
                placeholder="Code admin"
                value={formData.adminDetails.adminCode}
                onChange={handleChange}
                required
                disabled={loading}
                style={inputStyle}
              />
              <input
                name="adminDetails.permissions"
                placeholder="Permissions séparées par virgules"
                value={formData.adminDetails.permissions}
                onChange={handleChange}
                disabled={loading}
                style={inputStyle}
              />
            </>
          )}

          {/* Champs pour Modérateur */}
          {formData.role === "Moderateur" && (
            <input
              name="moderatorDetails.moderatedSections"
              placeholder="Sections modérées séparées par virgules"
              value={formData.moderatorDetails.moderatedSections}
              onChange={handleChange}
              disabled={loading}
              style={inputStyle}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 15,
              backgroundColor: loading ? "#ccc" : "#0b3c5d",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: "bold",
            }}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to="/login" style={{ color: "#0b3c5d" }}>
            Déjà inscrit ? Connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;