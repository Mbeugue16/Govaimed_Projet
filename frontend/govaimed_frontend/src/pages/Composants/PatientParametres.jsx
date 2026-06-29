import React from "react";
import { FiSettings, FiShield, FiBell } from "react-icons/fi";
import PageTransition from "../../components/ui/PageTransition";
import "../../Styles/PatientApp.css";

const PatientParametres = () => (
  <PageTransition className="patient-page">
    <div className="patient-page-header">
      <h1>Paramètres</h1>
      <p>Personnalisez votre expérience GovAiMed</p>
    </div>
    <div className="settings-list">
      {[
        { icon: FiBell, label: "Notifications", desc: "Gérer les alertes et rappels" },
        { icon: FiShield, label: "Confidentialité", desc: "Protection de vos données médicales" },
        { icon: FiSettings, label: "Préférences", desc: "Langue et affichage" },
      ].map((item) => (
        <div key={item.label} className="settings-item">
          <item.icon aria-hidden="true" />
          <div>
            <strong>{item.label}</strong>
            <span>{item.desc}</span>
          </div>
        </div>
      ))}
    </div>
  </PageTransition>
);

export default PatientParametres;
