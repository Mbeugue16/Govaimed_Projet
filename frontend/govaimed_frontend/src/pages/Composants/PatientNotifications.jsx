import React from "react";
import { FiBell } from "react-icons/fi";
import PageTransition from "../../components/ui/PageTransition";
import "../../Styles/PatientApp.css";

const PatientNotifications = () => (
  <PageTransition className="patient-page">
    <div className="patient-page-header">
      <h1>Notifications</h1>
      <p>Vos alertes et rappels de santé</p>
    </div>
    <div className="panel-empty-state">
      <FiBell size={40} aria-hidden="true" />
      <p>Vous n&apos;avez aucune notification pour le moment.</p>
      <span className="panel-hint">Les rappels de rendez-vous apparaîtront ici.</span>
    </div>
  </PageTransition>
);

export default PatientNotifications;
