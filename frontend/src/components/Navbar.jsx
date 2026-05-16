import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight">
            <FileText size={24} />
            <span>InvoiceSaaS</span>
          </Link>
          
          <div>
            {token ? (
              <div className="flex items-center space-x-4">
                <Link to="/create" className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors text-sm">
                  + New Invoice
                </Link>
                <button onClick={handleLogout} className="text-indigo-100 hover:text-white flex items-center space-x-1">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-indigo-100 hover:text-white font-medium">Login</Link>
                <Link to="/register" className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
