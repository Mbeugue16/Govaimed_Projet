import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import { getData } from "../../api/endpoint";
import PageTransition from "../../components/ui/PageTransition";
import { SkeletonList } from "../../components/ui/Skeleton";
import "../../Styles/PatientApp.css";

const PatientPrescriptions = () => {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getData("/patient/dossiers");
        setDossiers(Array.isArray(data) ? data : []);
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
        <h1>Mes prescriptions</h1>
        <p>Vos ordonnances et traitements en cours</p>
      </div>

      {loading ? (
        <SkeletonList count={3} />
      ) : dossiers.length === 0 ? (
        <div className="panel-empty-state">
          <FiFileText size={40} aria-hidden="true" />
          <p>Aucune prescription disponible.</p>
          <Link to="../mes-dossiers" className="btn-patient-primary">Voir mes dossiers</Link>
        </div>
      ) : (
        <div className="prescription-list">
          {dossiers.map((d) => (
            <div key={d._id} className="prescription-card">
              <FiFileText aria-hidden="true" />
              <div>
                <strong>Dossier — Dr. {d.medecin?.fullName || '—'}</strong>
                <p>{d.resumeMedical || 'Résumé médical disponible dans le dossier complet.'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
};

export default PatientPrescriptions;
