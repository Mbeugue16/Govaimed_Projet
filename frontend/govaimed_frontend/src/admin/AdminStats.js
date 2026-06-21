import React, { useEffect, useState } from 'react';
import { getData } from '../api/endpoint';

const AdminStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getData('/admin/stats').then(setStats).catch(console.error);
  }, []);

  if (!stats) return <p>Chargement des statistiques...</p>;

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <Stat label="Utilisateurs" value={stats.users} />
      <Stat label="Patients" value={stats.patients} />
      <Stat label="Médecins" value={stats.medecins} />
      <Stat label="Rendez-vous" value={stats.rendezVous} />
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div style={{
    background: '#0b3c5d',
    color: 'white',
    padding: 20,
    borderRadius: 8,
    minWidth: 150,
    textAlign: 'center'
  }}>
    <h2>{value}</h2>
    <p>{label}</p>
  </div>
);

export default AdminStats;