const mongoose = require("mongoose");
const Dossier = require("../Models/DossierModel");
const User = require("../Models/UserModel");


   //CRÉER DOSSIER (Médecin)

const createDossier = async (req, res) => {
  try {
    const {
      patientId,
      resumeMedical,
      groupeSanguin,
      antecedents,
      allergies,
      contactUrgence
    } = req.body;

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "Patient") {
      return res.status(400).json({ message: "Patient invalide" });
    }

    const dossier = await Dossier.create({
      patient: patientId,
      medecin: req.user._id,
      resumeMedical,
      groupeSanguin,
      antecedents,
      allergies,
      contactUrgence
    });

    res.status(201).json(dossier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  // DOSSIERS DU MÉDECIN

const getMyDossiers = async (req, res) => {
  try {
    const dossiers = await Dossier.find({
      medecin: req.user._id
    }).populate("patient", "fullName email");

    res.status(200).json(dossiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


   //TOUS LES DOSSIERS (Admin)

const getAllDossiers = async (req, res) => {
  try {
    const dossiers = await Dossier.find()
      .populate("patient", "fullName email")
      .populate("medecin", "fullName email");

    res.status(200).json(dossiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


   //DOSSIER PAR ID

const getDossierById = async (req, res) => {
  try {
    const { id } = req.params;

    const dossier = await Dossier.findById(id)
      .populate("patient", "fullName email")
      .populate("medecin", "fullName email");

    if (!dossier) {
      return res.status(404).json({ message: "Dossier introuvable" });
    }

    // Sécurité patient
    if (
      req.user.role === "Patient" &&
      dossier.patient._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    // Sécurité médecin
    if (
      req.user.role === "Medecin" &&
      dossier.medecin._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    res.status(200).json(dossier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


   //TOGGLE STATUT (Médecin)

const toggleDossierStatutByMedecin = async (req, res) => {
  try {
    const dossier = await Dossier.findOne({
      _id: req.params.id,
      medecin: req.user._id
    });

    if (!dossier) {
      return res.status(404).json({ message: "Dossier introuvable" });
    }

    dossier.statut = dossier.statut === "ACTIF" ? "INACTIF" : "ACTIF";
    await dossier.save();

    res.status(200).json(dossier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  // DOSSIERS DU PATIENT

const getMyPatientDossiers = async (req, res) => {
  try {
    console.log("📥 ROUTE PATIENT DOSSIERS APPELÉE");
    console.log("👤 USER ID:", req.user._id.toString());

    const allDossiers = await Dossier.find({});
    console.log("📦 TOUS LES DOSSIERS EN BASE:");
    allDossiers.forEach(d =>
      console.log({
        dossierId: d._id.toString(),
        patient: d.patient.toString(),
        statut: d.statut
      })
    );

    const dossiers = await Dossier.find({
      patient: req.user._id
    });

    console.log("✅ DOSSIERS MATCHÉS:", dossiers.length);

    res.status(200).json(dossiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createDossier,
  getMyDossiers,
  getAllDossiers,
  getDossierById,
  toggleDossierStatutByMedecin,
  getMyPatientDossiers
};