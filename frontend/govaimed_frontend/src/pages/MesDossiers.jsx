import React, { useState, useEffect } from "react";
import { axiosInstance, getAuthToken, decodeToken } from "../api/endpoint";
import "../Styles/MesDossiers.css";

const MesDossiers = () => {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        console.log("Token décodé :", decodeToken(getAuthToken()));

        const response = await axiosInstance.get("/medecin/dossiers");
        console.log("Dossiers récupérés :", response.data);

        if (response.data.dossiers) {
          setDossiers(response.data.dossiers);
        } else {
          setDossiers(response.data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Erreur récupération dossiers :", err);
        setError(err.response?.data?.message || "Erreur serveur");
        setLoading(false);
      }
    };

    fetchDossiers();
  }, []);

  if (loading) return <p className="loading-msg">Chargement des dossiers...</p>;
  if (error) return <p className="error-msg">Erreur : {error}</p>;
  if (dossiers.length === 0) return <p className="empty-msg">Aucun dossier trouvé.</p>;

  return (
    <div className="MesDossiers">
      <h2>Mes Dossiers Patients</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom Patient</th>
              <th>Groupe Sanguin</th>
              <th>Résumé Médical</th>
              <th>Antécédents</th>
              <th>Allergies</th>
              <th>Contact d'Urgence</th>
            </tr>
          </thead>
          <tbody>
            {dossiers.map((dossier) => (
              <tr key={dossier._id}>
                <td>{dossier.patient?.fullName || "N/A"}</td>
                <td>{dossier.groupeSanguin || "N/A"}</td>
                <td>{dossier.resumeMedical || "N/A"}</td>
                <td>{dossier.antecedents?.map(a => a.libelle).join(", ") || "Aucun"}</td>
                <td>{dossier.allergies?.map(a => a.libelle).join(", ") || "Aucune"}</td>
                <td>
                  {dossier.contactUrgence 
                    ? `${dossier.contactUrgence.nom} (${dossier.contactUrgence.lien}) - ${dossier.contactUrgence.telephone}`
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MesDossiers;