import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiShield, FiActivity, FiSettings } from "react-icons/fi";
import * as api from "../api/endpoint";
import { useAuth } from "../context/AuthContext";
import { getDisplayName } from "../utils/userDisplay";
import "../Styles/Dashboard.css";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const displayName = getDisplayName(user);

  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getData("/users");
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur lors du chargement des utilisateurs");
      setLoading(false);
    }
  };

  const handleEditClick = (u) => {
    setEditingUser(u._id);
    setFormData({
      fullName: u.fullName || "",
      email: u.email || "",
      role: u.role || "Patient",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await api.deleteData(`/user/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      alert("Utilisateur supprimé avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression : " + err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.putData(`/user/${editingUser}`, formData);
      setUsers(users.map((u) => (u._id === editingUser ? updated.updatedUser : u)));
      setEditingUser(null);
      alert("Utilisateur mis à jour !");
    } catch (err) {
      console.error(err);
      alert("Erreur update user : " + err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-inner">
          <p className="empty-state">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-inner">
          <p className="admin-error" role="alert">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <div className="dashboard-greeting">
            <h1>Dashboard Admin</h1>
            <p>Bienvenue, {displayName} — gestion de la plateforme GovAiMed.</p>
          </div>
          <div className="dashboard-avatar" aria-label={`Avatar de ${displayName}`}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="dashboard-stats">
          {[
            { icon: FiUsers, value: users.length, label: 'Utilisateurs', yellow: true },
            { icon: FiShield, value: roleCounts.Medecin || 0, label: 'Médecins', yellow: false },
            { icon: FiActivity, value: roleCounts.Patient || 0, label: 'Patients', yellow: false },
            { icon: FiSettings, value: Object.keys(roleCounts).length, label: 'Rôles actifs', yellow: true },
          ].map((stat) => (
            <motion.div key={stat.label} className="stat-card" whileHover={{ y: -3 }}>
              <div className={`stat-card-icon ${stat.yellow ? 'yellow' : ''}`}>
                <stat.icon size={22} aria-hidden="true" />
              </div>
              <div>
                <span className="stat-card-value">{stat.value}</span>
                <span className="stat-card-label">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="dashboard-panel admin-table-panel">
          <h2><FiUsers aria-hidden="true" /> Gestion des utilisateurs</h2>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) =>
                  editingUser === u._id ? (
                    <tr key={u._id}>
                      <td>
                        <input name="fullName" value={formData.fullName} onChange={handleChange} className="admin-input" />
                      </td>
                      <td>
                        <input name="email" value={formData.email} onChange={handleChange} className="admin-input" />
                      </td>
                      <td>
                        <select name="role" value={formData.role} onChange={handleChange} className="admin-input">
                          <option value="Patient">Patient</option>
                          <option value="Medecin">Médecin</option>
                          <option value="Assistant">Assistant</option>
                          <option value="Admin">Admin</option>
                          <option value="SuperAdmin">SuperAdmin</option>
                        </select>
                      </td>
                      <td className="admin-actions">
                        <button type="button" className="admin-btn save" onClick={handleUpdate}>Save</button>
                        <button type="button" className="admin-btn cancel" onClick={() => setEditingUser(null)}>Cancel</button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={u._id}>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td><span className="role-badge">{u.role}</span></td>
                      <td className="admin-actions">
                        <button type="button" className="admin-btn edit" onClick={() => handleEditClick(u)}>Edit</button>
                        <button type="button" className="admin-btn delete" onClick={() => handleDelete(u._id)}>Delete</button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
