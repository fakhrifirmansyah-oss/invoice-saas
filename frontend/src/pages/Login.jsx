import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', { token: credentialResponse.credential });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">{error}</div>}
      
      <div className="mb-6 flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google Login Failed')}
        />
      </div>

      <div className="relative mb-6 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or login with email</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 font-medium transition-colors">
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Register here</Link>
      </p>
    </div>
  );
}
