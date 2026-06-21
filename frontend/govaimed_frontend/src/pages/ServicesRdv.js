import React, { useEffect, useState } from "react";
import { getData } from "../api/endpoint";
import "../Styles/ServicesRdv.css";

const ServicesRdv = ({ onSelect }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getData("/services-rdv");
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <p>⏳ Chargement des services...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="services-rdv">
      <h3>🏥 Choisir un service</h3>

      {services.length === 0 && (
        <p>Aucun service disponible.</p>
      )}

      <ul>
        {services.map((service) => (
          <li
            key={service._id}
            className="service-item"
            onClick={() => onSelect(service)}
          >
            <strong>{service.nom}</strong>
            {service.description && (
              <p className="description">{service.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesRdv;