import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShield, FiLock, FiDatabase, FiUsers, FiCalendar, FiFileText,
  FiMail, FiPhone, FiMapPin, FiSend, FiActivity, FiTrendingUp,
  FiCheckCircle, FiArrowUp, FiSearch, FiBell, FiHeart,
} from 'react-icons/fi';
import {
  FaStethoscope, FaHospital, FaAmbulance, FaDna, FaMicroscope,
  FaSyringe, FaUserMd, FaPills,
} from 'react-icons/fa';
import { MdMedicalServices } from 'react-icons/md';
import AnimatedSection from './ui/AnimatedSection';
import { useAuth } from '../context/AuthContext';
import { getRoleHomePath } from '../utils/userDisplay';
import '../Styles/Home.css';

const features = [
  { icon: FiFileText, title: 'Gestion des dossiers', desc: 'Centralisez et sécurisez tous les dossiers médicaux de vos patients.', color: '#114A70' },
  { icon: FiCalendar, title: 'Prise de rendez-vous', desc: 'Planification intelligente avec notifications et suivi en temps réel.', color: '#114A70' },
  { icon: FaPills, title: 'Prescriptions', desc: 'Ordonnances numériques traçables et accessibles aux pharmaciens.', color: '#114A70' },
  { icon: FiActivity, title: 'Historique médical', desc: 'Consultez l\'historique complet des consultations et examens.', color: '#114A70' },
  { icon: FiBell, title: 'Notifications', desc: 'Alertes SMS et in-app pour rendez-vous, résultats et rappels.', color: '#114A70' },
  { icon: FaHospital, title: 'Gestion pharmacie', desc: 'Coordination entre hôpitaux et officines pour une dispensation fluide.', color: '#114A70' },
  { icon: FiTrendingUp, title: 'Dashboard intelligent', desc: 'Tableaux de bord personnalisés avec statistiques en temps réel.', color: '#114A70' },
  { icon: FiShield, title: 'Sécurité', desc: 'Protection avancée des données sensibles conforme aux standards.', color: '#114A70' },
  { icon: FiSearch, title: 'Recherche rapide', desc: 'Trouvez instantanément patients, dossiers et rendez-vous.', color: '#114A70' },
  { icon: FiUsers, title: 'Multi-rôles', desc: 'Espaces dédiés pour patients, médecins, assistants et administrateurs.', color: '#114A70' },
];

const securityItems = [
  { icon: FiLock, title: 'JWT', desc: 'Authentification par tokens JSON Web Token sécurisés et signés.' },
  { icon: FiShield, title: 'bcrypt', desc: 'Hachage des mots de passe avec bcrypt pour une protection maximale.' },
  { icon: FiDatabase, title: 'Cookies HTTP Only', desc: 'Sessions protégées contre les attaques XSS via cookies sécurisés.' },
  { icon: MdMedicalServices, title: 'Protection des routes', desc: 'Routes privées avec vérification du token à chaque accès.' },
  { icon: FiUsers, title: 'Contrôle des rôles', desc: 'RBAC granulaire pour 10 profils utilisateurs distincts.' },
  { icon: FiHeart, title: 'Protection des données', desc: 'Chiffrement TLS/SSL et conformité aux normes sanitaires.' },
  { icon: FiFileText, title: 'Historique sécurisé', desc: 'Journalisation de tous les accès aux dossiers médicaux.' },
  { icon: FiCheckCircle, title: 'Validation des formulaires', desc: 'Contrôles côté client et serveur pour l\'intégrité des données.' },
];

const problems = [
  { title: 'Dossiers papier dispersés', desc: 'Les hôpitaux perdent du temps à chercher des informations éparpillées entre services.' },
  { title: 'Files d\'attente interminables', desc: 'Les patients attendent des heures sans visibilité sur leur position dans la queue.' },
  { title: 'Communication fragmentée', desc: 'Médecins, pharmaciens et assistants travaillent en silos sans coordination.' },
];

const solutions = [
  { icon: FiFileText, title: 'Dossiers numériques unifiés', desc: 'Un seul dossier accessible par tous les professionnels autorisés.' },
  { icon: FiCalendar, title: 'Rendez-vous optimisés', desc: 'Prise de RDV en ligne avec suivi du rang et notifications automatiques.' },
  { icon: FaUserMd, title: 'Écosystème connecté', desc: 'Plateforme intégrée pour tous les acteurs de la chaîne de soins.' },
];

