const { authorize } = require('./Authorization');

/*
  Middleware générique pour autoriser un ou plusieurs rôles
  @param {Array} allowedRoles - Tableau des rôles autorisés
 */
const authorizeRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    authorize(req, res, () => {
      if (!req.user) return res.status(401).json({ message: "Non authentifié" });

      if (allowedRoles.length === 0 || allowedRoles.includes(req.user.role)) {
        return next();
      }

      return res.status(403).json({
        message: `Accès refusé. Rôles autorisés : ${allowedRoles.join(', ')}`
      });
    });
  };
};


// Middleware pour autoriser uniquement les médecins 
const authorizeMedecin = (req, res, next) => {
  authorizeRoles(['Medecin'])(req, res, next);
};

// Middleware pour autoriser médecins et admins (y compris super admin) 
const authorizeMedecinOrAdmin = (req, res, next) => {
  authorizeRoles(['Medecin', 'Admin', 'SuperAdmin'])(req, res, next);
};

// Middleware pour autoriser assistants et admins (y compris super admin) 
const authorizeAssistantOrAdmin = (req, res, next) => {
  authorizeRoles(['Assistant', 'Admin', 'SuperAdmin'])(req, res, next);
};

// Middleware pour autoriser uniquement les patients 
const authorizePatient = (req, res, next) => {
  authorizeRoles(['Patient'])(req, res, next);
};

// Middleware pour autoriser uniquement les super administrateurs 
const authorizeSuperAdmin = (req, res, next) => {
  authorizeRoles(['SuperAdmin'])(req, res, next);
};

// Middleware pour autoriser admins et super admins 
const authorizeAdminOrSuperAdmin = (req, res, next) => {
  authorizeRoles(['Admin', 'SuperAdmin'])(req, res, next);
};


// Middleware pour autoriser le personnel médical (médecins, aides-soignants, stagiaires) 
const authorizePersonnelMedical = (req, res, next) => {
  const personnelRoles = ['Medecin', 'AideSoignant', 'Stagiaire', 'Admin', 'SuperAdmin'];
  authorizeRoles(personnelRoles)(req, res, next);
};


// Middleware pour autoriser le personnel administratif (assistants, médiateurs, admins) 
const authorizePersonnelAdmin = (req, res, next) => {
  const adminRoles = ['Assistant', 'MediateurNumerique', 'Admin', 'SuperAdmin'];
  authorizeRoles(adminRoles)(req, res, next);
};

module.exports = {
  authorizeRoles,
  authorizeMedecin,
  authorizeMedecinOrAdmin,
  authorizeAssistantOrAdmin,
  authorizePatient,
  authorizeSuperAdmin,
  authorizeAdminOrSuperAdmin,
  authorizePersonnelMedical,
  authorizePersonnelAdmin
};