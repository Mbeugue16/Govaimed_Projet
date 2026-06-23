// Controllers/UserController.js
const mongoose = require("mongoose");
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");

// =====================
// Création d'un nouvel utilisateur (back-office / admin)
// =====================

const createNewUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      motDePasse,
      password,
      role,
      dateNaissance,
      date_of_birth,
      sexe,
      statut,

      // détails par rôle
      patientDetails,
      medecinDetails,
      pharmacienDetails,
      assistantDetails,
      adminDetails,
      moderatorDetails,
    } = req.body;

    // Vérifier doublon email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Un utilisateur avec cet email existe déjà" });
    }

    // Mot de passe requis
    const passwordToUse = motDePasse || password;
    if (!passwordToUse) {
      return res
        .status(400)
        .json({ message: "Le mot de passe est requis" });
    }

    // Ici tu peux choisir:
    // - soit laisser le pre('save') du modèle hasher (comme pour registerUser)
    // - soit hasher manuellement.
    // Je vais suivre la même logique que AuthController et laisser le pre-save :
    const userData = {
      fullName,
      email,
      password: passwordToUse, // sera hashé par pre('save') du modèle User
      role: role || "Patient",
      date_of_birth: dateNaissance || date_of_birth || undefined,
      sexe: sexe || undefined,
      statut: statut || "ACTIF",
    };

    // Détails Patient (facultatif si tu ne l'utilises pas ici)
    if (userData.role === "Patient" && patientDetails) {
      userData.patientDetails = {
        dateNaissance: patientDetails.dateNaissance || undefined,
        sexe: patientDetails.sexe || undefined,
        contact: (patientDetails.contact || "").trim(),
      };
    }

    // Détails Médecin
    if (userData.role === "Medecin") {
      if (
        !medecinDetails ||
        !medecinDetails.specialite ||
        !medecinDetails.telephone ||
        !medecinDetails.adresseCabinet
      ) {
        return res.status(400).json({
          message:
            "medecinDetails (specialite, telephone, adresseCabinet) est obligatoire pour les médecins.",
        });
      }

      userData.medecinDetails = {
        specialite: medecinDetails.specialite.trim(),
        telephone: medecinDetails.telephone.trim(),
        adresseCabinet: medecinDetails.adresseCabinet.trim(),
      };
    }

    // Détails Pharmacien
    if (userData.role === "Pharmacien" && pharmacienDetails) {
      userData.pharmacienDetails = {
        nomPharmacie: (pharmacienDetails.nomPharmacie || "").trim(),
        adressePharmacie: (pharmacienDetails.adressePharmacie || "").trim(),
      };
    }

    // Détails Assistant
    if (userData.role === "Assistant" && assistantDetails) {
      userData.assistantDetails = {
        poste: (assistantDetails.poste || "").trim(),
        serviceId: assistantDetails.serviceId || undefined, // devrait être un ObjectId valide
      };
    }

    // Détails Admin / SuperAdmin
    if (
      userData.role === "Admin" ||
      userData.role === "SuperAdmin"
    ) {
      userData.adminDetails = {
        adminCode: (adminDetails?.adminCode || "ADMIN-001").trim(),
        permissions: Array.isArray(adminDetails?.permissions)
          ? adminDetails.permissions
          : [],
      };
    }

    // Détails Modérateur
    if (userData.role === "Moderateur") {
      userData.moderatorDetails = {
        moderatedSections: Array.isArray(
          moderatorDetails?.moderatedSections
        )
          ? moderatorDetails.moderatedSections
          : [],
      };
    }

    const newUser = new User(userData);
    await newUser.save();

    const { password: _, ...userResponse } = newUser.toObject();
    return res
      .status(201)
      .json({ message: "Utilisateur créé avec succès", user: userResponse });
  } catch (error) {
    console.error("Erreur création utilisateur:", error);

    if (error.name === "ValidationError") {
      return res.status(422).json({
        message: "Erreur de validation",
        validationErrors: error.errors,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Conflit de données (doublon)",
        errorName: "MongoServerError",
        code: 11000,
      });
    }

    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
}

// =====================
// Récupérer tous les utilisateurs (ADMIN)
// =====================

const getAllUsers = async (req, res) => {
  try {
    if (req.user?.role !== "Admin" && req.user?.role !== "SuperAdmin") {
      return res
        .status(403)
        .json({ message: "Accès réservé aux administrateurs" });
    }

    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Erreur getAllUsers:", error);
    return res.status(500).json({
      message: "Erreur récupération utilisateurs",
      error: error.message,
    });
  }
};

// =====================
// Récupérer un utilisateur par ID
// =====================

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Erreur getUserById:", error);
    return res.status(500).json({
      message: "Erreur récupération utilisateur",
      error: error.message,
    });
  }
};

// =====================
// Mettre à jour un utilisateur
// =====================

const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    // si on met à jour le mot de passe, le laisser au pre-save (optionnel)
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur updateUser:", error);
    return res.status(500).json({
      message: "Erreur mise à jour utilisateur",
      error: error.message,
    });
  }
};

// =====================
// Supprimer un utilisateur
// =====================

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res
      .status(200)
      .json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteUser:", error);
    return res.status(500).json({
      message: "Erreur suppression utilisateur",
      error: error.message,
    });
  }
};

// =====================
// Récupérer tous les patients
// =====================

const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "Patient" }).select("-password");
    return res.status(200).json(patients);
  } catch (err) {
    console.error("Erreur getAllPatients:", err.message);
    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

// =====================
// Récupérer le profil connecté
// =====================

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Erreur getMe:", err.message);
    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

// =====================
// Récupérer les dossiers (exemple)
// =====================

const getDossiers = async (req, res) => {
  try {
    if (!["Medecin", "Admin", "SuperAdmin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Accès réservé aux médecins et administrateurs",
      });
    }

    const mockDossiers = [
      {
        _id: "1",
        patientName: "Jean Dupont",
        motif: "Consultation annuelle",
        diagnostic: "Hypertension légère",
        date: new Date().toISOString(),
      },
      {
        _id: "2",
        patientName: "Marie Durand",
        motif: "Douleurs lombaires",
        diagnostic: "Lombalgie chronique",
        date: new Date().toISOString(),
      },
    ];

    return res.status(200).json(mockDossiers);
  } catch (error) {
    console.error("Erreur getDossiers:", error);
    return res.status(500).json({
      message: "Erreur récupération dossiers",
      error: error.message,
    });
  }
};

// =====================
// Liste des médecins pour les patients
// =====================

const getMedecinsForPatients = async (req, res) => {
  try {
    const medecins = await User.find({ role: "Medecin", statut: "ACTIF" })
      .select("_id fullName email")
      .sort({ fullName: 1 });

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
    res
      .status(500)
      .json({ message: "Erreur récupération médecins", error: error.message });
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
  getMedecinsForPatients,
};