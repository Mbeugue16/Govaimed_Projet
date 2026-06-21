const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Générer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};


   //Enregistrement d'un utilisateur

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, adminDetails, medecinDetails } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Nom, email et mot de passe sont obligatoires." });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Préparer les données utilisateur
    const userData = {
      fullName,
      email,
      password: hashedPassword,
      role: role || 'Patient',
      statut: 'ACTIF'
    };

    //  Médecin : medecinDetails obligatoire
    if (role === 'Medecin') {
      if (!medecinDetails || !medecinDetails.specialite || !medecinDetails.cabinet) {
        return res.status(400).json({ message: "medecinDetails obligatoire pour les médecins." });
      }
      userData.medecinDetails = medecinDetails;
    }

    //  Admin : adminDetails facultatif
    if (role === 'Admin' && adminDetails) {
      userData.adminDetails = {
        adminCode: adminDetails?.adminCode || 'ADMIN-001',
        permissions: adminDetails?.permissions || ['all', 'users', 'services']
      };
    }

    const newUser = await User.create(userData);

    const token = generateToken(newUser);

    const userResponse = {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      statut: newUser.statut
    };

    return res.status(201).json({
      message: "Utilisateur enregistré avec succès.",
      user: userResponse,
      token
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    return res.status(500).json({
      message: "Erreur interne du serveur.",
      error: error.message
    });
  }
};


   //Connexion d'un utilisateur

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe sont requis." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
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
        statut: user.statut
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    return res.status(500).json({
      message: "Erreur interne du serveur.",
      error: error.message
    });
  }
};



const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Génération token sécurisé
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Génération OTP 6 chiffres
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

    // Ici normalement tu envoies un email avec nodemailer

    res.json({
      message: "Email de réinitialisation envoyé.",
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

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

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.resetPasswordOTP = undefined;

    await user.save();

    res.json({ message: "Mot de passe mis à jour avec succès." });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
};