import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiMenu, FiUser, FiLogIn, FiUserPlus, FiLogOut, FiChevronDown,
} from 'react-icons/fi';
import {
  publicNavLinks,
  getRoleMainNav,
  getProfileMenuItems,
  isNavItemActive,
} from '../utils/navigationConfig';
import { useAuth } from '../context/AuthContext';
import { getDisplayName, getFirstName, getRoleHomePath } from '../utils/userDisplay';
import '../Styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const profileRef = useRef(null);

  const isAuthPage = ['/login', '/register', '/forgot-password'].some(
    (p) => location.pathname.startsWith(p)
  );
  const isResetPage = location.pathname.startsWith('/reset-password');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isAuthPage || isResetPage) return null;

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMenuOpen(false);
  };

  const mainNavItems = user?.role ? getRoleMainNav(user.role) : [];
  const profileMenuItems = user?.role ? getProfileMenuItems(user.role) : [];
  const displayName = getDisplayName(user);
  const firstName = getFirstName(user);
  const logoHref = isAuthenticated ? getRoleHomePath(user?.role) : '/';

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} aria-label="Navigation principale">
      <div className="navbar-container">
        <Link to={logoHref} className="navbar-logo" aria-label="GovAiMed - Accueil">
          {!logoError ? (
            <motion.img
              src="/govameid.jpeg"
              alt="GovAiMed"
              className="navbar-logo-img"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onError={() => setLogoError(true)}
              loading="lazy"
            />
          ) : (
            <span className="navbar-logo-text">GovAiMed</span>
          )}
        </Link>

        <ul className="navbar-links">
          {isAuthenticated ? (
            mainNavItems.map((item) => (
              <li key={`${item.label}-${item.path}`}>
                <Link
                  to={item.path}
                  className={`nav-link ${isNavItemActive(location.pathname, item) ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </li>
            ))
          ) : (
            publicNavLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => scrollToSection(link.section)}
                >
                  {link.label}
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="navbar-actions" ref={profileRef}>
          {isAuthenticated && (
            <span className="navbar-user-greeting" aria-hidden="true">
              {firstName}
            </span>
          )}

          <button
            type="button"
            className="profile-btn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Menu utilisateur"
            aria-expanded={isProfileOpen}
          >
            <FiUser size={20} />
            <FiChevronDown size={14} className="profile-chevron" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                className="profile-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {isAuthenticated ? (
                  <>
                    <div className="profile-header">
                      <div className="profile-header-avatar">{firstName.charAt(0).toUpperCase()}</div>
                      <div>
                        <strong>{displayName}</strong>
                        <span>{user.role}</span>
                      </div>
                    </div>
                    <hr />
                    {profileMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        className="dropdown-item"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <item.icon size={16} aria-hidden="true" />
                        {item.label}
                      </Link>
                    ))}
                    <button type="button" className="dropdown-item logout" onClick={logout}>
                      <FiLogOut size={16} aria-hidden="true" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                      <FiLogIn size={16} aria-hidden="true" />
                      Connexion
                    </Link>
                    <Link to="/register" className="dropdown-item highlight" onClick={() => setIsProfileOpen(false)}>
                      <FiUserPlus size={16} aria-hidden="true" />
                      Créer un compte
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            className="navbar-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="navbar-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {isAuthenticated ? (
              <>
                {mainNavItems.map((item) => (
                  <Link key={`m-${item.label}`} to={item.path} onClick={() => setIsMenuOpen(false)}>
                    <item.icon size={18} aria-hidden="true" />
                    {item.label}
                  </Link>
                ))}
                <hr className="mobile-divider" />
                {profileMenuItems.map((item) => (
                  <Link key={`mp-${item.label}`} to={item.path} onClick={() => setIsMenuOpen(false)}>
                    <item.icon size={18} aria-hidden="true" />
                    {item.label}
                  </Link>
                ))}
                <button type="button" className="mobile-logout" onClick={logout}>
                  <FiLogOut size={18} aria-hidden="true" /> Déconnexion
                </button>
              </>
            ) : (
              <>
                {publicNavLinks.map((link) => (
                  <button key={link.id} type="button" onClick={() => scrollToSection(link.section)}>
                    {link.label}
                  </button>
                ))}
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <FiLogIn size={18} aria-hidden="true" /> Connexion
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <FiUserPlus size={18} aria-hidden="true" /> Créer un compte
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
