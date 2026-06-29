/**
 * Extrait un nom d'affichage convivial depuis le profil utilisateur.
 * Priorité : fullName → prénom (1er mot) → fallback générique (jamais l'email en titre).
 */
export const getDisplayName = (user) => {
  if (!user) return 'Utilisateur';

  if (user.fullName && user.fullName.trim()) {
    return user.fullName.trim();
  }

  if (user.firstName && user.firstName.trim()) {
    return user.firstName.trim();
  }

  const roleLabels = {
    Patient: 'Patient',
    Medecin: 'Docteur',
    Admin: 'Administrateur',
    SuperAdmin: 'Super Administrateur',
    Pharmacien: 'Pharmacien',
    Assistant: 'Assistant',
  };

  return roleLabels[user.role] || 'Utilisateur';
};

export const getFirstName = (user) => {
  const name = getDisplayName(user);
  return name.split(/\s+/)[0];
};

export const getInitials = (user) => {
  const name = getDisplayName(user);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

export const getGreeting = (user) => {
  const first = getFirstName(user);
  const hour = new Date().getHours();
  if (hour < 12) return `Bonjour, ${first} 👋`;
  if (hour < 18) return `Bon après-midi, ${first} 👋`;
  return `Bonsoir, ${first} 👋`;
};

export const formatDateFr = (date = new Date()) =>
  date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export const getRoleHomePath = (role) => {
  const paths = {
    Patient: '/patient/dashboard',
    Medecin: '/medecin',
    Admin: '/admin',
    SuperAdmin: '/admin',
    Pharmacien: '/',
    Assistant: '/services-rdv',
    AideSoignant: '/services-rdv',
    Stagiaire: '/services-rdv',
    MediateurNumerique: '/services-rdv',
    Moderateur: '/',
  };
  return paths[role] || '/';
};
