const mongoose = require('mongoose');

const antecedentSchema = new mongoose.Schema({
  libelle: String
}, { _id: false });

const allergieSchema = new mongoose.Schema({
  libelle: String
}, { _id: false });

const contactUrgenceSchema = new mongoose.Schema({
  nom: String,
  telephone: String,
  lien: String
}, { _id: false });

const dossierSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  medecin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  resumeMedical: String,
  groupeSanguin: String,
  antecedents: [antecedentSchema],
  allergies: [allergieSchema],
  contactUrgence: contactUrgenceSchema,

  statut: {
    type: String,
    enum: ["ACTIF", "INACTIF"],
    default: "ACTIF"
  }
}, { timestamps: true });

module.exports = mongoose.model("Dossier", dossierSchema);