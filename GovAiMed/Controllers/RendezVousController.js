const mongoose = require("mongoose");
const RendezVous = require("../Models/RendezVousModel");

//CRÉER UN RENDEZ-VOUS (RANG AUTO + SÉCURITÉ)
 
const createNewRendezVous = async (req, res) => {
  try {
    let { patientId, medecinId, serviceId, dateRendezVous, commentaire } =
      req.body;

    // 🔐 Patient connecté → ID automatique
    if (req.user && req.user.role === "Patient") {
      patientId = req.user._id;
    }

    // 🔎 Validation IDs
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "ID patient invalide" });
    }

    if (!mongoose.Types.ObjectId.isValid(medecinId)) {
      return res.status(400).json({ message: "ID médecin invalide" });
    }

    if (serviceId && !mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "ID service invalide" });
    }

    // 🕐 Bornes de la journée
    const startOfDay = new Date(dateRendezVous);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateRendezVous);
    endOfDay.setHours(23, 59, 59, 999);

    // 🔢 Calcul du rang automatique
    const lastRdv = await RendezVous.findOne({
      medecinId,
      dateRendezVous: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ rang: -1 });

    const rang = lastRdv ? lastRdv.rang + 1 : 1;

    // 📦 Données finales (IMPORTANT)
    const rdvData = {
      patientId,
      medecinId,
      dateRendezVous,
      rang,
      commentaire,
    };

    // ➕ Ajouter service seulement s’il existe
    if (serviceId) {
      rdvData.serviceId = serviceId;
    }

    const newRendezVous = await RendezVous.create(rdvData);

    return res.status(201).json({
      message: "Rendez-vous créé avec succès",
      rendezVous: newRendezVous,
    });
  } catch (error) {
    console.error("❌ Erreur createNewRendezVous:", error);
    return res.status(500).json({
      message: "Erreur création rendez-vous",
      error: error.message,
    });
  }
};

// RÉCUPÉRER TOUS LES RENDEZ-VOUS

const getAllRendezVous = async (req, res) => {
  try {
    const rendezvous = await RendezVous.find()
      .populate("patientId", "fullName email")
      .populate("medecinId", "fullName email")
      .populate("serviceId", "nom description");

    res.status(200).json(rendezvous);
  } catch (error) {
    console.error("Erreur getAllRendezVous:", error);
    res.status(500).json({ message: "Erreur récupération rendez-vous" });
  }
};

// RÉCUPÉRER UN RENDEZ-VOUS PAR ID

const getRendezVousById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID rendez-vous invalide" });
    }

    const rendezvous = await RendezVous.findById(id)
      .populate("patientId", "fullName email")
      .populate("medecinId", "fullName email")
      .populate("serviceId", "nom description");

    if (!rendezvous) {
      return res.status(404).json({ message: "Rendez-vous introuvable" });
    }

    res.status(200).json(rendezvous);
  } catch (error) {
    console.error("Erreur getRendezVousById:", error);
    res.status(500).json({ message: "Erreur récupération rendez-vous" });
  }
};

// METTRE À JOUR UN RENDEZ-VOUS (STATUT CONTRÔLÉ)

const updateRendezVous = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, commentaire } = req.body;

    const rdv = await RendezVous.findById(id);
    if (!rdv) {
      return res.status(404).json({ message: "Rendez-vous introuvable" });
    }

// 🔁 Machine d’états améliorée
const transitions = {
  EN_ATTENTE: ["PROPOSE", "EN_COURS", "ANNULE"],
  PROPOSE: ["EN_ATTENTE", "ANNULE"], 
  EN_COURS: ["TERMINE"],
  TERMINE: [],
  ANNULE: [],
};
    if (statut) {
      if (!transitions[rdv.statut].includes(statut)) {
        return res.status(400).json({
          message: `Transition invalide : ${rdv.statut} → ${statut}`,
        });
      }

      rdv.statut = statut;

      if (statut === "EN_COURS") rdv.heureDebut = new Date();
      if (statut === "TERMINE") rdv.heureFin = new Date();
    }

    if (commentaire) rdv.commentaire = commentaire;

    await rdv.save();

    res.status(200).json({
      message: "Rendez-vous mis à jour",
      rendezVous: rdv,
    });
  } catch (error) {
    console.error("Erreur updateRendezVous:", error);
    res.status(500).json({ message: "Erreur mise à jour rendez-vous" });
  }
};

