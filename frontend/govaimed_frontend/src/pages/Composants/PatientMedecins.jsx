import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiMail } from "react-icons/fi";
import { getData } from "../../api/endpoint";
import PageTransition from "../../components/ui/PageTransition";
import { SkeletonList } from "../../components/ui/Skeleton";
import "../../Styles/PatientApp.css";

const PatientMedecins = () => {
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const dossiers = await getData("/patient/dossiers");
        const unique = [
          ...new Map(
            (Array.isArray(dossiers) ? dossiers : [])
              .filter((d) => d.medecin)
              .map((d) => [d.medecin._id || d.medecin.fullName, d.medecin])
          ).values(),
        ];
        setMedecins(unique);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageTransition className="patient-page">
      <div className="patient-page-header">
        <h1>Mes médecins</h1>
        <p>Vos praticiens de confiance</p>
      </div>

      {loading ? (
        <SkeletonList count={3} />
      ) : medecins.length === 0 ? (
        <div className="panel-empty-state">
          <FiUsers size={40} aria-hidden="true" />
          <p>Aucun médecin associé pour le moment.</p>
          <Link to="../nouveau-rdv" className="btn-patient-primary">Prendre rendez-vous</Link>
        </div>
      ) : (
        <div className="medecin-grid">
          {medecins.map((med) => (
            <div key={med._id || med.fullName} className="medecin-card">
              <div className="doctor-avatar lg">{med.fullName?.charAt(0) || 'D'}</div>
              <div>
                <strong>Dr. {med.fullName}</strong>
                {med.email && (
                  <span className="medecin-email">
                    <FiMail size={14} aria-hidden="true" /> {med.email}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
};

export default PatientMedecins;
