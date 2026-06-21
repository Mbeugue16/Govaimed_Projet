import React, { useEffect, useState } from "react";
import { getData, deleteData } from "../api/endpoint";
import { useNavigate } from "react-router-dom";
import "../Styles/ServiceList.css";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getData("/services");
      setServices(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce service ?")) return;

    try {
      await deleteData(`/services/${id}`);
      fetchServices();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="services-container">
      <h1>Liste des Services Médicaux</h1>
      <div className="services-actions">
        <button onClick={() => navigate("/services/create")}>
          Ajouter un service
        </button>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service._id} className="service-card">
            <h2>{service.nom}</h2>
            <p>{service.description || "Pas de description"}</p>
            <p>
              <strong>Type:</strong> {service.type} |{" "}
              <strong>Durée:</strong> {service.dureeMoyenneConsultation} min
            </p>
            <div className="card-actions">
              <button
                className="edit-btn"
                onClick={() => navigate(`/services/edit/${service._id}`)}
              >
                Modifier
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(service._id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;