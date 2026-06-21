import React, { useEffect, useState } from "react";
import * as api from "../api/endpoint";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state pour edit user
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

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      role: user.role || "Patient",
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

  if (loading) return <p>Chargement des utilisateurs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Admin</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            editingUser === user._id ? (
              <tr key={user._id}>
                <td>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="Patient">Patient</option>
                    <option value="Medecin">Médecin</option>
                    <option value="Assistant">Assistant</option>
                    <option value="Admin">Admin</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </td>
                <td>
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditingUser(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEditClick(user)}>Edit</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;