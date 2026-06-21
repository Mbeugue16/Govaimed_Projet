const mongoose = require('mongoose');


   //Schéma Consultation


const consultationSchema = new mongoose.Schema(
  {
    // Dossier médical lié
    dossierMedicalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DossierMedical',
      required: true
    },

    // Patient concerné
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Médecin consulté
    medecinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Date de la consultation
    dateConsultation: {
      type: Date,
      default: Date.now
    },

    // Motif de consultation
    motif: {
      type: String,
      required: true,
      trim: true
    },

    // Symptômes observés
    symptomes: {
      type: [String],
      default: []
    },

    // Diagnostic médical
    diagnostic: {
      type: String,
      trim: true
    },

    // Recommandations
    recommandations: {
      type: String,
      trim: true
    },

    // Examens demandés
    examensDemandes: {
      type: [String],
      default: []
    },

    // Ordonnance liée (optionnelle)
    ordonnanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ordonnance'
    },

    // Constantes vitales
    constantes: {
      temperature: {
        type: Number
      },
      tension: {
        type: String
      },
      poids: {
        type: Number
      }
    },

    // Statut de la consultation
    statut: {
      type: String,
      enum: ['EN_COURS', 'TERMINEE', 'ANNULEE'],
      default: 'EN_COURS'
    },

    // Diagnostic validé
    diagnosticValide: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Consultation', consultationSchema);