import { useAuth } from '../context/AuthContext';

/** @deprecated Préférer useAuth() — conservé pour compatibilité */
export const useAuthUser = () => useAuth();
