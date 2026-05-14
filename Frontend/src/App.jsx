import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import HomeServicesHomepage from './components/HomeServicesHomepage';
import CustomerDashboard from './components/UsersHomepage';
import ProviderDashboard from './components/provider/ProviderDashboard';
import AdminDashboard from './components/AdminDashboard';
import BookServicePage from './components/BookServicePage';
import ServiceCatalog from './components/services/ServiceCatalog';
import AuthModal from './components/auth/AuthModal';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeServicesHomepage />} />
        <Route path="/services" element={<ServiceCatalog />} />
        <Route path="/book/:serviceName" element={<BookServicePage />} />
        
        {/* Auth Routes (can be modals but also pages for direct link) */}
        <Route path="/login" element={<AuthModal isOpen={true} onClose={() => window.history.back()} initialMode="login" />} />
        <Route path="/signup" element={<AuthModal isOpen={true} onClose={() => window.history.back()} initialMode="signup" />} />

        {/* Private Routes */}
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<HomeServicesHomepage />} />
      </Routes>
    </Router>
  );
}

export default App;