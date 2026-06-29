import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './Styles/Global.css';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import Home from './components/Home';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword'; 
import ResetPassword from './auth/ResetPassword';
import RendezVousMedecin from './pages/RendezVousMedecin';
import AdminDashboard from './admin/AdminDashboard';
import MedecinDashboard from './pages/MedecinDashboard';
import MedecinProfile from './pages/MedecinProfile';
import CreateDossier from './pages/CreateDossier';
import MesDossiers from './pages/MesDossiers';
import PatientDashboard from './pages/Composants/PatientDashboard';
import DashboardHome from './pages/Composants/DashboardHome';
import MyDossiers from './pages/Composants/MyDossiers';
import PatientProfile from './pages/Composants/PatientProfile';
import PatientMedecins from './pages/Composants/PatientMedecins';
import PatientPrescriptions from './pages/Composants/PatientPrescriptions';
import PatientNotifications from './pages/Composants/PatientNotifications';
import PatientParametres from './pages/Composants/PatientParametres';
import PrivateRoute from './auth/PrivateRoute';
import PrendreRdv from './pages/PrendreRdv';
import ServiceList from './services/ServiceList';
import ServiceForm from './services/ServiceForm';
import ServicesRdv from './services/ServicesRdv';


function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Pages publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Dashboard Admin (protégé) */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Dashboard Médecin (protégé) */}
          <Route
            path="/medecin"
            element={
              <PrivateRoute allowedRoles={['Medecin']}>
                <MedecinDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/medecin/create-dossier"
            element={
              <PrivateRoute allowedRoles={['Medecin']}>
                <CreateDossier />
              </PrivateRoute>
            }
          />
          <Route
            path="/medecin/mes-dossiers"
            element={
              <PrivateRoute allowedRoles={['Medecin']}>
                <MesDossiers />
              </PrivateRoute>
            }
          />
          <Route
            path="/medecin/rendezvous"
            element={
              <PrivateRoute allowedRoles={['Medecin']}>
                <RendezVousMedecin />
              </PrivateRoute>
            }
          />
          <Route
            path="/medecin/profil"
            element={
              <PrivateRoute allowedRoles={['Medecin']}>
                <MedecinProfile />
              </PrivateRoute>
            }
          />

          {/* Pages Patient (protégé) */}
          <Route
            path="/patient/dashboard"
            element={
              <PrivateRoute allowedRoles={['Patient']}>
                <PatientDashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="mes-dossiers" element={<MyDossiers />} />
            <Route path="nouveau-rdv" element={<PrendreRdv />} />
            <Route path="mes-medecins" element={<PatientMedecins />} />
            <Route path="prescriptions" element={<PatientPrescriptions />} />
            <Route path="notifications" element={<PatientNotifications />} />
            <Route path="profil" element={<PatientProfile />} />
            <Route path="parametres" element={<PatientParametres />} />
          </Route>

          {/* Services (Admin) */}
          <Route
            path="/services"
            element={
              <PrivateRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <ServiceList />
              </PrivateRoute>
            }
          />
          <Route
            path="/services/create"
            element={
              <PrivateRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <ServiceForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/services/edit/:id"
            element={
              <PrivateRoute allowedRoles={['Admin', 'SuperAdmin']}>
                <ServiceForm />
              </PrivateRoute>
            }
          />

          {/* Services pour prise de rendez-vous (Patient/Assistant) */}
          <Route
            path="/services-rdv"
            element={
              <PrivateRoute allowedRoles={['Patient', 'Assistant']}>
                <ServicesRdv />
              </PrivateRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;