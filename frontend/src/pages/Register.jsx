import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import { User, Mail, Lock, ArrowRight, Hexagon, ShieldCheck } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/auth/register', { name, email, password });
      // Langsung redirect ke login dengan pesan sukses
      navigate('/login', { 
        state: { 
          successMessage: `✅ Akun berhasil dibuat! Silakan login dengan email ${email}.` 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
    } finally {
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
    <div className="min-h-screen flex bg-[#030712] text-white selection:bg-emerald-500/30 font-sans fixed inset-0 z-50">
      
      {/* Left Side - Visual/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-gray-950 border-r border-white/5">
        {/* Abstract Glowing Orbs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        
        <div className="relative z-10 max-w-lg p-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 transform rotate-6 hover:rotate-0 transition-all duration-500">
               <ShieldCheck size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Join the Elite
          </h1>
          <p className="text-xl text-gray-400 font-medium leading-relaxed">
            Create your FDBA Invoice Digital account and start billing your clients like a Fortune 500 company today.
          </p>
          
          <div className="mt-12 flex items-center justify-center space-x-4 text-sm text-gray-500 font-medium">
            <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div> No credit card required</div>
            <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div> Cancel anytime</div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-md relative z-10">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">Create Account</h2>
            <p className="text-gray-400 font-medium">Let's get you set up with FDBA Invoice Digital.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center text-red-400 text-sm font-medium">
               <div className="w-2 h-2 rounded-full bg-red-500 mr-3 animate-pulse"></div>
               {error}
            </div>
          )}

          {message ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
              <p className="text-emerald-400 mb-6">{message}</p>
              <Link to="/login" className="inline-block px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold transition-colors">
                Proceed to Login
              </Link>
            </div>
          ) : (
            <>
              {/* Google Register */}
              <div className="mb-8 p-[1px] rounded-xl bg-gradient-to-r from-gray-800 to-gray-700 hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-lg">
                <div className="bg-gray-900 rounded-xl flex justify-center py-2 px-4 overflow-hidden">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google Registration Failed')}
                    theme="filled_black"
                    shape="rectangular"
                    width="100%"
                    text="signup_with"
                  />
                </div>
              </div>

              <div className="flex items-center mb-8">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                <span className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Or register with email</span>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      placeholder="admin@fdbainvoicedigital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative flex items-center">
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                    {!isLoading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                  </span>
                </button>
              </form>
            </>
          )}

          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-emerald-400 hover:underline transition-colors font-bold">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
