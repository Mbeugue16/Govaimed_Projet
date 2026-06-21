import React, { useEffect, useState } from "react";
import { getData } from "../api/endpoint";
import "../Styles/ServicesRdv.css";

const ServicesRdv = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getData("/services-rdv");
      setServices(data);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="rdv-container">
      <h1>Choisir un service médical</h1>
      <div className="rdv-grid">
        {services.map((service) => (
          <div key={service._id} className="rdv-card">
            <h2>{service.nom}</h2>
            <p>{service.description || "Pas de description"}</p>
            <button>Prendre rendez-vous</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesRdv;