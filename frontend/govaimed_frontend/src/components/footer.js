import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter,
  FiLinkedin, FiInstagram, FiSend,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../Styles/Footer.css';

const dashboardPrefixes = [
  '/patient/dashboard',
  '/medecin',
  '/admin',
  '/services',
  '/services-rdv',
];

const Footer = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [logoError, setLogoError] = useState(false);

  if (location.pathname.startsWith('/login') ||
      location.pathname.startsWith('/register') ||
      location.pathname.startsWith('/forgot-password') ||
      location.pathname.startsWith('/reset-password')) {
    return null;
  }

  if (isAuthenticated && dashboardPrefixes.some((p) => location.pathname.startsWith(p))) {
    return null;
  }

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      alert('Merci pour votre inscription à la newsletter !');
      setNewsletterEmail('');
    }
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,40 1440,30 L1440,60 L0,60 Z" fill="#114A70" />
        </svg>
      </div>

      <div className="footer-container">
        <div className="footer-content">
          <motion.div
            className="footer-section footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="footer-logo-link">
              {!logoError ? (
                <img
                  src="/govameid.jpeg"
                  alt="GovAiMed"
                  className="footer-logo-img"
                  onError={() => setLogoError(true)}
                  loading="lazy"
                />
              ) : (
                <span className="footer-logo-text">GovAiMed</span>
              )}
            </Link>
            <p className="footer-description">
              Votre partenaire de confiance pour la gestion sanitaire moderne,
              sécurisée et adaptée au contexte africain.
            </p>
            <div className="social-links">
              {[
                { Icon: FiFacebook, label: 'Facebook', href: 'https://facebook.com' },
                { Icon: FiTwitter, label: 'Twitter', href: 'https://twitter.com' },
                { Icon: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
                { Icon: FiInstagram, label: 'Instagram', href: 'https://instagram.com' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="social-link"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          <div className="footer-section">
            <h4>Liens rapides</h4>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><button type="button" onClick={() => scrollToSection('services')}>Fonctionnalités</button></li>
              <li><button type="button" onClick={() => scrollToSection('about')}>Sécurité</button></li>
              <li><button type="button" onClick={() => scrollToSection('contact')}>Contact</button></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><Link to="/register">Créer un compte</Link></li>
              <li><Link to="/login">Se connecter</Link></li>
              <li><button type="button" onClick={() => scrollToSection('services')}>Gestion des dossiers</button></li>
              <li><button type="button" onClick={() => scrollToSection('services')}>Rendez-vous</button></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>
                <FiMail size={18} className="contact-icon" aria-hidden="true" />
                <span>contact@govaimed-sanitaire.com</span>
              </li>
              <li>
                <FiPhone size={18} className="contact-icon" aria-hidden="true" />
                <span>+221 33 842 57 65</span>
              </li>
              <li>
                <FiMapPin size={18} className="contact-icon" aria-hidden="true" />
                <span>Dakar, Sénégal</span>
              </li>
            </ul>

            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <label htmlFor="newsletter-email">Newsletter</label>
              <div className="newsletter-input-group">
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Votre email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  aria-label="Adresse email pour la newsletter"
                />
                <button type="submit" aria-label="S'inscrire à la newsletter">
                  <FiSend size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GovAiMed Sanitaire. Tous droits réservés.</p>
          <div className="footer-legal">
            <button type="button">Politique de confidentialité</button>
            <span aria-hidden="true">|</span>
            <button type="button">Conditions d&apos;utilisation</button>
            <span aria-hidden="true">|</span>
            <button type="button">Mentions légales</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
