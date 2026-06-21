import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiX, FiMenu } from 'react-icons/fi';
import '../Styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 🔹 Hooks au début
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔹 Scroll fluide vers les sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMenuOpen(false);
  };

  // 🔹 Ne pas afficher la navbar sur certaines pages
  if (
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname.startsWith('/admin')
  ) {
    return null;
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo ou texte simple */}
        <div className="navbar-logo">
          <span className="logo">Plateforme Sanitaire</span>
        </div>

        {/* Menu Desktop */}
        <ul className="navbar-links">
          <li><button className="nav-link" onClick={() => scrollToSection('home')}>Accueil</button></li>
          <li><button className="nav-link" onClick={() => scrollToSection('services')}>Fonctionnalités</button></li>
          <li><button className="nav-link" onClick={() => scrollToSection('about')}>Sécurité</button></li>
          <li><button className="nav-link" onClick={() => scrollToSection('contact')}>Contact</button></li>
          <li><Link to="/login" className="nav-link btn-login">Connexion</Link></li>
          <li><Link to="/register" className="nav-link btn-register">S'inscrire</Link></li>
        </ul>

        {/* Menu Mobile Toggle */}
        <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="navbar-mobile">
          <button onClick={() => scrollToSection('home')}>Accueil</button>
          <button onClick={() => scrollToSection('services')}>Fonctionnalités</button>
          <button onClick={() => scrollToSection('about')}>Sécurité</button>
          <button onClick={() => scrollToSection('contact')}>Contact</button>
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
          <Link to="/register" onClick={() => setIsMenuOpen(false)}>S'inscrire</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;