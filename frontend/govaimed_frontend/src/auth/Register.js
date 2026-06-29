import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUserPlus, FiAlertCircle } from "react-icons/fi";
import { FaHeartbeat, FaShieldAlt, FaUsers } from "react-icons/fa";
import { postData } from "../api/endpoint";
import "../Styles/Auth.css";

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

  const fieldClass = "auth-input auth-input-no-icon";

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
            <div className="auth-icon-circle"><FaHeartbeat size={28} /></div>
            <div className="auth-icon-circle"><FaShieldAlt size={28} /></div>
            <div className="auth-icon-circle"><FaUsers size={28} /></div>
          </div>
          <h2>Rejoignez GovAiMed</h2>
          <p>
            Créez votre compte et accédez à une plateforme sanitaire
            moderne conçue pour patients, professionnels et administrateurs.
          </p>
        </div>
      </motion.div>

      <div className="auth-form-side">
        <motion.div
          className="auth-card auth-card-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="auth-title">Inscription</h1>
          <p className="auth-subtitle">Créez votre compte GovAiMed</p>

          {error && (
            <div className="auth-error" role="alert">
              <FiAlertCircle /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="fullName">Nom complet</label>
              <input
                id="fullName"
                name="fullName"
                placeholder="Nom complet"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
                className={fieldClass}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="email@exemple.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className={fieldClass}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Mot de passe (min. 6 caractères)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                disabled={loading}
                className={fieldClass}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="role">Rôle</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                className="auth-select"
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

          {formData.role === "Patient" && (
            <div className="auth-role-section">
              <p className="auth-role-title">Informations patient</p>
              <div className="auth-field">
                <label htmlFor="dateNaissance">Date de naissance</label>
                <input
                  id="dateNaissance"
                  type="date"
                  name="patientDetails.dateNaissance"
                  value={formData.patientDetails.dateNaissance}
                  onChange={handleChange}
                  disabled={loading}
                  className={fieldClass}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="sexe">Sexe</label>
                <select
                  id="sexe"
                  name="patientDetails.sexe"
                  value={formData.patientDetails.sexe}
                  onChange={handleChange}
                  disabled={loading}
                  className="auth-select"
                >
                  <option value="">Sexe</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
              </div>
              <div className="auth-field">
                <label htmlFor="contact">Contact</label>
                <input
                  id="contact"
                  name="patientDetails.contact"
                  placeholder="Contact"
                  value={formData.patientDetails.contact}
                  onChange={handleChange}
                  disabled={loading}
                  className={fieldClass}
                />
              </div>
            </div>
          )}

          {formData.role === "Medecin" && (
            <div className="auth-role-section">
              <p className="auth-role-title">Informations médecin</p>
              <div className="auth-field">
                <input name="medecinDetails.specialite" placeholder="Spécialité" value={formData.medecinDetails.specialite} onChange={handleChange} required disabled={loading} className={fieldClass} />
              </div>
              <div className="auth-field">
                <input name="medecinDetails.telephone" placeholder="Téléphone" value={formData.medecinDetails.telephone} onChange={handleChange} required disabled={loading} className={fieldClass} />
              </div>
              <div className="auth-field">
                <input name="medecinDetails.adresseCabinet" placeholder="Adresse du cabinet" value={formData.medecinDetails.adresseCabinet} onChange={handleChange} required disabled={loading} className={fieldClass} />
              </div>
            </div>
          )}

          {formData.role === "Pharmacien" && (
            <div className="auth-role-section">
              <p className="auth-role-title">Informations pharmacien</p>
              <div className="auth-field">
                <input name="pharmacienDetails.nomPharmacie" placeholder="Nom pharmacie" value={formData.pharmacienDetails.nomPharmacie} onChange={handleChange} required disabled={loading} className={fieldClass} />
              </div>
              <div className="auth-field">
                <input name="pharmacienDetails.adressePharmacie" placeholder="Adresse pharmacie" value={formData.pharmacienDetails.adressePharmacie} onChange={handleChange} required disabled={loading} className={fieldClass} />
              </div>
            </div>
          )}

          {formData.role === "Assistant" && (
            <div className="auth-role-section">
              <p className="auth-role-title">Informations assistant</p>
              <div className="auth-field">
                <input name="assistantDetails.poste" placeholder="Poste" value={formData.assistantDetails.poste} onChange={handleChange} required disabled={loading} className={fieldClass} />
              </div>
              <div className="auth-field">
                <input name="assistantDetails.serviceId" placeholder="Service ID (ObjectId de Service)" value={formData.assistantDetails.serviceId} onChange={handleChange} required disabled={loading} className={fieldClass} />
              </div>
            </div>
          )}

          {(formData.role === "Admin" || formData.role === "SuperAdmin") && (
            <div className="auth-role-section">
              <p className="auth-role-title">Informations administrateur</p>
              <div className="auth-field">
                <input name="adminDetails.adminCode" placeholder="Code admin" value={formData.adminDetails.adminCode} onChange={handleChange} required disabled={loading} className={fieldClass} />
              </div>
              <div className="auth-field">
                <input name="adminDetails.permissions" placeholder="Permissions séparées par virgules" value={formData.adminDetails.permissions} onChange={handleChange} disabled={loading} className={fieldClass} />
              </div>
            </div>
          )}

          {formData.role === "Moderateur" && (
            <div className="auth-role-section">
              <div className="auth-field">
                <input name="moderatorDetails.moderatedSections" placeholder="Sections modérées séparées par virgules" value={formData.moderatorDetails.moderatedSections} onChange={handleChange} disabled={loading} className={fieldClass} />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="auth-btn">
            <FiUserPlus aria-hidden="true" />
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="auth-footer-link">
          <Link to="/login">Déjà inscrit ? Connexion</Link>
        </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;