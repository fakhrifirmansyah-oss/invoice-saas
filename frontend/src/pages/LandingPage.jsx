import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Palette, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-block bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-6 border border-indigo-100">
            Welcome to FDBA Invoice Digital 1.0
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
            Stop Chasing Payments.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Start Getting Paid.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create professional, stunning invoices in under 10 seconds. FDBA Invoice Digital gives you 100+ beautiful templates to make your business look like a million bucks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-indigo-200 transition-all hover:-translate-y-1">
              Start Free Trial
            </Link>
            <Link to="/login" className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-xl text-lg font-bold hover:border-gray-300 hover:bg-gray-50 transition-all">
              Login to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Why Top Freelancers Choose Us</h2>
            <p className="text-gray-600">We built FDBA Invoice Digital with 25 years of marketing experience in mind.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <Palette size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100+ Dynamic Themes</h3>
              <p className="text-gray-600">From classic corporate to modern cyberpunk. Choose a design that perfectly matches your brand identity.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">No more messing with Excel formulas. Generate a PDF and email it to your client with just two clicks.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-6">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Output</h3>
              <p className="text-gray-600">Impress clients with structured data, auto-calculated taxes, and secure payment instructions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / CTA */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-8">Ready to upgrade your invoicing?</h2>
          <div className="flex justify-center gap-6 mb-10 text-gray-600 font-medium">
            <span className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2"/> No credit card required</span>
            <span className="flex items-center"><CheckCircle size={18} className="text-green-500 mr-2"/> Cancel anytime</span>
          </div>
          <Link to="/register" className="inline-block bg-gray-900 text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-gray-800 transition-colors">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
