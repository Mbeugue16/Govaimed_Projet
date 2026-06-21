import React, { useEffect, useState } from 'react';
import { getData, putData } from '../../api/endpoint';

const UserList = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const data = await getData('/admin/users');
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (id, active) => {
    await putData(`/admin/users/${id}/status`, { active: !active });
    loadUsers();
  };

  return (
    <div>
      <h2>👥 Gestion des utilisateurs</h2>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.active ? '✅ Actif' : '🚫 Désactivé'}</td>
              <td>
                <button onClick={() => toggleStatus(user._id, user.active)}>
                  {user.active ? 'Désactiver' : 'Activer'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;