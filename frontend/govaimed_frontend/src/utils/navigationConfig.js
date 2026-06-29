import {
  FiHome, FiFolder, FiCalendar, FiFileText,
  FiUsers, FiBell, FiUser, FiSettings, FiBarChart2,
  FiClipboard, FiPackage, FiShield, FiList, FiGrid,
} from 'react-icons/fi';

export const publicNavLinks = [
  { id: 'home', label: 'Accueil', section: 'home' },
  { id: 'services', label: 'Fonctionnalités', section: 'services' },
  { id: 'about', label: 'Sécurité', section: 'about' },
  { id: 'contact', label: 'Contact', section: 'contact' },
];

/** Menus principaux visibles dans la navbar (pas le dropdown profil) */
export const roleMainNav = {
  Patient: [
    { label: 'Tableau de bord', path: '/patient/dashboard', icon: FiHome, end: true },
    { label: 'Mes dossiers', path: '/patient/dashboard/mes-dossiers', icon: FiFolder },
    { label: 'Mes rendez-vous', path: '/patient/dashboard/nouveau-rdv', icon: FiCalendar },
    { label: 'Mes médecins', path: '/patient/dashboard/mes-medecins', icon: FiUsers },
    { label: 'Mes prescriptions', path: '/patient/dashboard/prescriptions', icon: FiFileText },
    { label: 'Notifications', path: '/patient/dashboard/notifications', icon: FiBell },
    { label: 'Profil', path: '/patient/dashboard/profil', icon: FiUser },
  ],
  Medecin: [
    { label: 'Tableau de bord', path: '/medecin', icon: FiHome, end: true },
    { label: 'Patients', path: '/medecin', icon: FiUsers },
    { label: 'Consultations', path: '/medecin/rendezvous', icon: FiClipboard },
    { label: 'Rendez-vous', path: '/medecin/rendezvous', icon: FiCalendar },
    { label: 'Dossiers médicaux', path: '/medecin/mes-dossiers', icon: FiFolder },
    { label: 'Prescriptions', path: '/medecin/create-dossier', icon: FiFileText },
    { label: 'Profil', path: '/medecin/profil', icon: FiUser },
  ],
  Assistant: [
    { label: 'Accueil', path: '/services-rdv', icon: FiHome, end: true },
    { label: 'Patients', path: '/services-rdv', icon: FiUsers },
    { label: 'Rendez-vous', path: '/services-rdv', icon: FiCalendar },
    { label: 'Services', path: '/services-rdv', icon: FiGrid },
    { label: 'Notifications', path: '/services-rdv', icon: FiBell },
  ],
  AideSoignant: [
    { label: 'Accueil', path: '/services-rdv', icon: FiHome, end: true },
    { label: 'Patients', path: '/services-rdv', icon: FiUsers },
    { label: 'Rendez-vous', path: '/services-rdv', icon: FiCalendar },
    { label: 'Services', path: '/services-rdv', icon: FiGrid },
  ],
  Stagiaire: [
    { label: 'Accueil', path: '/services-rdv', icon: FiHome, end: true },
    { label: 'Patients', path: '/services-rdv', icon: FiUsers },
    { label: 'Rendez-vous', path: '/services-rdv', icon: FiCalendar },
    { label: 'Services', path: '/services-rdv', icon: FiGrid },
  ],
  MediateurNumerique: [
    { label: 'Accueil', path: '/services-rdv', icon: FiHome, end: true },
    { label: 'Patients', path: '/services-rdv', icon: FiUsers },
    { label: 'Services', path: '/services-rdv', icon: FiGrid },
  ],
  Pharmacien: [
    { label: 'Ordonnances', path: '/', icon: FiFileText },
    { label: 'Médicaments', path: '/', icon: FiPackage },
    { label: 'Stocks', path: '/', icon: FiList },
    { label: 'Patients', path: '/', icon: FiUsers },
    { label: 'Notifications', path: '/', icon: FiBell },
  ],
  Admin: [
    { label: 'Dashboard', path: '/admin', icon: FiHome, end: true },
    { label: 'Utilisateurs', path: '/admin', icon: FiUsers },
    { label: 'Services', path: '/services', icon: FiGrid },
    { label: 'Pharmacies', path: '/admin', icon: FiPackage },
    { label: 'Rôles', path: '/admin', icon: FiShield },
    { label: 'Statistiques', path: '/admin', icon: FiBarChart2 },
    { label: 'Logs', path: '/admin', icon: FiList },
    { label: 'Configuration', path: '/admin', icon: FiSettings },
  ],
  SuperAdmin: [
    { label: 'Dashboard', path: '/admin', icon: FiHome, end: true },
    { label: 'Utilisateurs', path: '/admin', icon: FiUsers },
    { label: 'Services', path: '/services', icon: FiGrid },
    { label: 'Pharmacies', path: '/admin', icon: FiPackage },
    { label: 'Rôles', path: '/admin', icon: FiShield },
    { label: 'Statistiques', path: '/admin', icon: FiBarChart2 },
    { label: 'Logs', path: '/admin', icon: FiList },
    { label: 'Configuration', path: '/admin', icon: FiSettings },
  ],
};

/** Menu dropdown profil (identique pour tous les rôles connectés, chemins adaptés) */
export const getProfileMenuItems = (role) => {
  const base = roleMainNav[role]?.[0]?.path || '/';

  const profilePaths = {
    Patient: {
      profil: '/patient/dashboard/profil',
      parametres: '/patient/dashboard/parametres',
      notifications: '/patient/dashboard/notifications',
    },
    Medecin: {
      profil: '/medecin/profil',
      parametres: '/medecin/profil',
      notifications: '/medecin/rendezvous',
    },
    Admin: { profil: '/admin', parametres: '/admin', notifications: '/admin' },
    SuperAdmin: { profil: '/admin', parametres: '/admin', notifications: '/admin' },
    Assistant: { profil: '/services-rdv', parametres: '/services-rdv', notifications: '/services-rdv' },
    AideSoignant: { profil: '/services-rdv', parametres: '/services-rdv', notifications: '/services-rdv' },
    Stagiaire: { profil: '/services-rdv', parametres: '/services-rdv', notifications: '/services-rdv' },
    MediateurNumerique: { profil: '/services-rdv', parametres: '/services-rdv', notifications: '/services-rdv' },
    Pharmacien: { profil: '/', parametres: '/', notifications: '/' },
  };

  const paths = profilePaths[role] || { profil: base, parametres: base, notifications: base };

  return [
    { label: 'Mon profil', path: paths.profil, icon: FiUser },
    { label: 'Paramètres', path: paths.parametres, icon: FiSettings },
    { label: 'Notifications', path: paths.notifications, icon: FiBell },
  ];
};

export const getRoleMainNav = (role) => roleMainNav[role] || [];

export const isNavItemActive = (pathname, item) => {
  if (item.end) {
    return pathname === item.path || pathname === `${item.path}/`;
  }
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
};

/** @deprecated */
export const getRoleNavItems = (role) => roleMainNav[role] || [];
