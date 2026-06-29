import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postData, putData, getData } from "../api/endpoint";
import "../Styles/ServiceForm.css";

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    description: "",
    type: "AUTRE",
    dureeMoyenneConsultation: 15,
    statut: "ACTIF",
  });

  useEffect(() => {
    if (!id) return;

    const loadService = async () => {
      try {
        const data = await getData(`/services/${id}`);
        setForm(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) await putData(`/services/${id}`, form);
      else await postData("/services", form);
      navigate("/services");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h1>{id ? "Modifier Service" : "Créer un Service"}</h1>
      <form onSubmit={handleSubmit}>
        <label>Nom</label>
        <input
          type="text"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="MEDECINE_GENERALE">Médecine générale</option>
          <option value="PEDIATRIE">Pédiatrie</option>
          <option value="GYNECOLOGIE">Gynécologie</option>
          <option value="DENTISTERIE">Dentisterie</option>
          <option value="OPHTALMOLOGIE">Ophtalmologie</option>
          <option value="CARDIOLOGIE">Cardiologie</option>
          <option value="AUTRE">Autre</option>
        </select>

        <label>Durée moyenne (min)</label>
        <input
          type="number"
          name="dureeMoyenneConsultation"
          value={form.dureeMoyenneConsultation}
          onChange={handleChange}
          min={5}
        />

        <label>Statut</label>
        <select name="statut" value={form.statut} onChange={handleChange}>
          <option value="ACTIF">ACTIF</option>
          <option value="INACTIF">INACTIF</option>
        </select>

        <button type="submit">{id ? "Mettre à jour" : "Créer"}</button>
      </form>
    </div>
  );
};

export default ServiceForm;