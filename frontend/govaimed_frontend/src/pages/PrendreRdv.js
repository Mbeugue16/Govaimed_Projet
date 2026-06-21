import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/PrendreRdv.css";

const API_URL = "http://localhost:5000/api";

const PrendreRdv = () => {
  const [medecins, setMedecins] = useState([]);
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    medecinId: "",
    serviceId: "",
    dateRendezVous: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medRes, servRes] = await Promise.all([
          axiosInstance.get("/users/medecins-rdv"),
          axiosInstance.get("/services-rdv")
        ]);

        setMedecins(medRes.data);
        setServices(servRes.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.medecinId || !form.dateRendezVous) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/rendezvous", {
        medecinId: form.medecinId,
        serviceId: form.serviceId || null,
        dateRendezVous: form.dateRendezVous
      });

      setMessage("Rendez-vous pris avec succès ✅");

      setForm({
        medecinId: "",
        serviceId: "",
        dateRendezVous: ""
      });

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Erreur lors de la prise de rendez-vous"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rdv-container">

      <div className="rdv-card">
        <h2>📅 Prendre un rendez-vous</h2>

        {error && <p className="message error">{error}</p>}
        {message && <p className="message success">{message}</p>}

        <form className="rdv-form" onSubmit={handleSubmit}>

          {/* Médecin */}
          <div className="form-group">
            <label>Médecin *</label>
            <select
              name="medecinId"
              value={form.medecinId}
              onChange={handleChange}
              required
            >
              <option value="">Choisir un médecin</option>

              {medecins.map((med) => (
                <option key={med._id} value={med._id}>
                  {med.fullName} ({med.initiale})
                </option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div className="form-group">
            <label>Service</label>

            <select
              name="serviceId"
              value={form.serviceId}
              onChange={handleChange}
            >
              <option value="">Aucun service</option>

              {services.map((serv) => (
                <option key={serv._id} value={serv._id}>
                  {serv.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date et heure *</label>

            <input
              type="datetime-local"
              name="dateRendezVous"
              value={form.dateRendezVous}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : "Confirmer le rendez-vous"}
          </button>

        </form>
      </div>

    </div>
  );
};

export default PrendreRdv;