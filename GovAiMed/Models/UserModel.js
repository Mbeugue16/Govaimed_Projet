const mongoose = require('mongoose');


   // Sous-schemas des profils


// Admin
const adminSchema = new mongoose.Schema({
  adminCode: { type: String, required: true, unique: true },
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


  // Schéma principal User


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

  // patientDetails: { type: patientSchema, required: function () { return this.role === 'Patient'; } },
  medecinDetails: { type: mongoose.Schema.Types.Mixed }, // le modèle Medecin est séparé
  pharmacienDetails: { type: pharmacienSchema, required: function () { return this.role === 'Pharmacien'; } },
  assistantDetails: { type: assistantSchema, required: function () { return this.role === 'Assistant'; } },
  adminDetails: { type: adminSchema, required: function () { return this.role === 'Admin' || this.role === 'SuperAdmin'; } },
  moderatorDetails: { type: moderatorSchema, required: function () { return this.role === 'Moderateur'; } }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);