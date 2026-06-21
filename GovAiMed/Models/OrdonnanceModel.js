const mongoose = require('mongoose');


   // Sous-schéma Médicament


const medicamentSchema = new mongoose.Schema(
  {
    nomMedicament: {
      type: String,
      required: true,
      trim: true
    },

    dosage: {
      type: String,
      trim: true
    },

    frequence: {
      type: String,
      trim: true
    },

    duree: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);


  // Schéma principal Ordonnance


const ordonnanceSchema = new mongoose.Schema(
  {
    // Patient concerné
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Médecin prescripteur
    medecinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Date de l’ordonnance
    dateOrdonnance: {
      type: Date,
      default: Date.now
    },

    // Liste des médicaments
    medicaments: {
      type: [medicamentSchema],
      required: true,
      default: []
    },

    // Instructions complémentaires
    instructionsSupplementaires: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Ordonnance', ordonnanceSchema);