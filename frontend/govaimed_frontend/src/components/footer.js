import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';
import '../Styles/Footer.css';

const Footer = () => {
  const location = useLocation();

  // Masquer le footer sur les pages admin
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/superadmin')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Section logo et description */}
          <div className="footer-section">
            <h3 className="footer-logo">GovAimed Sanitaire</h3>
            <p className="footer-description">
              Votre partenaire de confiance pour la gestion sanitaire moderne et sécurisée.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-link"><FiFacebook size={20} /></a>
              <a href="#" aria-label="Twitter" className="social-link"><FiTwitter size={20} /></a>
              <a href="#" aria-label="LinkedIn" className="social-link"><FiLinkedin size={20} /></a>
              <a href="#" aria-label="Instagram" className="social-link"><FiInstagram size={20} /></a>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="footer-section">
            <h4>Liens rapides</h4>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><a href="#services">Fonctionnalités</a></li>
              <li><a href="#about">Sécurité</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><Link to="/register">Créer un compte</Link></li>
              <li><Link to="/login">Se connecter</Link></li>
              <li><a href="#services">Gestion des patients</a></li>
              <li><a href="#services">Rendez-vous</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>
                <FiMail size={18} className="contact-icon" />
                <span>contact@govaimed-sanitaire.com</span>
              </li>
              <li>
                <FiPhone size={18} className="contact-icon" />
                <span>+33 842 57 65</span>
              </li>
              <li>
                <FiMapPin size={18} className="contact-icon" />
                <span>Principal <br />221 Dakar,Senegal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="footer-bottom">
          <p>&copy; 2024 GovAimed Sanitaire. Tous droits réservés.</p>
          <div className="footer-legal">
            <a href="#">Politique de confidentialité</a>
            <span>|</span>
            <a href="#">Conditions d'utilisation</a>
            <span>|</span>
            <a href="#">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;