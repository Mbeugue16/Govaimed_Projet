const mongoose = require("mongoose");

/*
  Schéma Rendez-Vous
 */
const rendezVousSchema = new mongoose.Schema(
  {
    // Patient concerné
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Médecin concerné
    medecinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Service (optionnel)
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },

    // Date et heure du rendez-vous
    dateRendezVous: {
      type: Date,
      required: [true, "La date du rendez-vous est obligatoire"],
      validate: {
        validator: function (value) {
          // ✅ Si on ne modifie pas la date, on ne revalide pas
          if (!this.isModified("dateRendezVous")) return true;

          // ✅ Vérifier que la date est valide
          if (!value || isNaN(new Date(value).getTime())) return false;

          // ✅ Tolérance d'1 minute
          return new Date(value).getTime() >= Date.now() - 60000;
        },
        message: "La date du rendez-vous ne peut pas être passée",
      },
    },

    // Rang automatique
    rang: {
      type: Number,
      required: true,
      min: [1, "Le rang doit être supérieur ou égal à 1"],
    },

    // Statut du rendez-vous
    statut: {
      type: String,
      enum: ["EN_ATTENTE", "EN_COURS", "TERMINE", "ANNULE"],
      default: "EN_ATTENTE",
    },

    // Ticket payé
    ticketPaye: {
      type: Boolean,
      default: false,
    },

    // Heures réelles
    heureDebut: {
      type: Date,
      default: null,
    },

    heureFin: {
      type: Date,
      default: null,
    },

    // Commentaire
    commentaire: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// 🔒 Empêcher doublon de rang pour un même médecin à une même date
rendezVousSchema.index(
  { medecinId: 1, dateRendezVous: 1, rang: 1 },
  { unique: true }
);

module.exports = mongoose.model("RendezVous", rendezVousSchema);