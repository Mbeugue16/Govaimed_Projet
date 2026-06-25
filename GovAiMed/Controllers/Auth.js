const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/* =========================
   TOKEN GENERATION
========================= */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

/* =========================
   REGISTER
========================= */
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

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "fullName, email et password sont obligatoires",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "Email déjà utilisé",
      });
    }

    const userData = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      role: role || "Patient",
      statut: "ACTIF",
    };

    /* =========================
       ROLE SPECIFIQUE
    ========================= */

    if (userData.role === "Patient" && patientDetails) {
      userData.patientDetails = {
        dateNaissance: patientDetails.dateNaissance || undefined,
        sexe: patientDetails.sexe || undefined,
        contact: patientDetails.contact?.trim(),
      };
      userData.date_of_birth = patientDetails.dateNaissance || undefined;
      userData.sexe = patientDetails.sexe || undefined;
    }

    if (userData.role === "Medecin") {
      if (
        !medecinDetails?.specialite ||
        !medecinDetails?.telephone ||
        !medecinDetails?.adresseCabinet
      ) {
        return res.status(400).json({
          message: "medecinDetails incomplet",
        });
      }

      userData.medecinDetails = {
        specialite: medecinDetails.specialite.trim(),
        telephone: medecinDetails.telephone.trim(),
        adresseCabinet: medecinDetails.adresseCabinet.trim(),
      };
    }

    if (userData.role === "Pharmacien") {
      userData.pharmacienDetails = {
        nomPharmacie: (pharmacienDetails?.nomPharmacie || "").trim(),
        adressePharmacie: (pharmacienDetails?.adressePharmacie || "").trim(),
      };
    }

    if (userData.role === "Assistant") {
      userData.assistantDetails = {
        poste: (assistantDetails?.poste || "").trim(),
        serviceId: assistantDetails?.serviceId || undefined,
      };
    }

    if (["Admin", "SuperAdmin"].includes(userData.role)) {
      userData.adminDetails = {
        adminCode: (adminDetails?.adminCode || `ADMIN-${Date.now()}`).trim(),
        permissions: adminDetails?.permissions || [],
      };
    }

    if (userData.role === "Moderateur") {
      userData.moderatorDetails = {
        moderatedSections: moderatorDetails?.moderatedSections || [],
      };
    }

    const newUser = new User(userData);
    await newUser.save();

    const token = generateToken(newUser);

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        statut: newUser.statut,
      },
      token,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    if (error.name === "ValidationError") {
      return res.status(422).json({
        message: "Erreur de validation",
        validationErrors: error.errors,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email déjà existant",
      });
    }

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};


 //  LOGIN (CORRIGÉ)

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et password requis",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "Utilisateur introuvable",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Mot de passe incorrect",
      });
    }

    if (!user.password.startsWith('$2')) {
      user.password = password;
      await user.save();
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};


 //  FORGOT PASSWORD

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email?.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    return res.json({
      message: "Lien de reset généré",
      resetLink: `http://localhost:3000/reset-password/${resetToken}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};


  // RESET PASSWORD

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { email, password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      email: email?.trim().toLowerCase(),
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token invalide ou expiré",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({
      message: "Mot de passe mis à jour",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};