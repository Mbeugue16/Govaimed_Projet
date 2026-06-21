import React, { useEffect, useState } from "react";
import { getData } from "../../api/endpoint";

const MyDossiers = () => {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        const data = await getData("/patient/dossiers");
        setDossiers(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchDossiers();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!dossiers.length) return <p>Aucun dossier trouvé.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mes dossiers médicaux</h2>

      {dossiers.map((dossier) => (
        <div
          key={dossier._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          <p><strong>Médecin :</strong> {dossier.medecin?.fullName}</p>
          <p><strong>Email :</strong> {dossier.medecin?.email}</p>
          <p><strong>Résumé médical :</strong> {dossier.resumeMedical}</p>
          <p><strong>Groupe sanguin :</strong> {dossier.groupeSanguin}</p>

          <p><strong>Antécédents :</strong>
            {dossier.antecedents?.length
              ? dossier.antecedents.map(a => a.libelle).join(", ")
              : " Aucun"}
          </p>

          <p><strong>Allergies :</strong>
            {dossier.allergies?.length
              ? dossier.allergies.map(a => a.libelle).join(", ")
              : " Aucune"}
          </p>

          <p><strong>Contact urgence :</strong>
            {dossier.contactUrgence?.nom} – {dossier.contactUrgence?.telephone}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyDossiers;