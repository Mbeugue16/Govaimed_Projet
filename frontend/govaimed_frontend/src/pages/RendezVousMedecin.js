import React, { useEffect, useState } from "react";
import { getData, postData } from "../api/endpoint";
import "../Styles/RendezVousMedecin.css";

const RendezVousMedecin = () => {
  const [rdvEnAttente, setRdvEnAttente] = useState([]);
  const [rdvAcceptes, setRdvAcceptes] = useState([]);
  const [rdvPasses, setRdvPasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Charger tous les rendez-vous du médecin
  const fetchRendezVous = async () => {
    try {
      const data = await getData("/rendezvous/medecin");

      const aujourdHui = new Date();

      const enAttente = data.filter(r => r.statut === "en_attente");

      const acceptes = data.filter(
        r => r.statut === "accepte" && new Date(r.dateRendezVous) >= aujourdHui
      );

      const passes = data.filter(
        r => new Date(r.dateRendezVous) < aujourdHui
      );

      setRdvEnAttente(enAttente);
      setRdvAcceptes(acceptes);
      setRdvPasses(passes);

    } catch (error) {
      console.error("Erreur chargement RDV :", error);
    }
  };

  useEffect(() => {
    fetchRendezVous();
  }, []);

  // ✅ Accepter rendez-vous
  const handleAccept = async (id) => {
    try {
      setLoading(true);
      await postData(`/rendezvous/${id}/accepter`);
      fetchRendezVous();
    } catch (error) {
      console.error("Erreur acceptation :", error);
    } finally {
      setLoading(false);
    }
  };

  // ❌ Refuser rendez-vous
  const handleRefuse = async (id) => {
    try {
      setLoading(true);
      await postData(`/rendezvous/${id}/refuser`);
      fetchRendezVous();
    } catch (error) {
      console.error("Erreur refus :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="RdvMedecin">

      <h1>📥 Demandes en attente</h1>
      {rdvEnAttente.length === 0 ? (
        <p>Aucune demande</p>
      ) : (
        rdvEnAttente.map((rdv) => (
          <div key={rdv._id} className="rdv-card">
            <p><strong>Patient :</strong> {rdv.patientId?.fullName}</p>
            <p><strong>Date :</strong> {new Date(rdv.dateRendezVous).toLocaleString()}</p>
            <button onClick={() => handleAccept(rdv._id)}>✅ Accepter</button>
            <button onClick={() => handleRefuse(rdv._id)}>❌ Refuser</button>
          </div>
        ))
      )}

      <h1>📅 Rendez-vous à venir</h1>
      {rdvAcceptes.length === 0 ? (
        <p>Aucun rendez-vous accepté</p>
      ) : (
        rdvAcceptes.map((rdv) => (
          <div key={rdv._id} className="rdv-card">
            <p><strong>Patient :</strong> {rdv.patientId?.fullName}</p>
            <p><strong>Date :</strong> {new Date(rdv.dateRendezVous).toLocaleString()}</p>
            <span className="badge accepte">Accepté</span>
          </div>
        ))
      )}

      <h1>📁 Rendez-vous passés</h1>
      {rdvPasses.length === 0 ? (
        <p>Aucun rendez-vous passé</p>
      ) : (
        rdvPasses.map((rdv) => (
          <div key={rdv._id} className="rdv-card">
            <p><strong>Patient :</strong> {rdv.patientId?.fullName}</p>
            <p><strong>Date :</strong> {new Date(rdv.dateRendezVous).toLocaleString()}</p>
          </div>
        ))
      )}

    </div>
  );
};

export default RendezVousMedecin;