import React, { useEffect, useState } from "react";
import { FiFolder, FiUser } from "react-icons/fi";
import { getData } from "../../api/endpoint";
import PageTransition from "../../components/ui/PageTransition";
import { SkeletonList } from "../../components/ui/Skeleton";
import "../../Styles/PatientApp.css";

const MyDossiers = () => {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        const data = await getData("/patient/dossiers");
        setDossiers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchDossiers();
  }, []);

  return (
    <PageTransition className="patient-page">
      <div className="patient-page-header">
        <h1>Mes dossiers médicaux</h1>
        <p>Consultez l&apos;historique de vos dossiers de santé</p>
      </div>

      {loading && <SkeletonList count={3} />}

      {!loading && error && (
        <div className="panel-empty-state">
          <p style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}

      {!loading && !error && dossiers.length === 0 && (
        <div className="panel-empty-state">
          <FiFolder size={40} aria-hidden="true" />
          <p>Aucun dossier trouvé.</p>
        </div>
      )}

      {!loading && !error && dossiers.map((dossier) => (
        <article key={dossier._id} className="dossier-card">
          <h3>
            <FiUser aria-hidden="true" style={{ marginRight: 8 }} />
            Dr. {dossier.medecin?.fullName || "—"}
          </h3>
          <div className="dossier-meta">
            <p><strong>Résumé médical :</strong> {dossier.resumeMedical || "—"}</p>
            <p><strong>Groupe sanguin :</strong> {dossier.groupeSanguin || "—"}</p>
            <p>
              <strong>Antécédents :</strong>
              {dossier.antecedents?.length
                ? dossier.antecedents.map((a) => a.libelle).join(", ")
                : " Aucun"}
            </p>
            <p>
              <strong>Allergies :</strong>
              {dossier.allergies?.length
                ? dossier.allergies.map((a) => a.libelle).join(", ")
                : " Aucune"}
            </p>
            {dossier.contactUrgence && (
              <p>
                <strong>Contact urgence :</strong>
                {dossier.contactUrgence.nom} – {dossier.contactUrgence.telephone}
              </p>
            )}
          </div>
        </article>
      ))}
    </PageTransition>
  );
};

export default MyDossiers;
