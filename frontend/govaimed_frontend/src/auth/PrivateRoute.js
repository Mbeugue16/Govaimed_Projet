import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken, isTokenValid, decodeToken } from '../api/endpoint';

/*
  PrivateRoute protège les pages selon les rôles
 allowedRoles = tableau de rôles autorisés, ex: ['Patient'], ['Medecin'], ['Admin']
 */
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const token = getAuthToken();

  // Si pas de token ou token expiré -> redirection vers login
  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = decodeToken(token);

    // Si rôle non autorisé -> redirection vers route par défaut selon rôle
    if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
      const defaultRoute =
        payload.role === 'Patient' ? '/patient/dashboard' :
        payload.role === 'Medecin' ? '/medecin' :
        payload.role === 'Admin' ? '/admin' : '/';
      return <Navigate to={defaultRoute} replace />;
    }
  } catch (error) {
    console.error("Erreur PrivateRoute:", error);
    return <Navigate to="/login" replace />;
  }

  // Tout est OK -> afficher le composant enfant
  return children;
};

export default PrivateRoute;