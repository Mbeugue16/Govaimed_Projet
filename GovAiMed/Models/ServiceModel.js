const mongoose = require('mongoose');


  // Schéma Service médical


const serviceSchema = new mongoose.Schema(
  {
    // Nom du service médical
    nom: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    // Description du service
    description: {
      type: String,
      trim: true
    },

    // Type de service
    type: {
      type: String,
      enum: [
        'MEDECINE_GENERALE',
        'PEDIATRIE',
        'GYNECOLOGIE',
        'DENTISTERIE',
        'OPHTALMOLOGIE',
        'CARDIOLOGIE',
        'AUTRE'
      ],
      default: 'AUTRE'
    },

    // Médecins rattachés au service
    medecins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    // Assistants rattachés au service
    assistants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    // Durée moyenne d’une consultation (en minutes)
    dureeMoyenneConsultation: {
      type: Number,
      default: 15,
      min: 5
    },

    // Statut du service
    statut: {
      type: String,
      enum: ['ACTIF', 'INACTIF'],
      default: 'ACTIF'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Service', serviceSchema);