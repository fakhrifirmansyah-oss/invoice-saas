import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceDetail from './pages/InvoiceDetail';
import EditInvoicePage from './pages/EditInvoicePage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify/:token" element={<VerifyEmail />} />
            
            {/* Private Routes need the container padding, so we wrap them in a div or move the padding to the component */}
            <Route path="/dashboard" element={
              <PrivateRoute><div className="container mx-auto px-4 py-8 max-w-5xl"><Dashboard /></div></PrivateRoute>
            } />
            <Route path="/create" element={
              <PrivateRoute><div className="container mx-auto px-4 py-8 max-w-5xl"><CreateInvoice /></div></PrivateRoute>
            } />
            <Route path="/invoice/:id" element={
              <PrivateRoute><div className="container mx-auto px-4 py-8 max-w-5xl"><InvoiceDetail /></div></PrivateRoute>
            } />
            <Route path="/invoice/:id/edit" element={
              <PrivateRoute><EditInvoicePage /></PrivateRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
