// Controllers/UserController.js
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");

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
      patientDetails,
      medecinDetails,
      pharmacienDetails,
      assistantDetails,
      adminDetails,
      moderatorDetails,
    } = req.body;

    const passwordToUse = motDePasse || password;
    if (!passwordToUse) {
      return res.status(400).json({ message: "Le mot de passe est requis" });
    }

    if (!fullName || !email) {
      return res.status(400).json({ message: "Nom et email requis" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "Un utilisateur avec cet email existe déjà",
      });
    }

    const userData = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: passwordToUse,
      role: role || "Patient",
      date_of_birth: dateNaissance || date_of_birth || undefined,
      sexe: sexe || undefined,
      statut: statut || "ACTIF",
    };

    if (userData.role === "Patient" && patientDetails) {
      userData.patientDetails = {
        dateNaissance: patientDetails.dateNaissance || undefined,
        sexe: patientDetails.sexe || undefined,
        contact: (patientDetails.contact || "").trim(),
      };
    }

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

    if (userData.role === "Pharmacien" && pharmacienDetails) {
      userData.pharmacienDetails = {
        nomPharmacie: (pharmacienDetails.nomPharmacie || "").trim(),
        adressePharmacie: (pharmacienDetails.adressePharmacie || "").trim(),
      };
    }

    if (userData.role === "Assistant" && assistantDetails) {
      userData.assistantDetails = {
        poste: (assistantDetails.poste || "").trim(),
        serviceId: assistantDetails.serviceId || undefined,
      };
    }

    if (userData.role === "Admin" || userData.role === "SuperAdmin") {
      userData.adminDetails = {
        adminCode: (adminDetails?.adminCode || `ADMIN-${Date.now()}`).trim(),
        permissions: Array.isArray(adminDetails?.permissions)
          ? adminDetails.permissions
          : [],
      };
    }

    if (userData.role === "Moderateur") {
      userData.moderatorDetails = {
        moderatedSections: Array.isArray(moderatorDetails?.moderatedSections)
          ? moderatorDetails.moderatedSections
          : [],
      };
    }

    const newUser = new User(userData);
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: userResponse,
    });
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

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (!["Admin", "SuperAdmin"].includes(req.user?.role)) {
      return res.status(403).json({ message: "Accès réservé aux administrateurs" });
    }

    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur récupération utilisateurs",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur récupération utilisateur",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.email) updates.email = updates.email.trim().toLowerCase();
    if (updates.fullName) updates.fullName = updates.fullName.trim();

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
    return res.status(500).json({
      message: "Erreur mise à jour utilisateur",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    return res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur suppression utilisateur",
      error: error.message,
    });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "Patient" }).select("-password");
    return res.status(200).json(patients);
  } catch (err) {
    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

const getDossiers = async (req, res) => {
  try {
    if (!["Medecin", "Admin", "SuperAdmin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Accès réservé aux médecins et administrateurs",
      });
    }

    return res.status(200).json([
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
    ]);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur récupération dossiers",
      error: error.message,
    });
  }
};

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

    return res.status(200).json(medecinsFormates);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur récupération médecins",
      error: error.message,
    });
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