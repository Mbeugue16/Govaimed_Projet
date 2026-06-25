const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // 🟢 AJOUT : Importation de bcrypt pour la comparaison des mots de passe


// 1. Sous-schémas des profils


// Admin
const adminSchema = new mongoose.Schema({
  adminCode: { type: String, required: true },
  permissions: { type: [String], default: [] }
}, { _id: false });

// Modérateur
const moderatorSchema = new mongoose.Schema({
  moderatedSections: { type: [String], default: [] }
}, { _id: false });

// Patient
const patientSchema = new mongoose.Schema({
  dateNaissance: { type: Date },
  sexe: { type: String, enum: ['M', 'F'] },
  contact: { type: String }
}, { _id: false });

// Pharmacien
const pharmacienSchema = new mongoose.Schema({
  nomPharmacie: { type: String },
  adressePharmacie: { type: String }
}, { _id: false });

// Assistant
const assistantSchema = new mongoose.Schema({
  poste: { type: String },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }
}, { _id: false });

// Médecin
const medecinSchema = new mongoose.Schema({
  specialite: { type: String, required: true, trim: true },
  telephone: { type: String, required: true, trim: true },
  adresseCabinet: { type: String, required: true, trim: true }
}, { _id: false });



// 2. Schéma principal User

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, minlength: 3, maxlength: 50 },
  date_of_birth: { type: Date },
  sexe: { type: String, enum: ['M', 'F'] },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [
      'Patient', 'Medecin', 'Pharmacien', 'Assistant',
      'AideSoignant', 'Stagiaire', 'MediateurNumerique',
      'Admin', 'SuperAdmin', 'Moderateur'
    ],
    default: 'Patient'
  },
  statut: { type: String, enum: ['ACTIF', 'INACTIF'], default: 'ACTIF' },
  ref: { type: String },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Détails spécifiques selon le rôle
  patientDetails: { type: patientSchema },
  medecinDetails: { type: medecinSchema, required: function () { return this.role === 'Medecin'; } },
  pharmacienDetails: { type: pharmacienSchema, required: function () { return this.role === 'Pharmacien'; } },
  assistantDetails: { type: assistantSchema, required: function () { return this.role === 'Assistant'; } },
  adminDetails: { type: adminSchema, required: function () { return this.role === 'Admin' || this.role === 'SuperAdmin'; } },
  moderatorDetails: { type: moderatorSchema, required: function () { return this.role === 'Moderateur'; } }
}, { timestamps: true });



// 3. Méthodes d'instance (Mongoose Methods)


userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password || !candidatePassword) return false;

  if (this.password.startsWith('$2')) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  return candidatePassword === this.password;
};

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// 4. Compilation et Export du Modèle


module.exports = mongoose.model('User', userSchema);