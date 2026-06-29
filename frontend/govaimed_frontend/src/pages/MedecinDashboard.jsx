import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlus, FiFolder, FiCalendar, FiUsers, FiActivity,
} from "react-icons/fi";
import { getData, postData } from "../api/endpoint";
import { useAuth } from "../context/AuthContext";
import { getDisplayName, getFirstName, getGreeting } from "../utils/userDisplay";
import "../Styles/Dashboard.css";

const MedecinDashboard = () => {
  const [rendezvous, setRendezvous] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const displayName = getDisplayName(user);
  const initials = getFirstName(user).charAt(0).toUpperCase();

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

  const navCards = [
    { to: "/medecin/create-dossier", icon: FiPlus, label: "Créer Dossier" },
    { to: "/medecin/mes-dossiers", icon: FiFolder, label: "Mes Dossiers" },
    { to: "/medecin/rendezvous", icon: FiCalendar, label: "Rendez-vous" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <div className="dashboard-greeting">
            <h1>Dashboard Médecin</h1>
            <p>{getGreeting(user).replace('👋', '')} — votre espace de consultation.</p>
          </div>
          <div className="dashboard-avatar" aria-label={`Avatar de ${displayName}`}>
            {initials}
          </div>
        </div>

        <div className="dashboard-stats">
          {[
            { icon: FiUsers, value: rendezvous.length, label: 'RDV aujourd\'hui', yellow: true },
            { icon: FiCalendar, value: rendezvous.filter(r => r.statut === 'EN_COURS').length, label: 'En cours', yellow: false },
            { icon: FiActivity, value: rendezvous.filter(r => r.statut === 'TERMINE').length, label: 'Terminés', yellow: false },
            { icon: FiFolder, value: '—', label: 'Dossiers', yellow: true },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              whileHover={{ y: -3 }}
            >
              <div className={`stat-card-icon ${stat.yellow ? 'yellow' : ''}`}>
                <stat.icon size={22} aria-hidden="true" />
              </div>
              <div>
                <span className="stat-card-value">{stat.value}</span>
                <span className="stat-card-label">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <nav className="dashboard-cards" aria-label="Navigation médecin">
          {navCards.map((card) => (
            <Link key={card.label} to={card.to} className="dash-card">
              <card.icon className="dash-card-icon" aria-hidden="true" />
              <strong>{card.label}</strong>
            </Link>
          ))}
        </nav>

        <section className="dashboard-panel">
          <h2><FiCalendar aria-hidden="true" /> Rendez-vous d&apos;aujourd&apos;hui</h2>

          <button
            type="button"
            className="btn-action"
            onClick={handleNextPatient}
            disabled={loading}
          >
            {loading ? "Chargement..." : "Patient suivant"}
          </button>

          {rendezvous.length === 0 ? (
            <p className="empty-state">Aucun rendez-vous aujourd&apos;hui</p>
          ) : (
            <ul className="dashboard-list">
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
    </div>
  );
};

export default MedecinDashboard;
