// controllers/authController.js
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Générer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// =====================
// Enregistrement d'un utilisateur
// =====================

const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      patientDetails,
      medecinDetails,
      pharmacienDetails,
      assistantDetails,
      adminDetails,
      moderatorDetails,
    } = req.body;

    // 1. Champs de base
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nom, email et mot de passe sont obligatoires." });
    }

    // 2. Doublon email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    // 3. Préparer les données utilisateur
    // Si ton modèle User a un pre('save') pour hasher le mot de passe,
    // tu peux laisser le mot de passe en clair ici.
    const userData = {
      fullName,
      email,
      password, // sera hashé par pre-save si défini dans le modèle
      role: role || "Patient",
      statut: "ACTIF",
    };

    // 4. Détails par rôle

    // Patient (si patientDetails est activé dans ton modèle)
    if (userData.role === "Patient" && patientDetails) {
      userData.patientDetails = {
        dateNaissance: patientDetails.dateNaissance || undefined,
        sexe: patientDetails.sexe || undefined,
        contact: (patientDetails.contact || "").trim(),
      };
    }

    // Médecin : medecinDetails obligatoire
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

    // Pharmacien
    if (userData.role === "Pharmacien" && pharmacienDetails) {
      userData.pharmacienDetails = {
        nomPharmacie: (pharmacienDetails.nomPharmacie || "").trim(),
        adressePharmacie: (pharmacienDetails.adressePharmacie || "").trim(),
      };
    }

    // Assistant
    if (userData.role === "Assistant" && assistantDetails) {
      userData.assistantDetails = {
        poste: (assistantDetails.poste || "").trim(),
        serviceId: assistantDetails.serviceId || undefined, // doit être un ObjectId valide
      };
    }

    // Admin / SuperAdmin
    if (userData.role === "Admin" || userData.role === "SuperAdmin") {
      userData.adminDetails = {
        adminCode: (adminDetails?.adminCode || "ADMIN-001").trim(),
        permissions: Array.isArray(adminDetails?.permissions)
          ? adminDetails.permissions
          : [],
      };
    }

    // Modérateur
    if (userData.role === "Moderateur") {
      userData.moderatorDetails = {
        moderatedSections: Array.isArray(
          moderatorDetails?.moderatedSections
        )
          ? moderatorDetails.moderatedSections
          : [],
      };
    }

    // 5. Création et sauvegarde
    const newUser = new User(userData);
    await newUser.save();

    const token = generateToken(newUser);

    const userResponse = {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      statut: newUser.statut,
    };

    return res.status(201).json({
      message: "Utilisateur enregistré avec succès.",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    // Validation Mongoose
    if (error.name === "ValidationError") {
      return res.status(422).json({
        message: "Erreur de validation.",
        validationErrors: error.errors,
      });
    }

    // Doublon Mongo (unique)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Données en doublon",
        errorName: "MongoServerError",
        code: 11000,
      });
    }

    return res.status(500).json({
      message: "Erreur interne du serveur.",
      error: error.message,
    });
  }
};

// =====================
// Connexion d'un utilisateur
// =====================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email et mot de passe sont requis." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect." });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Connexion réussie.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        statut: user.statut,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    return res.status(500).json({
      message: "Erreur interne du serveur.",
      error: error.message,
    });
  }
};

// =====================
// Mot de passe oublié
// =====================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
    user.resetPasswordOTP = await bcrypt.hash(otp, 10);

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    console.log("Lien:", resetUrl);
    console.log("OTP:", otp);

    return res.json({
      message: "Email de réinitialisation envoyé.",
    });
  } catch (error) {
    console.error("FORGOT ERROR:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// =====================
// Réinitialisation du mot de passe
// =====================

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { email, password, otp } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Lien invalide ou expiré." });

    const isOtpValid = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isOtpValid)
      return res.status(400).json({ message: "Code de confirmation invalide." });

    // soit tu laisses le pre-save hasher, soit tu hashes ici. Choisissons le pre-save :
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.resetPasswordOTP = undefined;

    await user.save();

    return res.json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    console.error("RESET ERROR:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};