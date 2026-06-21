import React, { useState, useEffect } from "react";
import { axiosInstance } from "../api/endpoint";
import "../Styles/CreateDossier.css";

const CreateDossier = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    resumeMedical: "",
    groupeSanguin: "",
    antecedents: "",
    allergies: "",
    contactUrgence: { nom: "", telephone: "", lien: "" },
  });

  // Charger la liste des patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axiosInstance.get("/patients");
        setPatients(response.data);
      } catch (err) {
        console.error("Erreur récupération patients:", err);
        alert(
          "Impossible de charger les patients. Vérifiez que vous êtes connecté en tant que médecin ou admin."
        );
      }
    };
    fetchPatients();
  }, []);

  // Gestion des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contact")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        contactUrgence: { ...formData.contactUrgence, [key]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientId) {
      alert("⚠️ Veuillez sélectionner un patient !");
      return;
    }

    try {
      const payload = {
        ...formData,
        antecedents: formData.antecedents
          .split(",")
          .map((a) => ({ libelle: a.trim() }))
          .filter(Boolean),
        allergies: formData.allergies
          .split(",")
          .map((a) => ({ libelle: a.trim() }))
          .filter(Boolean),
      };

      await axiosInstance.post("/dossiers", payload);

      alert("✅ Dossier créé avec succès !");
      setFormData({
        patientId: "",
        resumeMedical: "",
        groupeSanguin: "",
        antecedents: "",
        allergies: "",
        contactUrgence: { nom: "", telephone: "", lien: "" },
      });
    } catch (err) {
      console.error("Erreur création dossier:", err);
      alert(err.response?.data?.message || "❌ Erreur serveur");
    }
  };

  return (
    <div className="CreateDossier">
      <h2>Créer un Dossier Patient</h2>
      <form onSubmit={handleSubmit}>
        {/* Patient */}
        <label>Patient</label>
        <select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
        >
          <option value="">-- Sélectionner un patient --</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.fullName} ({p.email})
            </option>
          ))}
        </select>

        {/* Résumé médical */}
        <label>Résumé Médical</label>
        <textarea
          name="resumeMedical"
          placeholder="Résumé Médical"
          value={formData.resumeMedical}
          onChange={handleChange}
          rows={4}
        />

        {/* Groupe sanguin */}
        <label>Groupe Sanguin</label>
        <input
          name="groupeSanguin"
          placeholder="Ex: A+"
          value={formData.groupeSanguin}
          onChange={handleChange}
        />

        {/* Antécédents */}
        <label>Antécédents</label>
        <input
          name="antecedents"
          placeholder="Séparés par ,"
          value={formData.antecedents}
          onChange={handleChange}
        />

        {/* Allergies */}
        <label>Allergies</label>
        <input
          name="allergies"
          placeholder="Séparées par ,"
          value={formData.allergies}
          onChange={handleChange}
        />

        {/* Contact d’urgence */}
        <h4>Contact d’urgence</h4>
        <label>Nom</label>
        <input
          name="contact.nom"
          placeholder="Nom"
          value={formData.contactUrgence.nom}
          onChange={handleChange}
        />
        <label>Téléphone</label>
        <input
          name="contact.telephone"
          placeholder="Téléphone"
          value={formData.contactUrgence.telephone}
          onChange={handleChange}
        />
        <label>Lien avec le patient</label>
        <input
          name="contact.lien"
          placeholder="Lien"
          value={formData.contactUrgence.lien}
          onChange={handleChange}
        />

        <button type="submit">Créer Dossier</button>
      </form>
    </div>
  );
};

export default CreateDossier;