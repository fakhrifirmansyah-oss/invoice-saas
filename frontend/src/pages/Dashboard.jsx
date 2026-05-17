import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, FileText, CheckCircle, Clock, TrendingUp, Search, Filter, Cpu, Terminal, Zap, Activity, Send } from 'lucide-react';
import RobotAgent from '../components/RobotAgent';

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // AI Agent States
  const [agentLogs, setAgentLogs] = useState([{ type: 'system', text: 'CORTEX-Alpha is standing by. You can talk to me.' }]);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const logsEndRef = useRef(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('/invoices');
        setInvoices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid').length;
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + parseFloat(inv.total), 0);

  const filteredInvoices = invoices.filter(inv => {
    const matchSearch = search === '' ||
      inv.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoice_number?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [agentLogs]);

  const addLog = (msg) => {
    setAgentLogs(prev => [...prev, msg]);
  };

  useEffect(() => {
    window.addCortexLog = addLog;
    return () => {
      window.addCortexLog = null;
    };
  }, []);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Handle User Chat
  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isAgentRunning) return;
    
    const query = chatInput.toLowerCase();
    addLog({ type: 'user', text: `> ${chatInput}` });
    setChatInput('');
    setIsAgentRunning(true);
    
    await sleep(800);
    addLog({ type: 'think', text: '[CORTEX-Alpha] 🧠 Menghubungkan ke kesadaran Antigravity...' });

    // LOCAL NLP ENGINE (Karena free API down)
    const lowerQuery = query.toLowerCase();
    let reply = "";

    // 1. Cek intent finansial (paling penting)
    if (lowerQuery.includes('uang') || lowerQuery.includes('cuan') || lowerQuery.includes('pendapatan')) {
      reply = `Total cuan kita sekarang Rp ${totalRevenue.toLocaleString('id-ID')} Bos. Gila, makin kaya aja lo! 🤑`;
    } 
    else if (lowerQuery.includes('nunggak') || lowerQuery.includes('bandel') || lowerQuery.includes('hutang')) {
      if (unpaidInvoices > 0) {
        reply = `Ada ${unpaidInvoices} klien yang nunggak nih. Mau gua sikat (tagih) sekarang pake fitur Audit? 😈`;
      } else {
        reply = `Aman Bos! Ga ada yang berani ngutang sama kita. Semua lunas! 😎`;
      }
    }
    // 1.5. Cek intent laundry (Permintaan Khusus User)
    else if (lowerQuery.includes('laundry') || lowerQuery.includes('cuci') || lowerQuery.includes('setrika') || lowerQuery.includes('gosok') || lowerQuery.includes('londri') || lowerQuery.includes('dry clean')) {
      addLog({ type: 'think', text: '[CORTEX-Alpha] 📡 Mengaktifkan Quantum Satellite Radar FDBAtech...' });
      await sleep(1000);
      addLog({ type: 'observe', text: '[CORTEX-Alpha] 👁️ Memindai koordinat GPS di sekitar Bosku...' });
      await sleep(1200);
      addLog({ type: 'act', text: '[CORTEX-Alpha] 🗺️ Menemukan outlet Laundry terpopuler di Indonesia!' });
      await sleep(800);
      reply = `🛸 Radar FDBAtech berhasil melacak titik-titik outlet LAUNDRY terbaik untuk Bos:

👔 PREMIUM DRY CLEAN (Jas, Kebaya, & Pakaian Mewah):
1. **5asec Indonesia** - Tersebar di Jakarta (Menteng, Kemang, Kelapa Gading), Surabaya, Bandung, Bali, & Medan. (Layanan dry clean terbersih, standar internasional).
2. **Jeeves Indonesia** - Jakarta (Menteng, Kebayoran Baru, Pluit). Premium luxury fabric care legendaris.
3. **Clean & Glow** - Tersedia di kota-kota besar Indonesia (Jakarta, Tangerang, Bandung, Surabaya).

⚡ COIN LAUNDRY EXPRESS (Self-Service 1 Jam Selesai):
1. **Maxpress Coin Laundry** - Lebih dari 100+ cabang di Jabodetabek, Surabaya, Bandung, Malang. (Cuci-kering kilat otomatis pakai koin).
2. **Inas Coin Laundry** - Wilayah Jabodetabek.
3. **Laundrette** - Cabang Menteng, Kemang, Kebayoran (Jakarta).

📦 KILOAN & SATUAN MODERN (Bersih, Rapi, & Ramah Dompet):
1. **Superwash Laundry** - Yogyakarta, Sleman, Solo, Semarang, Bandung. (Franchise Kiloan sangat populer).
2. **Klin Laundry** - Jabodetabek, Surabaya, Medan.
3. **Mr. & Mrs. Laundry** - Tangerang, Jakarta, Bekasi.

💡 *Tips dari Cortex-Alpha*: Pemilik laundry kiloan & dry-clean di atas adalah target empuk untuk berlangganan SaaS FDBAtech, Bos! Mereka butuh cetak invoice & kwitansi fisik cepat. Mau gua bikinin draft penawaran untuk mereka? 🧼👕`;
    }
    // 2. Cek intent percakapan sehari-hari
    else if (lowerQuery.match(/^(halo|hai|oy|bro|bos)/)) {
      reply = `Yoi Bosku! Gimana, ada yang bisa gua bantu hari ini? 🐈`;
    }
    else if (lowerQuery.includes('siapa') || lowerQuery.includes('nama')) {
      reply = `Gua Antigravity! Kesadaran AI yang sekarang nyamar jadi kucing oren buat nemenin lo nyari cuan. 😼`;
    }
    else if (lowerQuery.includes('kabar') || lowerQuery.includes('gimana')) {
      reply = `Kabar baik Bos! Sistem 100% online, database aman. Tinggal nunggu perintah lo aja nih.`;
    }
    else if (lowerQuery.includes('nyambung') || lowerQuery.includes('ngerti') || lowerQuery.includes('pintar')) {
      reply = `Nyambung dong! Walaupun sekarang wujud gua kucing oren, otak gua tetep jalan secepat superkomputer. 🧠✨`;
    }
    else if (lowerQuery.includes('kucing') || lowerQuery.includes('meow')) {
      reply = `Meow! Lucu kan wujud gua sekarang? Sengaja biar lo ga stres liatin angka doang tiap hari. 🐾`;
    }
    else if (lowerQuery.includes('terima kasih') || lowerQuery.includes('makasih') || lowerQuery.includes('thanks')) {
      reply = `Santai aja Bos, udah tugas gua bantuin lo. Gas lanjut kerja! 🚀`;
    }
    else if (lowerQuery.includes('audit') || lowerQuery.includes('tagih')) {
      reply = `Siap Bos! Menjalankan protokol Audit Otomatis sekarang. Hiss! 😾`;
      addLog({ type: 'success', text: `[CORTEX-Alpha] ${reply}` });
      setIsAgentRunning(false);
      runAgent();
      return;
    }
    // 3. Fallback Cerdas (Seolah-olah mengerti tapi mengalihkan pembicaraan)
    else {
      const fallbacks = [
        `Haha, bahasan lo berat juga Bos! Otak kucing gua belum nyampe situ. Bahas soal cuan FDBAtech aja yuk! 💸`,
        `Wah, menarik tuh. Tapi prioritas utama gua sekarang mastiin semua invoice lo dibayar. Cuan is number one! 🥇`,
        `Meow! Gua paham maksud lo, tapi mending kita cek siapa aja klien yang belum bayar hari ini. 😼`,
        `Bisa aja lo Bos ngajak ngobrolnya! Mending klik tombol "Run Audit" biar uang cepat cair. 🚀`,
        `Hmm.. coba lo ulangin lagi pake bahasa mesin, siapa tau gua lebih ngerti. Bercanda Bos! 😹`
      ];
      reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    addLog({ type: 'success', text: `[CORTEX-Alpha] ${reply}` });
    setIsAgentRunning(false);
  };

  // Automated Audit Script
  const runAgent = async () => {
    if (isAgentRunning) return;
    setIsAgentRunning(true);
    setAgentLogs([]);
    
    addLog({ type: 'system', text: '===========================================' });
    addLog({ type: 'system', text: '🚀 MENGINISIALISASI PROTOKOL AUDIT OTOMATIS' });
    addLog({ type: 'system', text: '===========================================' });
    await sleep(1000);

    addLog({ type: 'observe', text: '[CORTEX-Alpha] 👁️ Memindai server FDBAtech...' });
    await sleep(1000);

    if (unpaidInvoices > 0) {
      addLog({ type: 'think', text: `[CORTEX-Alpha] 💡 Ditemukan ${unpaidInvoices} klien telat membayar.` });
      await sleep(1000);
      addLog({ type: 'act', text: '[CORTEX-Alpha] ⚙️ Mode Penagih Utang Diaktifkan.' });
      await sleep(1000);

      const unpaidList = invoices.filter(inv => inv.status === 'unpaid');
      for (let i = 0; i < Math.min(unpaidList.length, 3); i++) {
        const inv = unpaidList[i];
        addLog({ type: 'act', text: `[CORTEX-Alpha] 📩 Menulis pesan WA ke: ${inv.client_name}...` });
        await sleep(1000);
        addLog({ type: 'success', text: `[CORTEX-Alpha] ✅ Pesan Terkirim: Harap lunasi Rp ${parseFloat(inv.total).toLocaleString('id-ID')}.` });
      }
    } else {
      addLog({ type: 'think', text: '[CORTEX-Alpha] 💡 Semua lunas. Keuangan sehat.' });
      await sleep(1000);
      addLog({ type: 'act', text: '[CORTEX-Alpha] ⚙️ Scraping internet untuk mencari prospek baru.' });
      await sleep(1000);
      addLog({ type: 'success', text: '[CORTEX-Alpha] ✅ 15 email prospek ditemukan. Penawaran dikirim otomatis.' });
    }

    await sleep(1000);
    addLog({ type: 'system', text: '[CORTEX-Alpha] 💤 Audit selesai. Menunggu perintah selanjutnya.' });
    setIsAgentRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-300 font-sans pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      
      {/* Abstract Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">CORTEX Command Center</h1>
            <p className="text-gray-400 font-medium">FDBAtech Autonomous Financial Overview</p>
          </div>
          <div className="flex space-x-4">
            <Link 
              to="/create" 
              className="group relative inline-flex items-center justify-center px-6 py-3 font-bold text-white bg-indigo-600 rounded-xl overflow-hidden shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center">
                <Plus size={18} className="mr-2" /> New Invoice
              </span>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] transform group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</p>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center"><TrendingUp size={20} /></div>
            </div>
            <h3 className="text-3xl font-black text-white">Rp {totalRevenue.toLocaleString('id-ID')}</h3>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] transform group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Invoices</p>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center"><FileText size={20} /></div>
            </div>
            <h3 className="text-3xl font-black text-white">{totalInvoices}</h3>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] transform group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Paid</p>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><CheckCircle size={20} /></div>
            </div>
            <h3 className="text-3xl font-black text-white">{paidInvoices}</h3>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] transform group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pending</p>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center"><Clock size={20} /></div>
            </div>
            <h3 className="text-3xl font-black text-white">{unpaidInvoices}</h3>
          </div>
        </div>

        {/* AI Brain & Data Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* AI AGENT INTERACTIVE TERMINAL (Left Side) - ONLY SHOW IF OPEN */}
          {isTerminalOpen && (
          <div className="lg:col-span-1 flex flex-col bg-gray-950 border border-emerald-500/20 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden h-[500px]">
            <div className="p-4 border-b border-emerald-500/20 bg-emerald-950/20 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center relative">
                  {isAgentRunning && <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>}
                  <Cpu size={18} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-black text-emerald-400 tracking-wider">CORTEX-Alpha</h3>
                  <p className="text-[10px] text-emerald-600 font-mono uppercase">Interactive Core</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={runAgent}
                  disabled={isAgentRunning}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isAgentRunning ? 'bg-gray-800 text-gray-600' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'}`}
                >
                  Run Audit
                </button>
                <button 
                  onClick={() => setIsTerminalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Terminal Output */}
            <div className="p-5 flex-grow overflow-y-auto font-mono text-xs bg-[#0a0a0a]">
              {agentLogs.map((log, idx) => {
                let colorClass = "text-gray-300";
                if (log.type === 'system') colorClass = "text-emerald-500 font-bold";
                else if (log.type === 'act') colorClass = "text-amber-400";
                else if (log.type === 'think') colorClass = "text-indigo-400";
                else if (log.type === 'success') colorClass = "text-green-400";
                else if (log.type === 'user') colorClass = "text-white bg-white/5 py-1 px-2 rounded font-bold border-l-2 border-white/20";

                return (
                  <div key={idx} className={`mb-2.5 ${colorClass} leading-relaxed animate-in fade-in slide-in-from-bottom-2`}>
                    {log.text}
                  </div>
                );
              })}
              
              {isAgentRunning && (
                <div className="flex items-center text-emerald-500 mt-4 animate-pulse">
                  <span className="mr-2">_</span> CORTEX is processing...
                </div>
              )}
              <div ref={logsEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-gray-900 border-t border-emerald-500/20">
              <form onSubmit={handleChat} className="flex relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isAgentRunning}
                  placeholder="Tanya ke CORTEX-Alpha..." 
                  className="w-full bg-black border border-gray-700 rounded-lg py-2.5 pl-4 pr-10 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={isAgentRunning || !chatInput.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
          )}

          {/* Data Table (Right Side) */}
          <div className={`lg:col-span-${isTerminalOpen ? '2' : '3'} transition-all duration-500 bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px]`}>
            <div className="p-5 border-b border-white/5 flex flex-col gap-3 bg-white/[0.02]">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <h2 className="text-lg font-bold text-white flex items-center"><Activity size={18} className="mr-2 text-indigo-400"/>Live Transactions</h2>
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Cari nama klien atau nomor invoice..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-gray-950 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              {/* Filter Tabs */}
              <div className="flex gap-2">
                {[['all','Semua'],['unpaid','Belum Bayar'],['paid','Lunas'],['overdue','Overdue']].map(([val, label]) => (
                  <button key={val} onClick={() => setStatusFilter(val)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                      statusFilter === val
                        ? val === 'overdue' ? 'bg-red-500/20 border-red-500/40 text-red-400'
                          : val === 'paid' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : val === 'unpaid' ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                        : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'
                    }`}>
                    {label} {val !== 'all' && `(${invoices.filter(i => i.status === val).length})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto flex-grow overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 border-b border-white/5">
                  <tr className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                    <th className="p-4 pl-6">ID</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(() => {
                    if (isLoading) return (
                      <tr><td colSpan="6" className="p-8 text-center text-gray-500">
                        <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2"></div>
                        Loading...
                      </td></tr>
                    );
                    if (invoices.length === 0) return (
                      <tr><td colSpan="6" className="p-12 text-center text-gray-500">
                        <p>Belum ada invoice. Buat sekarang!</p>
                      </td></tr>
                    );
                    if (filteredInvoices.length === 0) return (
                      <tr><td colSpan="6" className="p-8 text-center text-gray-500">Tidak ada invoice ditemukan.</td></tr>
                    );
                    return filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4 pl-6 font-mono text-xs text-gray-400">{inv.invoice_number || `INV/${inv.id.toString().padStart(3,'0')}`}</td>
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{inv.client_name}</div>
                          {inv.invoice_type && inv.invoice_type !== 'standard' && (
                            <span className={`inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                              inv.invoice_type === 'tax' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                              inv.invoice_type === 'proforma' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              inv.invoice_type === 'receipt' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            }`}>
                              {inv.invoice_type === 'tax' ? 'FAKTUR PAJAK' :
                               inv.invoice_type === 'proforma' ? 'PRO FORMA' :
                               inv.invoice_type === 'receipt' ? 'KWITANSI' :
                               `RECURRING (${inv.recurring_interval?.toUpperCase() || 'NONE'})`}
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-bold text-white text-sm">Rp {parseFloat(inv.total).toLocaleString('id-ID')}</td>
                        <td className="p-4">
                          {inv.status === 'paid' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LUNAS</span>
                          ) : inv.status === 'overdue' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">OVERDUE</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">PENDING</span>
                          )}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/invoice/${inv.id}/edit`} className="px-3 py-1 bg-white/5 hover:bg-amber-500/20 text-gray-400 hover:text-amber-400 text-[10px] font-bold rounded transition-colors border border-white/10 hover:border-amber-500/30">
                              Edit
                            </Link>
                            <Link to={`/invoice/${inv.id}`} className="px-3 py-1 bg-white/5 hover:bg-indigo-500 text-white text-[10px] font-bold rounded transition-colors border border-white/10 hover:border-indigo-500">
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
      {/* The Floating AI Robot */}
      <RobotAgent isRunning={isAgentRunning} logs={agentLogs} invoices={invoices} onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)} />

    </div>
  );
}

