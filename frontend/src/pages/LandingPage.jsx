import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Palette, CheckCircle, Cpu, Smartphone, ShieldCheck, Star, ArrowRight, Activity, MapPin } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-[#030712] text-gray-300 font-sans min-h-screen overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Abstract Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Modern Navigation Header */}
      <header className="relative z-50 border-b border-white/5 bg-gray-950/60 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              F
            </div>
            <span className="font-black text-white text-lg tracking-tight group-hover:text-indigo-400 transition-colors">
              FDBA <span className="text-indigo-400 font-medium">Invoice Digital</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors py-2 px-4">
              Login
            </Link>
            <Link to="/register" className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all hover:scale-105 shadow-md">
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6 text-center md:text-left max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Hero Left Content */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-md shadow-indigo-950/20">
            <Star size={12} className="animate-spin text-indigo-300" /> Google Play & App Store Ready
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight">
            Kirim Tagihan.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              Dapatkan Cuan Kilat.
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed">
            Buat kwitansi, invoice pajak, & bea materai digital profesional dalam 10 detik. Dilengkapi sistem kurir, ojek online SaaS terpadu, dan monitoring AI CORTEX-Alpha yang super cekatan!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link to="/register" className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white bg-indigo-600 rounded-2xl overflow-hidden shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-2">
                Mulai Uji Coba Gratis <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to="/login" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black px-8 py-4 rounded-2xl transition-all hover:border-white/20 active:scale-95 text-center">
              Dashboard Demo
            </Link>
          </div>

          {/* Badges Section */}
          <div className="pt-6 space-y-3">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Unduh Aplikasi Mobile FDBA di Handphone Anda</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {/* Google Play Store Badge */}
              <a 
                href="#download" 
                onClick={(e) => { e.preventDefault(); alert('Aplikasi FDBA Invoice Digital siap diunduh! Silakan hubungi Tim Mobile 25th untuk merilis file AAB Anda ke Play Store Console.'); }}
                className="flex items-center gap-3 bg-black border border-white/10 hover:border-emerald-500/50 text-white rounded-xl px-5 py-2.5 transition-all hover:scale-105 shadow-lg shadow-black/40 group cursor-pointer"
              >
                <svg className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.25 3H18.75A2.25 2.25 0 0 1 21 5.25V18.75A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25A2.25 2.25 0 0 1 5.25 3M17.41 10.87L7.62 5.17C7.38 5.03 7.07 5.09 6.93 5.33C6.88 5.41 6.86 5.51 6.86 5.61V18.39C6.86 18.66 7.08 18.88 7.35 18.88C7.45 18.88 7.55 18.86 7.63 18.81L17.41 13.13C17.65 12.99 17.73 12.68 17.59 12.44C17.55 12.36 17.49 12.3 17.41 12.26L14.73 10.87L17.41 10.87Z" />
                </svg>
                <div className="text-left">
                  <p className="text-[8px] uppercase tracking-widest text-gray-500 font-bold leading-tight">GET IT ON</p>
                  <p className="text-[11px] font-black text-white leading-tight">Google Play</p>
                </div>
              </a>

              {/* Apple App Store Badge */}
              <a 
                href="#download"
                onClick={(e) => { e.preventDefault(); alert('Aplikasi FDBA Invoice Digital siap diunduh! Silakan hubungi Tim Mobile 25th untuk merilis file IPA Anda ke Apple App Store.'); }}
                className="flex items-center gap-3 bg-black border border-white/10 hover:border-indigo-500/50 text-white rounded-xl px-5 py-2.5 transition-all hover:scale-105 shadow-lg shadow-black/40 group cursor-pointer"
              >
                <svg className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
                </svg>
                <div className="text-left">
                  <p className="text-[8px] uppercase tracking-widest text-gray-500 font-bold leading-tight">Download on the</p>
                  <p className="text-[11px] font-black text-white leading-tight">App Store</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Hero Right Content - Interactive Mobile Phone Simulator Mockup */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-72 h-[560px] bg-black rounded-[40px] border-4 border-gray-800 p-3 shadow-2xl shadow-indigo-500/10 flex flex-col justify-between overflow-hidden group hover:border-indigo-500/40 transition-colors">
            
            {/* Phone Top Camera / Speaker Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-black rounded-full z-50 flex items-center justify-center gap-1.5 px-2">
              <div className="w-2 h-2 rounded-full bg-gray-850"></div>
              <div className="w-10 h-1 bg-gray-850 rounded-full"></div>
            </div>

            {/* Mobile App Screen Content */}
            <div className="flex-grow bg-[#050b18] rounded-[32px] overflow-hidden flex flex-col p-4 pt-6 space-y-4 text-left select-none relative">
              
              {/* App Status Header */}
              <div className="flex justify-between items-center text-[8px] font-bold text-indigo-400">
                <span className="flex items-center gap-1"><Activity size={8} className="animate-pulse" /> Live Telemetry</span>
                <span>FDBA v1.0</span>
              </div>

              {/* Holographic Card */}
              <div className="bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/20 rounded-2xl p-3.5 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl"></div>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Total Cuan Bulan Ini</p>
                <h4 className="text-lg font-black text-white mt-1">Rp 120.450.000</h4>
                <div className="mt-3 flex justify-between items-center text-[7px] text-gray-400">
                  <span>145 Kwitansi Sukses</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-black border border-emerald-500/30 uppercase">LUNAS</span>
                </div>
              </div>

              {/* Mobile Ojek Tracker Simulation */}
              <div className="bg-gray-900/50 border border-white/5 rounded-2xl p-3 space-y-2">
                <div className="flex justify-between items-center text-[8px] font-black">
                  <span className="text-green-400 uppercase">🛵 Go-FDBA LOGISTICS</span>
                  <span className="text-gray-500 font-mono">1.2 km lagi</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-white">
                  <MapPin size={10} className="text-green-400" />
                  <p className="font-bold truncate">Driver: Bimo Kurir Concorde</p>
                </div>
                {/* Route graphic */}
                <div className="bg-black/40 h-8 rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">
                  <div className="w-full h-0.5 bg-dashed border-t border-white/10 absolute"></div>
                  <div className="absolute left-4 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <div className="absolute left-1/2 w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40 animate-bounce">
                    🛵
                  </div>
                </div>
              </div>

              {/* Protection Alert */}
              <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-2.5 flex items-center gap-2 text-[7px] text-cyan-400 font-bold">
                <ShieldCheck size={12} className="text-cyan-400 shrink-0" />
                <span>FDBA AI Protection Active — PDF & Biometrik terenkripsi di Google Play Store & Apple App Store.</span>
              </div>

              {/* Bottom Actions Mockup */}
              <div className="flex-grow flex items-end justify-center pb-2">
                <div className="w-20 h-1 bg-white/20 rounded-full"></div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-gray-950/40 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Kelebihan Ekosistem FDBA Mobile</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">
              Kami merancang sistem FDBA dengan dedikasi riset 25 tahun pengalaman di bidang SaaS keuangan, cetak kwitansi fisik, dan integrasi kurir ojek instan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900/30 p-8 rounded-3xl border border-white/5 hover:border-indigo-500/20 transition-all hover:scale-[1.01] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-105 transition-transform">
                  <Palette size={24} />
                </div>
                <h3 className="text-lg font-black text-white mb-3">100+ Tema Cantik AI</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Dari gaya klasik corporate hingga modern dark-neon cyberpunk. Tampilkan identitas bisnis Anda dengan kemewahan visual yang tiada duanya.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900/30 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all hover:scale-[1.01] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-105 transition-transform">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg font-black text-white mb-3">Sangat Cekatan & Efisien</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Semua kompilasi ditangani oleh Tim Mobile 25th Senior Core Dev kami menggunakan optimasi NDK C++ dan Trusted Web Activity untuk hemat memori.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900/30 p-8 rounded-3xl border border-white/5 hover:border-cyan-500/20 transition-all hover:scale-[1.01] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-105 transition-transform">
                  <Cpu size={24} />
                </div>
                <h3 className="text-lg font-black text-white mb-3">Proteksi AI Satelit</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Dokumen kwitansi terlindung dari AI Scraping dan dienkripsi secara penuh sebelum diterbitkan ke Google Play Store & App Store.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tim Mobile Showcase Section */}
      <section className="relative z-10 py-24 border-t border-white/5 bg-gray-950/20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">Didukung Tim Mobile Core Dev Senior</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm mb-16">
            Di balik FDBA Invoice Digital SuperApp, terdapat tim ahli pemrograman mobile dengan total riset **25 Tahun Pengalaman** yang sangat cekatan, gesit, dan berdedikasi tinggi!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Arya "The Kernel" Wijaya',
                role: 'Principal Mobile Architect',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                exp: '25 Tahun Pengalaman Core Dev'
              },
              {
                name: 'Jessica "ByteQueen" Tan',
                role: 'Senior Android Systems Lead',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
                exp: '22 Tahun Pengalaman NDK Optimization'
              },
              {
                name: 'Dr. Marcus Vance',
                role: 'Autonomous Security Architect',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
                exp: '25 Tahun Pengalaman Web-Activity Security'
              }
            ].map((dev, idx) => (
              <div key={idx} className="bg-gray-900/20 border border-white/5 rounded-3xl p-6 flex flex-col items-center">
                <img 
                  src={dev.avatar} 
                  alt={dev.name} 
                  className="w-16 h-16 rounded-full object-cover border border-white/10 shadow-lg mb-4 hover:border-indigo-400 transition-colors"
                />
                <h4 className="text-sm font-black text-white">{dev.name}</h4>
                <p className="text-[10px] text-indigo-400 font-bold uppercase mt-1">{dev.role}</p>
                <span className="text-[9px] bg-white/5 border border-white/5 text-gray-500 px-3 py-1 rounded-full mt-3 font-mono">{dev.exp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Store Download CTA Section */}
      <section className="relative z-10 py-24 text-center border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Siap Luncurkan Bisnis Anda ke Angkasa?</h2>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400 font-bold">
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-indigo-400" /> Google Play Store Ready</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-indigo-400" /> Apple App Store Ready</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-indigo-400" /> Didukung Tim Mobile 25th</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {/* Google Play Store Badge */}
            <a 
              href="#download" 
              onClick={(e) => { e.preventDefault(); alert('Aplikasi FDBA Invoice Digital siap diunduh! Silakan hubungi Tim Mobile 25th untuk merilis file AAB Anda ke Play Store Console.'); }}
              className="flex items-center gap-3 bg-black border border-white/10 hover:border-emerald-500/50 text-white rounded-2xl px-6 py-3 transition-all hover:scale-105 shadow-xl shadow-black/40 group cursor-pointer"
            >
              <svg className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.25 3H18.75A2.25 2.25 0 0 1 21 5.25V18.75A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25A2.25 2.25 0 0 1 5.25 3M17.41 10.87L7.62 5.17C7.38 5.03 7.07 5.09 6.93 5.33C6.88 5.41 6.86 5.51 6.86 5.61V18.39C6.86 18.66 7.08 18.88 7.35 18.88C7.45 18.88 7.55 18.86 7.63 18.81L17.41 13.13C17.65 12.99 17.73 12.68 17.59 12.44C17.55 12.36 17.49 12.3 17.41 12.26L14.73 10.87L17.41 10.87Z" />
              </svg>
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold leading-tight">GET IT ON</p>
                <p className="text-xs font-black text-white leading-tight">Google Play</p>
              </div>
            </a>

            {/* Apple App Store Badge */}
            <a 
              href="#download"
              onClick={(e) => { e.preventDefault(); alert('Aplikasi FDBA Invoice Digital siap diunduh! Silakan hubungi Tim Mobile 25th untuk merilis file IPA Anda ke Apple App Store.'); }}
              className="flex items-center gap-3 bg-black border border-white/10 hover:border-indigo-500/50 text-white rounded-2xl px-6 py-3 transition-all hover:scale-105 shadow-xl shadow-black/40 group cursor-pointer"
            >
              <svg className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
              </svg>
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold leading-tight">Download on the</p>
                <p className="text-xs font-black text-white leading-tight">App Store</p>
              </div>
            </a>
          </div>

          <div className="pt-8">
            <Link to="/register" className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black px-12 py-5 rounded-2xl hover:from-indigo-600 hover:to-purple-750 transition-colors shadow-lg shadow-indigo-950/40">
              Daftar Sekarang - Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Sleek Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 bg-black/40 text-center text-xs text-gray-600">
        <p>© 2026 FDBA Invoice Digital SuperApp. All Rights Reserved. Built with 25th Core Mobile Dev Team.</p>
      </footer>

    </div>
  );
}
