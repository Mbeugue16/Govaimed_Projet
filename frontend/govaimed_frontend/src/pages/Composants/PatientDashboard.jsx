import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../../Styles/PatientDashboard.css"; // CHEMIN CORRIGÉ

const PatientDashboard = () => {
  return (
    <div className="PatientDashboard">
      <h1>🩺 Tableau de bord patient</h1>
      <p>Bienvenue dans votre espace personnel !</p>

      {/* Cartes d'accès */}
      <nav className="dashboard-cards">
        <Link to="mes-dossiers" className="card">
          <span className="icon">📂</span>
          <strong>Mes Dossiers</strong>
        </Link>

        <Link to="nouveau-rdv" className="card">
          <span className="icon">➕</span>
          <strong>Prendre RDV</strong>
        </Link>

        <Link to="/logout" className="card logout">
          <span className="icon">🚪</span>
          <strong>Déconnexion</strong>
        </Link>
      </nav>

      {/* Contenu dynamique des routes enfants */}
      <div className="PatientDashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default PatientDashboard;