const mongoose = require('mongoose');
const Service = require('../Models/ServiceModel');


  // Créer un nouveau service

const createNewService = async (req, res) => {
  try {
    const { nom, description, type, dureeMoyenneConsultation, statut } = req.body;

    if (!nom) {
      return res.status(400).json({ message: "Le nom du service est requis." });
    }

    const newService = new Service({
      nom,
      description,
      type,
      dureeMoyenneConsultation,
      statut: statut || 'ACTIF'
    });

    const savedService = await newService.save();

    return res.status(201).json({
      message: 'Service créé avec succès',
      service: savedService
    });

  } catch (error) {
    console.error('CREATE SERVICE ERROR:', error);
    return res.status(500).json({
      message: 'Erreur lors de la création du service',
      error: error.message
    });
  }
};


  // Récupérer tous les services

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    return res.status(200).json(services);
  } catch (error) {
    console.error('GET ALL SERVICES ERROR:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des services',
      error: error.message
    });
  }
};


  // Récupérer un service par ID

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID service invalide." });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service introuvable." });
    }

    return res.status(200).json(service);

  } catch (error) {
    console.error('GET SERVICE BY ID ERROR:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération du service',
      error: error.message
    });
  }
};


   // Mettre à jour un service

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, type, dureeMoyenneConsultation, statut } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID service invalide." });
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { nom, description, type, dureeMoyenneConsultation, statut },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service introuvable." });
    }

    return res.status(200).json({
      message: 'Service mis à jour avec succès',
      service: updatedService
    });

  } catch (error) {
    console.error('UPDATE SERVICE ERROR:', error);
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour du service',
      error: error.message
    });
  }
};


  // Supprimer un service

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID service invalide." });
    }

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service introuvable." });
    }

    return res.status(200).json({ message: 'Service supprimé avec succès' });

  } catch (error) {
    console.error('DELETE SERVICE ERROR:', error);
    return res.status(500).json({
      message: 'Erreur lors de la suppression du service',
      error: error.message
    });
  }
};
// 🔓 Services visibles pour prise de rendez-vous (Patient)
const getServicesForRdv = async (req, res) => {
  try {
    const services = await Service.find({ statut: "ACTIF" })
      .select("_id nom description");

    return res.status(200).json(services);
  } catch (error) {
    console.error("Erreur getServicesForRdv:", error);
    return res.status(500).json({
      message: "Erreur récupération services"
    });
  }
};
module.exports = {
  createNewService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesForRdv
};