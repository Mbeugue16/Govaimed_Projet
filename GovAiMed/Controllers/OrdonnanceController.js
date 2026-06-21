const mongoose = require('mongoose');
const Ordonnance = require('../Models/OrdonnanceModel');


  // Créer une nouvelle ordonnance

const createNewOrdonnance = async (req, res) => {
  try {
    const ordonnanceData = req.body;

    // Vérification des IDs si fournis
    if (ordonnanceData.patientId && !mongoose.Types.ObjectId.isValid(ordonnanceData.patientId)) {
      return res.status(400).json({ message: "ID patient invalide." });
    }
    if (ordonnanceData.medecinId && !mongoose.Types.ObjectId.isValid(ordonnanceData.medecinId)) {
      return res.status(400).json({ message: "ID médecin invalide." });
    }

    const newOrdonnance = await Ordonnance.create(ordonnanceData);
    return res.status(201).json({ message: "Ordonnance créée avec succès", ordonnance: newOrdonnance });

  } catch (error) {
    console.error("Erreur createNewOrdonnance:", error);
    return res.status(500).json({ message: 'Erreur création ordonnance', error: error.message });
  }   
};


  // Récupérer toutes les ordonnances

const getAllOrdonnances = async (req, res) => {
  try {
    const ordonnances = await Ordonnance.find()
      .populate('patientId', 'fullName email')
      .populate('medecinId', 'fullName email');

    return res.status(200).json(ordonnances);

  } catch (error) {
    console.error("Erreur getAllOrdonnances:", error);
    return res.status(500).json({ message: 'Erreur récupération ordonnances', error: error.message });
  }
};


   // Récupérer une ordonnance par ID

const getOrdonnanceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID ordonnance invalide." });
    }

    const ordonnance = await Ordonnance.findById(id)
      .populate('patientId', 'fullName email')
      .populate('medecinId', 'fullName email');

    if (!ordonnance) {
      return res.status(404).json({ message: "Ordonnance non trouvée." });
    }

    return res.status(200).json(ordonnance);

  } catch (error) {
    console.error("Erreur getOrdonnanceById:", error);
    return res.status(500).json({ message: 'Erreur récupération ordonnance', error: error.message });
  }   
};


  // Mettre à jour une ordonnance

const updateOrdonnance = async (req, res) => {
  try {
    const { id } = req.params;
    const ordonnanceData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID ordonnance invalide." });
    }

    const updatedOrdonnance = await Ordonnance.findByIdAndUpdate(id, ordonnanceData, { new: true, runValidators: true });

    if (!updatedOrdonnance) {
      return res.status(404).json({ message: "Ordonnance non trouvée." });
    }

    return res.status(200).json({ message: 'Ordonnance mise à jour avec succès', ordonnance: updatedOrdonnance });

  } catch (error) {
    console.error("Erreur updateOrdonnance:", error);
    return res.status(500).json({ message: 'Erreur mise à jour ordonnance', error: error.message });
  }
};


  // Supprimer une ordonnance

const deleteOrdonnance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID ordonnance invalide." });
    }

    const deleted = await Ordonnance.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Ordonnance non trouvée." });
    }

    return res.status(200).json({ message: 'Ordonnance supprimée avec succès' });

  } catch (error) {
    console.error("Erreur deleteOrdonnance:", error);
    return res.status(500).json({ message: 'Erreur suppression ordonnance', error: error.message });
  }   
};

module.exports = {
  createNewOrdonnance,
  getAllOrdonnances,
  getOrdonnanceById,
  updateOrdonnance,
  deleteOrdonnance
};