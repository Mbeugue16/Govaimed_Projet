const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');


  // Middleware d'authentification

  // Vérifie le token et injecte l'utilisateur

const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    req.user = user; // Stocke l'utilisateur pour les routes suivantes
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(403).json({ message: "Accès interdit : token invalide" });
  }
};


   //Middleware d'autorisation par rôle
   
   //Exemple d'utilisation : authorizeRole(['Admin', 'SuperAdmin'])

const authorizeRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Veuillez vous authentifier." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Accès refusé. Rôles autorisés : ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};


   //Middleware combiné pratique : Auth + Admin

const authorizeAdmin = [authorize, authorizeRole(['Admin'])];

module.exports = {
  authorize,
  authorizeRole,
  authorizeAdmin
};