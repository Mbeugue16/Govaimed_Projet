const mongoose = require('mongoose');
const Consultation = require('../Models/ConsultationModel');


  // Créer une nouvelle consultation

const createNewConsultation = async (req, res) => {
  try {
    const consultationData = req.body;

    // Validation des ID
    if (consultationData.patientId && !mongoose.Types.ObjectId.isValid(consultationData.patientId)) {
      return res.status(400).json({ message: "ID patient invalide." });
    }
    if (consultationData.medecinId && !mongoose.Types.ObjectId.isValid(consultationData.medecinId)) {
      return res.status(400).json({ message: "ID médecin invalide." });
    }

    const newConsultation = await Consultation.create(consultationData);
    return res.status(201).json({ message: "Consultation créée avec succès", consultation: newConsultation });

  } catch (error) {
    console.error("Erreur createNewConsultation:", error);
    return res.status(500).json({ message: 'Erreur création consultation', error: error.message });
  }
};


  // Récupérer toutes les consultations

const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .populate('patientId', 'fullName email date_of_birth sexe')
      .populate('medecinId', 'fullName email');

    return res.status(200).json(consultations);
  } catch (error) {
    console.error("Erreur getAllConsultations:", error);
    return res.status(500).json({ message: 'Erreur récupération consultations', error: error.message });
  }
};

   // Récupérer une consultation par ID

const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID consultation invalide." });
    }

    const consultation = await Consultation.findById(id)
      .populate('patientId', 'fullName email date_of_birth sexe')
      .populate('medecinId', 'fullName email');

    if (!consultation) {
      return res.status(404).json({ message: "Consultation non trouvée." });
    }

    return res.status(200).json(consultation);
  } catch (error) {
    console.error("Erreur getConsultationById:", error);
    return res.status(500).json({ message: 'Erreur récupération consultation', error: error.message });
  }
};


   // Mettre à jour une consultation

const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const consultationData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID consultation invalide." });
    }

    const updatedConsultation = await Consultation.findByIdAndUpdate(id, consultationData, { new: true, runValidators: true });

    if (!updatedConsultation) {
      return res.status(404).json({ message: "Consultation non trouvée." });
    }

    return res.status(200).json({ message: 'Consultation mise à jour avec succès', consultation: updatedConsultation });
  } catch (error) {
    console.error("Erreur updateConsultation:", error);
    return res.status(500).json({ message: 'Erreur mise à jour consultation', error: error.message });
  }
};


  // Supprimer une consultation

const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID consultation invalide." });
    }

    const deleted = await Consultation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Consultation non trouvée." });
    }

    return res.status(200).json({ message: 'Consultation supprimée avec succès' });
  } catch (error) {
    console.error("Erreur deleteConsultation:", error);
    return res.status(500).json({ message: 'Erreur suppression consultation', error: error.message });
  }
};

module.exports = {
  createNewConsultation,
  getAllConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation
};