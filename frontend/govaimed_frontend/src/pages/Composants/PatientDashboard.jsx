import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import PageTransition from "../../components/ui/PageTransition";
import "../../Styles/PatientApp.css";

const PatientDashboard = () => {
  const location = useLocation();
  const isHome =
    location.pathname === "/patient/dashboard" ||
    location.pathname === "/patient/dashboard/";

  return (
    <div className="patient-app">
      <div className="patient-app-inner">
        {!isHome && (
          <PageTransition>
            <Link to="/patient/dashboard" className="patient-back-link">
              <FiArrowLeft aria-hidden="true" /> Retour au tableau de bord
            </Link>
          </PageTransition>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default PatientDashboard;