const faqItems = [
  { q: 'GovAiMed est-il conforme aux normes de santé ?', a: 'Oui, notre plateforme respecte les standards internationaux de protection des données médicales.' },
  { q: 'Comment créer un compte patient ?', a: 'Cliquez sur "Créer un compte", sélectionnez le rôle Patient et remplissez le formulaire d\'inscription.' },
  { q: 'Mes données sont-elles sécurisées ?', a: 'Absolument. Nous utilisons JWT, bcrypt et chiffrement TLS pour protéger vos informations.' },
  { q: 'Puis-je prendre rendez-vous en ligne ?', a: 'Oui, une fois connecté, accédez à "Mes rendez-vous" pour planifier une consultation.' },
];

const Home = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAuthenticated && user?.role) {
    return <Navigate to={getRoleHomePath(user.role)} replace />;
  }

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Merci pour votre message ! Nous vous répondrons rapidement.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const floatingIcons = [
    { Icon: FaStethoscope, className: 'float-icon icon-1' },
    { Icon: FiHeart, className: 'float-icon icon-2' },
    { Icon: FaDna, className: 'float-icon icon-3' },
    { Icon: FaMicroscope, className: 'float-icon icon-4' },
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="hero-container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">
              <FiCheckCircle aria-hidden="true" /> Plateforme Sanitaire Numérique
            </span>
            <h1 className="hero-title">
              Gérez vos dossiers médicaux en <span className="gradient-text">toute sécurité</span>
            </h1>
            <p className="hero-subtitle">
              GovAiMed V2 connecte patients, médecins, assistants et pharmaciens
              dans un écosystème sanitaire moderne, sécurisé et adapté au Sénégal.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                Commencer
              </Link>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => scrollToSection('services')}>
                Découvrir les fonctionnalités
              </button>
            </div>
            <div className="hero-stats">
              {[
                { icon: FiUsers, num: '10 000+', label: 'Patients' },
                { icon: FaUserMd, num: '500+', label: 'Médecins' },
                { icon: FiCalendar, num: '50 000+', label: 'Rendez-vous' },
                { icon: FaHospital, num: '120+', label: 'Établissements' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="stat-item"
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <stat.icon size={24} aria-hidden="true" />
                  <div>
                    <span className="stat-number">{stat.num}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-illustration">
              <div className="ecg-line" aria-hidden="true">
                <svg viewBox="0 0 400 80" preserveAspectRatio="none">
                  <motion.path
                    d="M0,40 L40,40 L50,20 L60,60 L70,40 L120,40 L130,10 L140,70 L150,40 L400,40"
                    fill="none"
                    stroke="#F7D94C"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', repeatDelay: 1 }}
                  />
                </svg>
              </div>
              {floatingIcons.map(({ Icon, className }) => (
                <div key={className} className={className} aria-hidden="true">
                  <Icon size={28} />
                </div>
              ))}
              <div className="hero-card-float card-1">
                <FaStethoscope size={20} />
                <span>Consultation en cours</span>
              </div>
              <div className="hero-card-float card-2">
                <FiShield size={20} />
                <span>Données chiffrées</span>
              </div>
              <div className="hero-card-float card-3">
                <FaAmbulance size={20} />
                <span>Urgences 24/7</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pourquoi GovAiMed */}
      <section className="section why-section" id="why">
        <div className="container">
          <AnimatedSection className="section-header">
            <h2 className="section-title">Pourquoi GovAiMed ?</h2>
            <p className="section-subtitle">
              Une plateforme conçue pour moderniser la gestion sanitaire au Sénégal
              et améliorer l&apos;expérience de tous les acteurs de la santé.
            </p>
          </AnimatedSection>
          <div className="why-grid">
            {[
              { icon: FaHospital, title: 'Centralisation', desc: 'Toutes vos données médicales au même endroit, accessibles en un clic.' },
              { icon: FiShield, title: 'Sécurité maximale', desc: 'Protection JWT, bcrypt et contrôle d\'accès par rôle.' },
              { icon: FaSyringe, title: 'Efficacité clinique', desc: 'Réduisez les délais et améliorez la qualité des soins.' },
              { icon: FiTrendingUp, title: 'Analytics', desc: 'Statistiques en temps réel pour une meilleure prise de décision.' },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1} className="why-card">
                <div className="why-icon"><item.icon size={32} aria-hidden="true" /></div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Problèmes */}
      <section className="section problems-section">
        <div className="container">
          <AnimatedSection className="section-header">
            <h2 className="section-title">Les problèmes actuels des hôpitaux</h2>
            <p className="section-subtitle">Des défis quotidiens que GovAiMed résout concrètement</p>
          </AnimatedSection>
          <div className="problems-grid">
            {problems.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.1} className="problem-card">
                <span className="problem-number">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="section solutions-section">
        <div className="container">
          <AnimatedSection className="section-header">
            <h2 className="section-title">Comment GovAiMed les résout</h2>
          </AnimatedSection>
          <div className="solutions-grid">
            {solutions.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.15} direction="left" className="solution-card">
                <div className="solution-icon"><s.icon size={36} aria-hidden="true" /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-banner">
            {[
              { num: '99.9%', label: 'Disponibilité' },
              { num: '< 2s', label: 'Temps de réponse' },
              { num: '256-bit', label: 'Chiffrement AES' },
              { num: '10', label: 'Rôles supportés' },
            ].map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.1} className="stats-banner-item">
                <span className="stats-num">{s.num}</span>
                <span className="stats-lbl">{s.label}</span>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="section features" id="services">
        <div className="container">
          <AnimatedSection className="section-header">
            <h2 className="section-title">Nos Fonctionnalités</h2>
            <p className="section-subtitle">Des outils puissants pour une gestion sanitaire moderne</p>
          </AnimatedSection>
          <div className="feature-cards">
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.05} direction="zoom" className="feature-card">
                <motion.div className="feature-icon" whileHover={{ rotate: 5, scale: 1.1 }}>
                  <f.icon size={32} aria-hidden="true" />
                </motion.div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Sécurité */}
      <section className="section security" id="about">
        <div className="container">
          <AnimatedSection className="section-header">
            <h2 className="section-title">Sécurité & Confidentialité</h2>
            <p className="section-subtitle">Vos données médicales protégées selon les standards internationaux</p>
          </AnimatedSection>
          <div className="security-grid">
            {securityItems.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.08} className="security-card">
                <div className="security-icon"><s.icon size={28} aria-hidden="true" /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="compliance" delay={0.3}>
            <h3>Conformité aux Standards Internationaux</h3>
            <div className="compliance-badges">
              {['RGPD', 'HIPAA', 'ISO 27001', 'HDS'].map((badge) => (
                <span key={badge} className="compliance-badge">
                  <FiCheckCircle aria-hidden="true" /> {badge}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact */}
      <section className="section contact" id="contact">
        <div className="container">
          <AnimatedSection className="section-header">
            <h2 className="section-title">Contactez-nous</h2>
            <p className="section-subtitle">Notre équipe est disponible pour vous accompagner</p>
          </AnimatedSection>
          <div className="contact-layout">
            <AnimatedSection direction="left" className="contact-info-col">
              <div className="contact-illustration" aria-hidden="true">
                <FaUserMd size={64} />
                <FaHospital size={48} />
              </div>
              {[
                { icon: FiMail, title: 'Email', lines: ['contact@govaimed-sanitaire.com', 'support@govaimed-sanitaire.com'] },
                { icon: FiPhone, title: 'Téléphone', lines: ['+221 33 842 57 65', 'Lun-Ven : 8h - 18h'] },
                { icon: FiMapPin, title: 'Adresse', lines: ['Dakar, Sénégal', 'Plateforme Numérique Sanitaire'] },
              ].map((c) => (
                <div key={c.title} className="contact-item">
                  <div className="contact-icon"><c.icon size={22} aria-hidden="true" /></div>
                  <div>
                    <h4>{c.title}</h4>
                    {c.lines.map((line) => <p key={line}>{line}</p>)}
                  </div>
                </div>
              ))}
              <div className="map-placeholder" aria-label="Carte Google Maps - Dakar, Sénégal">
                <FiMapPin size={32} />
                <span>Dakar, Sénégal</span>
                <small>Google Maps (placeholder)</small>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" className="contact-form-col">
              <form className="contact-form" onSubmit={handleContactSubmit}>
                {[
                  { name: 'name', label: 'Nom complet *', type: 'text', placeholder: 'Votre nom' },
                  { name: 'email', label: 'Email *', type: 'email', placeholder: 'votre.email@exemple.com' },
                  { name: 'subject', label: 'Sujet *', type: 'text', placeholder: 'Sujet de votre message' },
                ].map((field) => (
                  <div key={field.name} className="form-group">
                    <label htmlFor={field.name}>{field.label}</label>
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={contactForm[field.name]}
                      onChange={handleContactChange}
                      required
                      placeholder={field.placeholder}
                      className="form-input"
                    />
                  </div>
                ))}
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows="5"
                    placeholder="Votre message..."
                    className="form-textarea"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-submit">
                  <FiSend aria-hidden="true" /> Envoyer le message
                </button>
              </form>
            </AnimatedSection>
          </div>

          {/* FAQ */}
          <AnimatedSection className="faq-section" delay={0.2}>
            <h3 className="faq-title">Questions fréquentes</h3>
            <div className="faq-grid">
              {faqItems.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {showScrollTop && (
        <motion.button
          type="button"
          className="scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Retour en haut"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <FiArrowUp size={20} />
        </motion.button>
      )}
    </div>
  );
};

export default Home;
