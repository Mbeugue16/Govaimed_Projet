const mongoose = require('mongoose');
const Journal = require('../Models/JournalModel');


  // Créer une nouvelle entrée dans le journal

const createNewJournalEntry = async (req, res) => {
  try {
    const journalData = req.body;

    // Vérification de l'ID utilisateur si fourni
    if (journalData.userId && !mongoose.Types.ObjectId.isValid(journalData.userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide." });
    }

    const newJournalEntry = await Journal.create(journalData);
    return res.status(201).json({ message: "Entrée du journal créée avec succès", journal: newJournalEntry });

  } catch (error) {
    console.error("Erreur createNewJournalEntry:", error);
    return res.status(500).json({ message: 'Erreur création entrée journal', error: error.message });
  }
};


  // Récupérer toutes les entrées du journal

const getAllJournalEntries = async (req, res) => {
  try {
    const journalEntries = await Journal.find()
      .populate('userId', 'fullName email');

    return res.status(200).json(journalEntries);

  } catch (error) {
    console.error("Erreur getAllJournalEntries:", error);
    return res.status(500).json({ message: 'Erreur récupération entrées journal', error: error.message });
  }
};


  // Récupérer une entrée du journal par ID

const getJournalEntryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID entrée journal invalide." });
    }

    const journalEntry = await Journal.findById(id)
      .populate('userId', 'fullName email');

    if (!journalEntry) {
      return res.status(404).json({ message: "Entrée du journal non trouvée." });
    }

    return res.status(200).json(journalEntry);

  } catch (error) {
    console.error("Erreur getJournalEntryById:", error);
    return res.status(500).json({ message: 'Erreur récupération entrée journal', error: error.message });
  }
};


  // Mettre à jour une entrée du journal

const updateJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const journalData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID entrée journal invalide." });
    }

    const updatedJournalEntry = await Journal.findByIdAndUpdate(id, journalData, { new: true, runValidators: true });

    if (!updatedJournalEntry) {
      return res.status(404).json({ message: "Entrée du journal non trouvée." });
    }

    return res.status(200).json({ message: 'Entrée du journal mise à jour avec succès', journal: updatedJournalEntry });

  } catch (error) {
    console.error("Erreur updateJournalEntry:", error);
    return res.status(500).json({ message: 'Erreur mise à jour entrée journal', error: error.message });
  }
};


  // Supprimer une entrée du journal

const deleteJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID entrée journal invalide." });
    }

    const deleted = await Journal.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Entrée du journal non trouvée." });
    }

    return res.status(200).json({ message: 'Entrée du journal supprimée avec succès' });

  } catch (error) {
    console.error("Erreur deleteJournalEntry:", error);
    return res.status(500).json({ message: 'Erreur suppression entrée journal', error: error.message });
  }
};

module.exports = {
  createNewJournalEntry,
  getAllJournalEntries,
  getJournalEntryById,
  updateJournalEntry,
  deleteJournalEntry
};