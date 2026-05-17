import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, ArrowRight, Hexagon } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah.');
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', { token: credentialResponse.credential });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#030712] text-white selection:bg-indigo-500/30 font-sans fixed inset-0 z-50">
      
      {/* Left Side - Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-gray-950 border-r border-white/5">
        {/* Abstract Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        
        <div className="relative z-10 max-w-lg p-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 transform -rotate-6 hover:rotate-0 transition-all duration-500">
               <Hexagon size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            FDBA Invoice Digital Enterprise
          </h1>
          <p className="text-xl text-gray-400 font-medium leading-relaxed">
            The world's most powerful, beautifully designed financial infrastructure for modern businesses.
          </p>
        </div>
        
        {/* Fake Code Snippet Background Element */}
        <div className="absolute bottom-10 left-10 opacity-20 font-mono text-xs text-indigo-300">
           <p>const initialize = async () =&gt; &#123;</p>
           <p>&nbsp;&nbsp;await System.boot('FDBA Invoice Digital');</p>
           <p>&nbsp;&nbsp;return 'Success';</p>
           <p>&#125;;</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute top-0 right-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">Welcome back</h2>
            <p className="text-gray-400 font-medium">Please enter your details to sign in.</p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center text-emerald-400 text-sm font-medium">
               <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse flex-shrink-0"></div>
               {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center text-red-400 text-sm font-medium">
               <div className="w-2 h-2 rounded-full bg-red-500 mr-3 animate-pulse flex-shrink-0"></div>
               {error}
            </div>
          )}

          {/* Google Login with custom wrapper for styling */}
          <div className="mb-8 p-[1px] rounded-xl bg-gradient-to-r from-gray-800 to-gray-700 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-lg">
            <div className="bg-gray-900 rounded-xl flex justify-center py-2 px-4 overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="filled_black"
                shape="rectangular"
                width="100%"
              />
            </div>
          </div>

          <div className="flex items-center mb-8">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            <span className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Or continue with</span>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="admin@fdbainvoicedigital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-300">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-white/10 hover:bg-white/20 overflow-hidden transition-all duration-300 mt-8 backdrop-blur-sm"
            >
              {/* Animated Gradient Background for Button */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
              
              <span className="relative flex items-center">
                {isLoading ? 'Authenticating...' : 'Sign In'}
                {!isLoading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:text-indigo-400 hover:underline transition-colors font-bold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
