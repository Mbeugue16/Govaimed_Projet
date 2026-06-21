import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getData, postData } from "../api/endpoint";
import "../Styles/MedecinDashboard.css";

const MedecinDashboard = () => {
  const [rendezvous, setRendezvous] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTodayRendezVous = async () => {
    try {
      const data = await getData("/rendezvous/medecin/aujourdhui");
      setRendezvous(data || []);
    } catch (error) {
      console.error("Erreur chargement RDV:", error);
    }
  };

  useEffect(() => {
    fetchTodayRendezVous();
  }, []);

  const handleNextPatient = async () => {
    try {
      setLoading(true);
      await postData("/rendezvous/medecin/patient-suivant");
      await fetchTodayRendezVous();
    } catch (error) {
      console.error("Erreur patient suivant:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="MedecinDashboard">
      <p>Bienvenue sur votre espace médecin !</p>
      <h1>👨‍⚕️ Dashboard Médecin</h1>

      {/* ===================== Navigation / Cartes ===================== */}
      <nav className="dashboard-cards">
        <Link to="/medecin/create-dossier" className="card">
          <span className="icon">➕</span>
          <strong>Créer Dossier</strong>
        </Link>

        <Link to="/medecin/mes-dossiers" className="card">
          <span className="icon">📂</span>
          <strong>Mes Dossiers</strong>
        </Link>

        <Link to="/medecin/rendezvous" className="card">
          <span className="icon">📅</span>
          <strong>Rendez-vous</strong>
        </Link>
      </nav>

      {/* ===================== File d’attente ===================== */}
      <section className="file-attente">
        <h2>📋 Rendez-vous d’aujourd’hui</h2>

        <button onClick={handleNextPatient} disabled={loading}>
          {loading ? "⏳ Chargement..." : "➡️ Patient suivant"}
        </button>

        {rendezvous.length === 0 ? (
          <p className="empty">Aucun rendez-vous aujourd’hui</p>
        ) : (
          <ul>
            {rendezvous.map((rdv) => (
              <li key={rdv._id}>
                <span className="rang">#{rdv.rang}</span>
                <span className="nom">{rdv.patientId?.fullName}</span>
                <span className={`statut ${rdv.statut}`}>
                  {rdv.statut.replace("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default MedecinDashboard;