import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiFolder, FiCalendar, FiUsers, FiFileText,
  FiBell, FiClock, FiActivity,
} from "react-icons/fi";
import { FaUserMd } from "react-icons/fa";
import { getData } from "../../api/endpoint";
import { useAuth } from "../../context/AuthContext";
import { getGreeting, formatDateFr, getFirstName } from "../../utils/userDisplay";
import { SkeletonList } from "../../components/ui/Skeleton";
import PageTransition from "../../components/ui/PageTransition";

const mainCards = [
  { to: "mes-dossiers", icon: FiFolder, emoji: "📁", label: "Mes dossiers", desc: "Consultez vos dossiers médicaux" },
  { to: "nouveau-rdv", icon: FiCalendar, emoji: "📅", label: "Mes rendez-vous", desc: "Planifier une consultation" },
  { to: "mes-medecins", icon: FiUsers, emoji: "👨‍⚕️", label: "Mes médecins", desc: "Vos praticiens de confiance" },
  { to: "prescriptions", icon: FiFileText, emoji: "💊", label: "Mes prescriptions", desc: "Ordonnances et traitements" },
];

const DashboardHome = () => {
  const { user } = useAuth();
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData("/patient/dossiers");
        setDossiers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const medecinsUniques = [
    ...new Map(
      dossiers
        .filter((d) => d.medecin?._id || d.medecin?.fullName)
        .map((d) => [d.medecin?._id || d.medecin?.fullName, d.medecin])
    ).values(),
  ];

  const dernierDossier = dossiers[0];
  const dernierMedecin = dernierDossier?.medecin?.fullName;

  return (
    <PageTransition className="patient-home">
      <header className="patient-welcome">
        <div>
          <h1>{getGreeting(user)}</h1>
          <p className="patient-date">{formatDateFr()}</p>
          <p className="patient-summary">
            Bienvenue, {getFirstName(user)} ! Voici un résumé de votre espace santé.
          </p>
        </div>
      </header>

      <div className="patient-quick-stats">
        {loading ? (
          <SkeletonList count={3} />
        ) : (
          <>
            <div className="quick-stat">
              <span className="quick-stat-value">{dossiers.length}</span>
              <span className="quick-stat-label">Dossier{dossiers.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-value">{medecinsUniques.length}</span>
              <span className="quick-stat-label">Médecin{medecinsUniques.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-value">{dernierMedecin ? '✓' : '—'}</span>
              <span className="quick-stat-label">Dernière consultation</span>
            </div>
          </>
        )}
      </div>

      <nav className="patient-main-cards" aria-label="Accès rapide">
        {mainCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to={card.to} className="patient-card">
              <span className="patient-card-emoji" aria-hidden="true">{card.emoji}</span>
              <div>
                <strong>{card.label}</strong>
                <span>{card.desc}</span>
              </div>
              <card.icon className="patient-card-icon" aria-hidden="true" />
            </Link>
          </motion.div>
        ))}
      </nav>

      <div className="patient-panels">
        <section className="patient-panel">
          <h2><FiActivity aria-hidden="true" /> Activité récente</h2>
          {loading ? (
            <SkeletonList count={2} />
          ) : dossiers.length === 0 ? (
            <p className="panel-empty">Aucune activité récente. Prenez rendez-vous pour commencer.</p>
          ) : (
            <ul className="panel-list">
              {dossiers.slice(0, 3).map((d) => (
                <li key={d._id}>
                  <FiFolder aria-hidden="true" />
                  <div>
                    <strong>Dossier médical</strong>
                    <span>Dr. {d.medecin?.fullName || '—'}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="patient-panel">
          <h2><FiBell aria-hidden="true" /> Notifications</h2>
          <p className="panel-empty">
            Aucune notification pour le moment.
            <Link to="notifications" className="panel-link"> Voir tout</Link>
          </p>
        </section>

        <section className="patient-panel patient-panel-wide">
          <h2><FiClock aria-hidden="true" /> Prochains rendez-vous</h2>
          <p className="panel-empty">
            Aucun rendez-vous planifié.
            <Link to="nouveau-rdv" className="panel-link"> Prendre rendez-vous</Link>
          </p>
        </section>

        {dernierMedecin && (
          <section className="patient-panel">
            <h2><FaUserMd aria-hidden="true" /> Dernier médecin consulté</h2>
            <div className="doctor-chip">
              <div className="doctor-avatar">{dernierMedecin.charAt(0)}</div>
              <div>
                <strong>Dr. {dernierMedecin}</strong>
                <span>{dernierDossier?.medecin?.email || ''}</span>
              </div>
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
};

export default DashboardHome;
