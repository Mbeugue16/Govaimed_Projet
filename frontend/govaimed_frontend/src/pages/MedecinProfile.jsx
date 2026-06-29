import React from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiShield } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getDisplayName, getFirstName } from "../utils/userDisplay";
import PageTransition from "../components/ui/PageTransition";
import "../Styles/PatientApp.css";

const MedecinProfile = () => {
  const { user } = useAuth();
  const displayName = getDisplayName(user);

  return (
    <PageTransition className="patient-page dashboard-page">
      <div className="dashboard-inner">
        <Link to="/medecin" className="patient-back-link">← Retour au tableau de bord</Link>
        <div className="patient-page-header">
          <h1>Mon profil</h1>
          <p>Vos informations professionnelles</p>
        </div>
        <div className="profile-card-main">
          <div className="profile-photo-placeholder">
            {getFirstName(user).charAt(0).toUpperCase()}
          </div>
          <div className="profile-main-info">
            <h2>Dr. {displayName}</h2>
            <span className="profile-role-badge">{user?.role}</span>
          </div>
        </div>
        <div className="profile-fields">
          {[
            { icon: FiUser, label: "Nom complet", value: displayName },
            { icon: FiMail, label: "Email", value: user?.email || "—" },
            { icon: FiShield, label: "Statut", value: user?.statut || "ACTIF" },
          ].map((field) => (
            <div key={field.label} className="profile-field">
              <field.icon aria-hidden="true" />
              <div>
                <span className="field-label">{field.label}</span>
                <span className="field-value">{field.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default MedecinProfile;
