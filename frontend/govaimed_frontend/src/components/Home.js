import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Styles/Home.css';
import { 
  FiShield, FiLock, FiDatabase, FiUsers, FiCalendar, FiFileText, 
  FiMail, FiPhone, FiMapPin, FiSend, FiActivity, FiTrendingUp, 
  FiCheckCircle, FiArrowUp 
} from 'react-icons/fi';

const Home = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  /** Gérer la navigation vers une section via hash URL */
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      setActiveSection('home');
    }
  }, [location]);

  /** Bouton "retour en haut" */
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('home');
  };

  /** Gestion du formulaire de contact */
  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Merci pour votre message ! Nous vous répondrons rapidement.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-badge"><FiCheckCircle className="mr-2" /> Plateforme Sanitaire Numérique</div>
          <h1 className="hero-title">Bienvenue chez <span className="gradient-text">GovAimed Sanitaire</span></h1>
          <p className="hero-subtitle">
            Votre partenaire pour la gestion sanitaire moderne, sécurisée et adaptée au Sénégal
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary"><FiUsers className="mr-2" />Créer un compte</Link>
            <Link to="/login" className="btn-secondary">Se connecter</Link>
          </div>

          {/* Statistiques rapides */}
          <div className="hero-stats">
            <div className="stat-item"><FiUsers size={24} /><div><span className="stat-number">10,000+</span><span className="stat-label">Patients</span></div></div>
            <div className="stat-item"><FiActivity size={24} /><div><span className="stat-number">500+</span><span className="stat-label">Médecins</span></div></div>
            <div className="stat-item"><FiCalendar size={24} /><div><span className="stat-number">50,000+</span><span className="stat-label">Rendez-vous</span></div></div>
          </div>
        </div>
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="features" id="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Nos Fonctionnalités</h2>
            <p className="section-subtitle">
              Outils puissants pour la gestion sanitaire et administrative
            </p>
          </div>
          <div className="cards">
            {[
              { icon: FiUsers, title: 'Gestion des Patients', desc: 'Suivez et gérez les dossiers médicaux de vos patients.', features: ['Dossiers médicaux complets', 'Historique médical', 'Suivi longitudinal'] },
              { icon: FiCalendar, title: 'Rendez-vous en Ligne', desc: 'Planifiez et gérez les rendez-vous médicaux en temps réel.', features: ['Prise de RDV en ligne', 'Suivi du rang', 'Notifications SMS/App'] },
              { icon: FiFileText, title: 'Dossiers Médicaux', desc: 'Accédez aux dossiers complets avec historique et examens.', features: ['Versioning des dossiers', 'Journal des accès', 'Signatures médicales'] },
              { icon: FiActivity, title: 'Consultations', desc: 'Historique complet des consultations médicales.', features: ['Historique complet', 'Prescriptions intégrées', 'Analyses et examens'] },
              { icon: FiFileText, title: 'Ordonnances', desc: 'Gérez les ordonnances de manière sécurisée et traçable.', features: ['Ordonnances numériques', 'Accès pharmacien', 'Traçabilité complète'] },
              { icon: FiTrendingUp, title: 'Multi-Rôles & Espaces', desc: 'Espaces dédiés pour tous les acteurs du système.', features: ['10 rôles différents', 'Permissions granulaires', 'Tableaux de bord personnalisés'] },
            ].map((f, i) => (
              <div key={i} className="card card-hover">
                <div className="card-icon"><f.icon size={40} /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <ul className="card-features">{f.features.map((feat, idx) => <li key={idx}><FiCheckCircle /> {feat}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sécurité */}
      <section className="security" id="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sécurité & Confidentialité</h2>
            <p className="section-subtitle">Vos données médicales sont protégées selon les standards internationaux.</p>
          </div>
          <div className="security-grid">
            {[
              { icon: FiLock, title: 'Chiffrement des Données', desc: 'Chiffrement TLS/SSL et AES-256.' },
              { icon: FiShield, title: 'Authentification Sécurisée', desc: 'Tokens JWT, RBAC et 2FA.' },
              { icon: FiDatabase, title: 'Sauvegarde Automatique', desc: 'Backups réguliers avec réplication.' },
              { icon: FiUsers, title: 'Conformité RGPD', desc: 'Respect strict des réglementations et audit régulier.' },
            ].map((s, i) => (
              <div key={i} className="security-item">
                <div className="security-icon"><s.icon size={48} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="compliance">
            <h3>Conformité aux Standards Internationaux</h3>
            <div className="compliance-badges">
              {['RGPD','HIPAA','ISO 27001','HDS'].map((badge, idx) => (
                <span key={idx} className="badge"><FiCheckCircle className="mr-1" /> {badge}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Contactez-nous</h2>
            <p className="section-subtitle">Notre équipe est là pour vous aider</p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              {[
                { icon: FiMail, title: 'Email', lines: ['contact@govaimed-sanitaire.com','support@govaimed-sanitaire.com'] },
                { icon: FiPhone, title: 'Téléphone', lines: ['+221 33 XXX XX XX','Lun-Ven: 8h-18h'] },
                { icon: FiMapPin, title: 'Adresse', lines: ['Dakar, Sénégal','Plateforme Numérique Sanitaire'] },
              ].map((c, i) => (
                <div key={i} className="contact-item">
                  <div className="contact-icon"><c.icon size={24} /></div>
                  <div><h4>{c.title}</h4>{c.lines.map((line, idx) => <p key={idx}>{line}</p>)}</div>
                </div>
              ))}
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              {['name','email','subject'].map((field,i) => (
                <div key={i} className="form-group">
                  <label htmlFor={field}>{field === 'name' ? 'Nom complet *' : field === 'email' ? 'Email *' : 'Sujet *'}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    id={field}
                    name={field}
                    value={contactForm[field]}
                    onChange={handleContactChange}
                    required
                    placeholder={field === 'name' ? 'Votre nom' : field === 'email' ? 'votre.email@exemple.com' : 'Sujet de votre message'}
                  />
                </div>
              ))}
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea id="message" name="message" value={contactForm.message} onChange={handleContactChange} required rows="5" placeholder="Votre message..." />
              </div>
              <button type="submit" className="btn-submit"><FiSend className="mr-2" size={18} />Envoyer le message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Bouton retour en haut */}
      {showScrollTop && <button className="scroll-top" onClick={scrollToTop}><FiArrowUp size={20} /></button>}
    </div>
  );
};

export default Home;