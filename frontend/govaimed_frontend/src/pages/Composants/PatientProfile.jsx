import React, { useEffect, useState } from "react";
import { FiUser, FiMail, FiShield, FiEdit2 } from "react-icons/fi";
import { getData } from "../../api/endpoint";
import { useAuth } from "../../context/AuthContext";
import { getDisplayName, getFirstName } from "../../utils/userDisplay";
import PageTransition from "../../components/ui/PageTransition";
import { SkeletonList } from "../../components/ui/Skeleton";
import "../../Styles/PatientApp.css";

const PatientProfile = () => {
  const { user } = useAuth();
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

  const displayName = getDisplayName(user);
  const nameParts = displayName.split(/\s+/);
  const prenom = nameParts[0] || "—";
  const nom = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "—";

  const contactFromDossier = dossiers.find((d) => d.contactUrgence)?.contactUrgence;

  return (
    <PageTransition className="patient-page">
      <div className="patient-page-header">
        <h1>Mon profil</h1>
        <p>Gérez vos informations personnelles</p>
      </div>

      <div className="profile-card-main">
        <div className="profile-photo-placeholder" aria-label="Photo de profil">
          {getFirstName(user).charAt(0).toUpperCase()}
        </div>
        <div className="profile-main-info">
          <h2>{displayName}</h2>
          <span className="profile-role-badge">{user?.role}</span>
        </div>
      </div>

      {loading ? (
        <SkeletonList count={4} />
      ) : (
        <div className="profile-fields">
          {[
            { icon: FiUser, label: "Prénom", value: prenom },
            { icon: FiUser, label: "Nom", value: nom },
            { icon: FiMail, label: "Email", value: user?.email || "—" },
            { icon: FiShield, label: "Statut", value: user?.statut || "ACTIF" },
            { icon: FiUser, label: "Contact urgence", value: contactFromDossier ? `${contactFromDossier.nom} – ${contactFromDossier.telephone}` : "—" },
          ].map((field) => (
            <div key={field.label} className="profile-field">
              <field.icon aria-hidden="true" />
              <div>
                <span className="field-label">{field.label}</span>
                <span className="field-value">{field.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button type="button" className="profile-edit-btn" disabled title="Modification à venir">
        <FiEdit2 aria-hidden="true" /> Modifier mon profil
      </button>

      <p className="profile-note">
        Certaines informations proviennent de votre compte GovAiMed.
        La modification complète du profil sera disponible prochainement.
      </p>
    </PageTransition>
  );
};

export default PatientProfile;
