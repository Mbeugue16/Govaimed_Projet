const router = require("express").Router();

const UserController = require("../Controllers/UserController");
const ConsultationController = require("../Controllers/ConsultationController");
const ServiceController = require("../Controllers/ServiceController");
const RendezVousController = require("../Controllers/RendezVousController");
const DossierController = require("../Controllers/DossierController");
const OrdonnanceController = require("../Controllers/OrdonnanceController");
const JournalController = require("../Controllers/JournalController");
const authController = require("../Controllers/Auth");

const { authorize } = require("../Middlewares/Authorization");

const {
  authorizeRoles,
  authorizeMedecin,
  authorizeMedecinOrAdmin,
  authorizeAdminOrSuperAdmin,
  authorizePatient,
} = require("../Middlewares/RoleAuthorization");







// AUTH

router.post("/auth/register", authController.registerUser);
router.post("/auth/login", authController.loginUser);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password/:token", authController.resetPassword);



//JOURNAL 

router.post("/journal", authorize, authorizeAdminOrSuperAdmin, JournalController.createNewJournalEntry);
router.get("/journal", authorize, authorizeAdminOrSuperAdmin, JournalController.getAllJournalEntries);
router.get("/journal/:id", authorize, authorizeAdminOrSuperAdmin, JournalController.getJournalEntryById);
router.put("/journal/:id", authorize, authorizeAdminOrSuperAdmin, JournalController.updateJournalEntry);
router.delete("/journal/:id", authorize, authorizeAdminOrSuperAdmin, JournalController.deleteJournalEntry);



// ORDONNANCES

router.post("/ordonnance", authorize, authorizeMedecinOrAdmin, OrdonnanceController.createNewOrdonnance);
router.get("/ordonnances", authorize, authorizeMedecinOrAdmin, OrdonnanceController.getAllOrdonnances);
router.get("/ordonnance/:id", authorize, authorizeMedecinOrAdmin, OrdonnanceController.getOrdonnanceById);
router.put("/ordonnance/:id", authorize, authorizeMedecinOrAdmin, OrdonnanceController.updateOrdonnance);
router.delete("/ordonnance/:id", authorize, authorizeMedecinOrAdmin, OrdonnanceController.deleteOrdonnance);



//DOSSIERS

router.post("/dossiers", authorize, authorizeMedecin, DossierController.createDossier);
router.get("/medecin/dossiers", authorize, authorizeMedecin, DossierController.getMyDossiers);
router.get("/patient/dossiers", authorize, authorizePatient, DossierController.getMyPatientDossiers);
router.put("/medecin/dossiers/:id/statut", authorize, authorizeMedecin, DossierController.toggleDossierStatutByMedecin);
router.get("/dossiers", authorize, authorizeAdminOrSuperAdmin, DossierController.getAllDossiers);
router.get("/dossiers/:id", authorize, DossierController.getDossierById);



//RENDEZ-VOUS 


// Création
router.post(
  "/rendezvous",
  authorize,
  authorizeRoles(["Patient", "Assistant", "Medecin", "Admin", "SuperAdmin"]),
  RendezVousController.createNewRendezVous
);

// Tous les RDV (Admin / Medecin ...)
router.get(
  "/rendezvous",
  authorize,
  authorizeRoles(["Assistant", "Medecin", "Admin", "SuperAdmin", "MediateurNumerique"]),
  RendezVousController.getAllRendezVous
);

//  RDV DU MÉDECIN CONNECTÉ 
router.get(
  "/rendezvous/medecin",
  authorize,
  authorizeRoles(["Medecin"]),
  RendezVousController.getRendezVousMedecin
);

// RDV du médecin aujourd’hui
router.get(
  "/rendezvous/medecin/aujourdhui",
  authorize,
  authorizeRoles(["Medecin"]),
  RendezVousController.getTodayRendezVousMedecin
);

// Patient suivant
router.post(
  "/rendezvous/medecin/patient-suivant",
  authorize,
  authorizeRoles(["Medecin"]),
  RendezVousController.patientSuivant
);

// UN RDV PAR ID 
router.get(
  "/rendezvous/:id",
  authorize,
  authorizeRoles(["Patient", "Assistant", "Medecin", "Admin", "SuperAdmin"]),
  RendezVousController.getRendezVousById
);

router.put(
  "/rendezvous/:id",
  authorize,
  authorizeRoles(["Assistant", "Medecin", "Admin", "SuperAdmin"]),
  RendezVousController.updateRendezVous
);

router.delete(
  "/rendezvous/:id",
  authorize,
  authorizeRoles(["Assistant", "Medecin", "Admin", "SuperAdmin"]),
  RendezVousController.deleteRendezVous
);


// USERS 

router.get(
  "/users/medecins-rdv",
  authorize,
  authorizeRoles(["Patient", "Assistant", "Admin", "SuperAdmin"]),
  UserController.getMedecinsForPatients
);



//CONSULTATIONS 

router.post("/consultation", authorize, authorizeMedecinOrAdmin, ConsultationController.createNewConsultation);
router.get("/consultations", authorize, authorizeMedecinOrAdmin, ConsultationController.getAllConsultations);
router.get("/consultations/:id", authorize, authorizeMedecinOrAdmin, ConsultationController.getConsultationById);
router.put("/consultations/:id", authorize, authorizeMedecinOrAdmin, ConsultationController.updateConsultation);
router.delete("/consultations/:id", authorize, authorizeMedecinOrAdmin, ConsultationController.deleteConsultation);



//USERS

router.post("/users", authorize, authorizeAdminOrSuperAdmin, UserController.createNewUser);
router.get("/users", authorize, authorizeAdminOrSuperAdmin, UserController.getAllUsers);
router.get("/patients", authorize, authorizeMedecinOrAdmin, UserController.getAllPatients);
router.get("/users/:id", authorize, authorizeAdminOrSuperAdmin, UserController.getUserById);
router.put("/users/:id", authorize, authorizeAdminOrSuperAdmin, UserController.updateUser);
router.delete("/users/:id", authorize, authorizeAdminOrSuperAdmin, UserController.deleteUser);



//SERVICES 

router.post("/services", authorize, authorizeAdminOrSuperAdmin, ServiceController.createNewService);

router.get(
  "/services",
  authorize,
  authorizeRoles(["Medecin", "Assistant", "Admin", "SuperAdmin", "MediateurNumerique"]),
  ServiceController.getAllServices
);

router.get(
  "/services/:id",
  authorize,
  authorizeRoles(["Medecin", "Assistant", "Admin", "SuperAdmin"]),
  ServiceController.getServiceById
);

router.get(
  "/services-rdv",
  authorize,
  authorizeRoles(["Patient", "Assistant", "Admin", "SuperAdmin"]),
  ServiceController.getServicesForRdv
);

router.put("/services/:id", authorize, authorizeAdminOrSuperAdmin, ServiceController.updateService);
router.delete("/services/:id", authorize, authorizeAdminOrSuperAdmin, ServiceController.deleteService);



module.exports = router;