const mongoose = require('mongoose');


  // Schéma Journal d’activité


const journalSchema = new mongoose.Schema(
  {
    // Utilisateur à l’origine de l’action
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Rôle de l’utilisateur au moment de l’action
    role: {
      type: String,
      enum: [
        'Patient',
        'Medecin',
        'Pharmacien',
        'Assistant',
        'Admin',
        'SuperAdmin',
        'Moderateur'
      ],
      required: true
    },

    // Action effectuée
    action: {
      type: String,
      required: true,
      trim: true
    },

    // Type de ressource concernée
    resourceType: {
      type: String,
      enum: [
        'DOSSIER_MEDICAL',
        'CONSULTATION',
        'ORDONNANCE',
        'RENDEZ_VOUS',
        'UTILISATEUR'
      ],
      required: true
    },

    // ID de la ressource concernée
    resourceId: {
      type: mongoose.Schema.Types.ObjectId
    },

    // Adresse IP
    ipAddress: {
      type: String,
      trim: true
    },

    // Détails supplémentaires (flexible)
    details: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Journal', journalSchema);