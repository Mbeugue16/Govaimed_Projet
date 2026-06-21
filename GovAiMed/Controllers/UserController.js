const mongoose = require('mongoose');
const User = require('../Models/UserModel');
const bcrypt = require('bcrypt');


  // Création d'un nouvel utilisateur

const createNewUser = async (req, res) => {
  try {
    const { fullName, email, motDePasse, password, role, dateNaissance, date_of_birth, sexe, statut } = req.body;

    // Vérifier doublon email
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" });

    // Mot de passe requis
    const passwordToHash = motDePasse || password;
    if (!passwordToHash) return res.status(400).json({ message: "Le mot de passe est requis" });

    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    const userData = {
      fullName,
      email,
      password: hashedPassword,
      role: role || 'Patient',
      date_of_birth: dateNaissance || date_of_birth,
      sexe: sexe || undefined,
      statut: statut || 'ACTIF'
    };

    const newUser = await User.create(userData);

    const { password: _, ...userResponse } = newUser.toObject();
    return res.status(201).json({ message: "Utilisateur créé avec succès", user: userResponse });

  } catch (error) {
    console.error("Erreur création utilisateur:", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


  // Récupérer tous les utilisateurs (ADMIN)

const getAllUsers = async (req, res) => {
  try {
    if (req.user?.role !== 'Admin') return res.status(403).json({ message: "Accès réservé aux administrateurs" });

    const users = await User.find().select('-password');
    return res.status(200).json(users);

  } catch (error) {
    console.error("Erreur getAllUsers:", error);
    return res.status(500).json({ message: "Erreur récupération utilisateurs", error: error.message });
  }
};


   // Récupérer un utilisateur par ID

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Erreur getUserById:", error);
    return res.status(500).json({ message: "Erreur récupération utilisateur", error: error.message });
  }
};


  // Mettre à jour un utilisateur

const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

    return res.status(200).json({ message: "Utilisateur mis à jour avec succès", user: updatedUser });

  } catch (error) {
    console.error("Erreur updateUser:", error);
    return res.status(500).json({ message: "Erreur mise à jour utilisateur", error: error.message });
  }
};


  // Supprimer un utilisateur

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

    return res.status(200).json({ message: "Utilisateur supprimé avec succès" });

  } catch (error) {
    console.error("Erreur deleteUser:", error);
    return res.status(500).json({ message: "Erreur suppression utilisateur", error: error.message });
  }
};


  // Récupérer tous les patients (Médecin/Admin)

const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'Patient' }).select('-password');
    return res.status(200).json(patients);
  } catch (err) {
    console.error("Erreur getAllPatients:", err.message);
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};  


  // Récupérer le profil connecté

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    return res.status(200).json(user);
  } catch (err) {
    console.error("Erreur getMe:", err.message);
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


  // Récupérer les dossiers 
const getDossiers = async (req, res) => {
  try {
    if (!['Medecin', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ message: "Accès réservé aux médecins et administrateurs" });
    }

    // Exemple temporaire
    const mockDossiers = [
      { _id: "1", patientName: "Jean Dupont", motif: "Consultation annuelle", diagnostic: "Hypertension légère", date: new Date().toISOString() },
      { _id: "2", patientName: "Marie Durand", motif: "Douleurs lombaires", diagnostic: "Lombalgie chronique", date: new Date().toISOString() }
    ];

    return res.status(200).json(mockDossiers);

  } catch (error) {
    console.error("Erreur getDossiers:", error);
    return res.status(500).json({ message: "Erreur récupération dossiers", error: error.message });
  }
};

// 🔓 Liste des médecins pour les patients
const getMedecinsForPatients = async (req, res) => {
  try {
    const medecins = await User.find({ role: "Medecin", statut: "ACTIF" })
      .select("_id fullName email")
      .sort({ fullName: 1 });

    // Formater pour inclure initiales
    const medecinsFormates = medecins.map((med) => ({
      _id: med._id,
      fullName: med.fullName,
      initiale: med.fullName
        .split(" ")
        .map((n) => n[0].toUpperCase())
        .join("."),
      email: med.email,
    }));

    res.status(200).json(medecinsFormates);
  } catch (error) {
    console.error("Erreur getMedecinsForPatients:", error);
    res.status(500).json({ message: "Erreur récupération médecins" });
  }
};

module.exports = {
  createNewUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllPatients,
  getMe,
  getDossiers,
  getMedecinsForPatients 
};