// SUPPRIMER UN RENDEZ-VOUS

const deleteRendezVous = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID rendez-vous invalide" });
    }

    const deleted = await RendezVous.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Rendez-vous introuvable" });
    }

    res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteRendezVous:", error);
    res.status(500).json({ message: "Erreur suppression rendez-vous" });
  }
};

// RENDEZ-VOUS DU MÉDECIN – AUJOURD’HUI

const getTodayRendezVousMedecin = async (req, res) => {
  try {
    const medecinId = req.user._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const rendezvous = await RendezVous.find({
      medecinId,
      dateRendezVous: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("patientId", "fullName email")
      .populate("serviceId", "nom")
      .sort({ rang: 1 });

    res.status(200).json(rendezvous);
  } catch (error) {
    console.error("Erreur getTodayRendezVousMedecin:", error);
    res.status(500).json({
      message: "Erreur récupération rendez-vous du jour",
    });
  }
};

// PATIENT SUIVANT (FILE D’ATTENTE)

const patientSuivant = async (req, res) => {
  try {
    const medecinId = req.user._id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const currentRdv = await RendezVous.findOne({
      medecinId,
      statut: "EN_COURS",
      dateRendezVous: { $gte: startOfDay, $lte: endOfDay },
    });

    if (currentRdv) {
      currentRdv.statut = "TERMINE";
      currentRdv.heureFin = new Date();
      await currentRdv.save();
    }

    const nextRdv = await RendezVous.findOne({
      medecinId,
      statut: "EN_ATTENTE",
      dateRendezVous: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ rang: 1 });

    if (!nextRdv) {
      return res.status(200).json({
        message: "Aucun autre patient en attente",
        current: currentRdv || null,
        next: null,
      });
    }

    nextRdv.statut = "EN_COURS";
    nextRdv.heureDebut = new Date();
    await nextRdv.save();

    res.status(200).json({
      message: "Patient suivant appelé",
      current: currentRdv || null,
      next: nextRdv,
    });
  } catch (error) {
    console.error("Erreur patientSuivant:", error);
    res.status(500).json({ message: "Erreur patient suivant" });
  }
};

// PROPOSER UNE NOUVELLE DATE

const proposerNouvelleDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { nouvelleDate, commentaire } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID rendez-vous invalide" });
    }

    const rdv = await RendezVous.findById(id);
    if (!rdv) {
      return res.status(404).json({ message: "Rendez-vous introuvable" });
    }

    // 🔐 Sécurité : seul le médecin concerné
    if (rdv.medecinId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    rdv.dateProposee = nouvelleDate;
    rdv.statut = "PROPOSE";

    if (commentaire) rdv.commentaire = commentaire;

    await rdv.save();

    res.status(200).json({
      message: "Nouvelle date proposée au patient",
      rendezVous: rdv,
    });
  } catch (error) {
    console.error("Erreur proposerNouvelleDate:", error);
    res.status(500).json({ message: "Erreur proposition nouvelle date" });
  }
};


// TOUS LES RENDEZ-VOUS DU MÉDECIN
 
const getRendezVousMedecin = async (req, res) => {
  try {
    const medecinId = req.user._id;

    const rendezvous = await RendezVous.find({ medecinId })
      .populate("patientId", "fullName email")
      .populate("serviceId", "nom description")
      .sort({ dateRendezVous: -1 });

    res.status(200).json(rendezvous);
  } catch (error) {
    console.error("Erreur getRendezVousMedecin:", error);
    res.status(500).json({ message: "Erreur récupération rendez-vous médecin" });
  }
};


module.exports = {
  createNewRendezVous,
  getAllRendezVous,
  getRendezVousById,
  updateRendezVous,
  deleteRendezVous,
  getTodayRendezVousMedecin,
  patientSuivant,
  proposerNouvelleDate,
  getRendezVousMedecin,
};

