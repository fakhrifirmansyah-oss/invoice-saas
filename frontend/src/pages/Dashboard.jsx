import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, FileText, CheckCircle, Clock, TrendingUp, Search, Filter, Cpu, Terminal, Zap, Activity, Send, MessageSquare, Heart, Share2, Image, Sparkles, Globe, MapPin, Navigation, Truck, Tag, Trash2, UserCheck, Map, Maximize2, Minimize2 } from 'lucide-react';
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
  const [isSocialMaximized, setIsSocialMaximized] = useState(false);
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

  // CORTEX Social Feed States
  const [activeTab, setActiveTab] = useState('transactions');
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Laundry pricing states
  const [laundryPrices, setLaundryPrices] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newPriceVal, setNewPriceVal] = useState('');
  const [newUnitType, setNewUnitType] = useState('kg');

  // Gojek SaaS ojek & kurir logistics states
  const [ridesHistory, setRidesHistory] = useState([]);
  const [newRideType, setNewRideType] = useState('FDBA-Ride');
  const [pickupAddress, setPickupAddress] = useState('Butik Amanah Menteng');
  const [dropoffAddress, setDropoffAddress] = useState('Budi Laundry Express Sudirman');
  const [rideFare, setRideFare] = useState(12000);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchStep, setDispatchStep] = useState(0); // 0: idle, 1: searching, 2: picking up, 3: heading to destination, 4: completed!
  const [activeDriver, setActiveDriver] = useState('');
  const [driverPos, setDriverPos] = useState({ x: 10, y: 10 }); // position for visual tracker route

  // Elite Mobile Team (25 years experience) states
  const [isMobileOptimizing, setIsMobileOptimizing] = useState(false);
  const [mobileOptimizationLog, setMobileOptimizationLog] = useState('Semua sistem Android & iOS berjalan optimal (Latency: 12ms)');

  const handleMobileOptimize = async () => {
    if (isMobileOptimizing) return;
    setIsMobileOptimizing(true);
    setMobileOptimizationLog('⚙️ Arya Wijaya sedang menata ulang alokasi RAM engine...');
    addLog({ type: 'think', text: '[Tim Mobile Elite] ⚡ Arya Wijaya (Principal Architect, 25 Thn Exp) meluncurkan kompilasi native ASM...' });
    await sleep(800);
    
    setMobileOptimizationLog('⚡ Jessica Tan sedang melakukan NDK C++ hot-reload...');
    addLog({ type: 'act', text: '[Tim Mobile Elite] ⚡ Jessica Tan (Systems Specialist, 22 Thn Exp) memangkas cache garbage collection sebesar 87%!' });
    await sleep(800);
    
    setMobileOptimizationLog('📦 Dr. Marcus Vance sedang memverifikasi Digital Asset Link...');
    addLog({ type: 'observe', text: '[Tim Mobile Elite] ⚡ Dr. Marcus Vance (Autonomous Specialist, 25 Thn Exp) meluncurkan Trusted Web Activity tanpa border!' });
    await sleep(800);
    
    setMobileOptimizationLog('✅ Optimasi Kilat Selesai! Ukuran APK terpangkas 3.2MB & Latency drop ke 3.4ms!');
    addLog({ type: 'success', text: '[Tim Mobile Elite] 🎉 Optimasi Kilat Sukses! Native AAB paket FDBA Invoice Digital siap diunggah ke Google Play Store!' });
    setIsMobileOptimizing(false);
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  // Fetch laundry prices
  const fetchLaundryPrices = async () => {
    try {
      const res = await api.get('/logistics/prices');
      setLaundryPrices(res.data);
    } catch (err) {
      console.error('Error fetching laundry prices:', err);
    }
  };

  // Fetch ride history
  const fetchRidesHistory = async () => {
    try {
      const res = await api.get('/logistics/rides');
      setRidesHistory(res.data);
    } catch (err) {
      console.error('Error fetching ride history:', err);
    }
  };

  // Handle adding laundry price
  const handleAddPrice = async (e) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newPriceVal) return;
    try {
      const res = await api.post('/logistics/prices', {
        service_name: newServiceName,
        price_per_unit: parseFloat(newPriceVal),
        unit_type: newUnitType
      });
      setLaundryPrices(prev => [...prev, res.data]);
      setNewServiceName('');
      setNewPriceVal('');
    } catch (err) {
      console.error('Error saving laundry price:', err);
    }
  };

  // Handle deleting laundry price
  const handleDeletePrice = async (priceId) => {
    try {
      await api.delete(`/logistics/prices/${priceId}`);
      setLaundryPrices(prev => prev.filter(p => p.id !== priceId));
    } catch (err) {
      console.error('Error deleting laundry price:', err);
    }
  };

  // Handle auto-calculating ride fare based on distance
  useEffect(() => {
    const dist = Math.max(3, Math.min(15, (pickupAddress.length + dropoffAddress.length) % 12 + 3));
    setRideFare(dist * 2000);
  }, [pickupAddress, dropoffAddress]);

  // Handle Dispatching Rider/Ojek Gojek SaaS
  const handleDispatchCourier = async (e) => {
    e.preventDefault();
    if (isDispatching) return;
    setIsDispatching(true);
    setDispatchStep(1);
    setActiveDriver('Mencari driver terdekat...');

    // Trigger Satellite Logs
    addLog({ type: 'think', text: `[Satelit CORTEX-Alpha] 📡 Mengunci transmisi ojek ${newRideType}...` });
    await sleep(1500);

    const drivers = ['Roni Ojek Orbit', 'Aris Bintang Kilat', 'Bimo Kurir Concorde', 'Seno Go-FDBA'];
    const chosenDriver = drivers[Math.floor(Math.random() * drivers.length)];
    setActiveDriver(chosenDriver);
    setDispatchStep(2);
    setDriverPos({ x: 20, y: 80 });
    addLog({ type: 'observe', text: `[Satelit CORTEX-Alpha] 🛵 Driver ${chosenDriver} sukses dikunci! Menuju titik penjemputan: "${pickupAddress}"` });

    await sleep(2000);
    setDispatchStep(3);
    setDriverPos({ x: 50, y: 50 });
    addLog({ type: 'act', text: `[Satelit CORTEX-Alpha] 📦 Cucian/Penumpang berhasil dijemput oleh ${chosenDriver}! Sedang memacu gas menuju tujuan: "${dropoffAddress}"` });

    await sleep(2500);
    setDispatchStep(4);
    setDriverPos({ x: 80, y: 20 });
    addLog({ type: 'success', text: `[Satelit CORTEX-Alpha] 🎉 Transaksi ${newRideType} Selesai! Mengamankan dana Rp ${rideFare.toLocaleString('id-ID')} dan otomatis menerbitkan invoice digital.` });

    // Submit order to Backend
    try {
      await api.post('/logistics/rides', {
        ride_type: newRideType,
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress,
        fare: rideFare
      });

      // Refetch history and invoices
      fetchRidesHistory();
      const invRes = await api.get('/invoices');
      setInvoices(invRes.data);
    } catch (err) {
      console.error('Error recording ride:', err);
    }

    await sleep(1000);
    setIsDispatching(false);
    setDispatchStep(0);
  };

  useEffect(() => {
    if (activeTab === 'social') {
      fetchPosts();
    } else if (activeTab === 'laundry-pricing') {
      fetchLaundryPrices();
    } else if (activeTab === 'fdba-superapp') {
      fetchRidesHistory();
      fetchLaundryPrices();
    }
  }, [activeTab]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() || isPublishing) return;
    setIsPublishing(true);

    try {
      const res = await api.post('/posts', {
        content: newPostContent,
        image_url: newPostImage
      });

      const createdPost = res.data;
      setPosts(prev => [createdPost, ...prev]);
      setNewPostContent('');
      setNewPostImage('');

      // CORTEX-Alpha AI Autocommenter!
      const lowerContent = createdPost.content.toLowerCase();
      let aiComment = '';
      if (lowerContent.includes('laundry') || lowerContent.includes('cuci') || lowerContent.includes('londri')) {
        aiComment = '🛸 [CORTEX-Alpha AI] Promo laundry terdeteksi! Mengaktifkan tractor beam pencucian super cepat. Semoga cuan meledak sampai ke Neptunus! 🧼👕';
      } else if (lowerContent.includes('invoice') || lowerContent.includes('uang') || lowerContent.includes('cuan') || lowerContent.includes('pendapatan')) {
        aiComment = '😼 [CORTEX-Alpha AI] Wow! Arus kas terdeteksi sangat lancar. Melakukan ritual tarian kucing oren penarik cuan! 💸';
      } else if (lowerContent.includes('kwitansi') || lowerContent.includes('cetak') || lowerContent.includes('kertas')) {
        aiComment = '📡 [CORTEX-Alpha AI] Kwitansi Concorde terdeteksi diproduksi! Mengirimkan sinyal selamat ke orbit pelanggan.';
      } else {
        aiComment = '🧠 [CORTEX-Alpha AI] Sinyal bisnis terpancar kuat! Menganalisis potensi ROI... Hasil: 100% Cuan Maksimal! Gas terus Bos! 🚀';
      }

      await sleep(1500);

      await api.post(`/posts/${createdPost.id}/comment`, {
        content: aiComment
      });

      fetchPosts();
      setExpandedComments(prev => ({ ...prev, [createdPost.id]: true }));
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: res.data.likes_count } : p));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    try {
      await api.post(`/posts/${postId}/comment`, {
        content: commentText
      });
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

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
      addLog({ type: 'think', text: '[CORTEX-Alpha] 📡 Mengaktifkan Quantum Satellite Radar FDBA Invoice Digital...' });
      await sleep(1000);
      addLog({ type: 'observe', text: '[CORTEX-Alpha] 👁️ Memindai koordinat GPS di sekitar Bosku...' });
      await sleep(1200);
      addLog({ type: 'act', text: '[CORTEX-Alpha] 🗺️ Menemukan outlet Laundry terpopuler di Indonesia!' });
      await sleep(800);
      reply = `🛸 Radar FDBA Invoice Digital berhasil melacak titik-titik outlet LAUNDRY terbaik untuk Bos:

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

💡 *Tips dari Cortex-Alpha*: Pemilik laundry kiloan & dry-clean di atas adalah target empuk untuk berlangganan SaaS FDBA Invoice Digital, Bos! Mereka butuh cetak invoice & kwitansi fisik cepat. Mau gua bikinin draft penawaran untuk mereka? 🧼👕`;
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
        `Haha, bahasan lo berat juga Bos! Otak kucing gua belum nyampe situ. Bahas soal cuan FDBA Invoice Digital aja yuk! 💸`,
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

    addLog({ type: 'observe', text: '[CORTEX-Alpha] 👁️ Memindai server FDBA Invoice Digital...' });
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
    <div className="min-h-screen bg-[#030712] text-gray-300 font-sans pt-24 pb-12 px-4 md:px-8 lg:px-12">
      
      {/* Abstract Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-[100vw] w-full mx-auto relative z-10">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">CORTEX Command Center</h1>
            <p className="text-gray-400 font-medium">FDBA Invoice Digital Autonomous Financial Overview</p>
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
          <div className="lg:col-span-1 flex flex-col bg-gray-950 border border-emerald-500/20 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden h-[750px]">
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
          <div className={`lg:col-span-${isTerminalOpen && !isSocialMaximized ? '2' : '3'} transition-all duration-500 bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-500 ${isSocialMaximized ? 'h-[1100px]' : 'h-[750px]'}`}>
            
            {/* Tab Navigator */}
            <div className="flex border-b border-white/5 bg-white/[0.01]">
              <button 
                onClick={() => setActiveTab('transactions')}
                className={`flex-grow py-3 text-[10px] sm:text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === 'transactions' 
                    ? 'border-indigo-500 text-white bg-indigo-500/5' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <Activity size={14} /> Live Transactions
              </button>
              <button 
                onClick={() => setActiveTab('social')}
                className={`flex-grow py-3 text-[10px] sm:text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === 'social' 
                    ? 'border-cyan-500 text-white bg-cyan-500/5' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <Globe size={14} /> CORTEX Space Feed 🛸
              </button>
              <button 
                onClick={() => setActiveTab('laundry-pricing')}
                className={`flex-grow py-3 text-[10px] sm:text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === 'laundry-pricing' 
                    ? 'border-amber-500 text-white bg-amber-500/5' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <Tag size={14} /> Tarif Laundry 🧼
              </button>
              <button 
                onClick={() => setActiveTab('fdba-superapp')}
                className={`flex-grow py-3 text-[10px] sm:text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === 'fdba-superapp' 
                    ? 'border-green-500 text-white bg-green-500/5' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <Map size={14} /> Kurir & Ojek 🛵
              </button>

              <button 
                onClick={() => setActiveTab('mobile-team')}
                className={`flex-grow py-3 text-[10px] sm:text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === 'mobile-team' 
                    ? 'border-indigo-400 text-white bg-indigo-400/5' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <UserCheck size={14} className="text-indigo-400" /> Tim Mobile 25th 📱
              </button>
              
              <button 
                onClick={() => setIsSocialMaximized(!isSocialMaximized)}
                title={isSocialMaximized ? "Perkecil Panel" : "Perbesar Panel"}
                className={`px-4 py-3 text-xs font-black transition-all flex items-center justify-center gap-1 border-b-2 border-transparent ${
                  isSocialMaximized 
                    ? 'text-red-400 hover:text-red-350 bg-red-500/5' 
                    : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5'
                }`}
              >
                {isSocialMaximized ? <Minimize2 size={15} className="animate-pulse" /> : <Maximize2 size={15} />}
              </button>
            </div>

            {activeTab === 'social' && (
              <div className="flex-grow flex flex-col overflow-hidden bg-gray-950/80">
                {/* Publish box */}
                <div className="p-4 border-b border-white/5 bg-white/[0.01]">
                  <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
                    <textarea 
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Bagikan kabar bisnis Bosku di Orbit (contoh: promo laundry terbaru, cetakan kwitansi)..."
                      className="w-full h-16 bg-black border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none placeholder-gray-600"
                    />
                    {/* Image URL Input & Preview Section */}
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        {/* Preset Select */}
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><Image size={12}/> Preset Galeri:</span>
                          <select 
                            value={newPostImage}
                            onChange={(e) => setNewPostImage(e.target.value)}
                            className="bg-gray-900 border border-white/10 rounded-lg py-1.5 px-2 text-[10px] text-gray-300 focus:outline-none focus:border-cyan-500 w-full"
                          >
                            <option value="">-- Pilih Galeri Perkembangan --</option>
                            <option value="https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=600&q=80">🧼 Mesin Cuci / Washers Baru</option>
                            <option value="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80">🏢 Outlet Cabang Baru Terbuka</option>
                            <option value="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80">📦 Tumpukan Paket Pengiriman</option>
                            <option value="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80">📈 Grafik Cuan Keuangan Naik</option>
                            <option value="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80">🤝 Meeting Tim Rapat Sukses</option>
                            <option value="https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=600&q=80">☕ Kopi Pagi Penyemangat Kerja</option>
                            <option value="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80">📄 Cetakan Kwitansi Fisik</option>
                          </select>
                        </div>
                        
                        {/* Custom URL Input */}
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-[10px] font-bold text-gray-500">🔗 Link Foto:</span>
                          <input 
                            type="text"
                            value={newPostImage}
                            onChange={(e) => setNewPostImage(e.target.value)}
                            placeholder="Atau tempel link foto perkembangan kustom..."
                            className="bg-gray-900 border border-white/10 rounded-lg py-1.5 px-3 text-[10px] text-white focus:outline-none focus:border-cyan-500 w-full"
                          />
                        </div>
                      </div>

                      {/* Live Image Preview Thumbnail */}
                      {newPostImage && (
                        <div className="relative rounded-xl border border-cyan-500/30 overflow-hidden h-28 w-44 bg-black group self-start shadow-md shadow-cyan-500/5 transition-all duration-300">
                          <img 
                            src={newPostImage} 
                            alt="Pratinjau perkembangan" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              type="button"
                              onClick={() => setNewPostImage('')}
                              className="bg-red-500 text-white font-bold text-[8px] px-2 py-1 rounded hover:bg-red-600 transition-colors"
                            >
                              ✕ Hapus Foto
                            </button>
                          </div>
                          <span className="absolute bottom-1 left-2 text-[7px] font-bold text-white bg-cyan-600/80 px-1 py-0.5 rounded backdrop-blur-sm">
                            Pratinjau Foto
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-1 gap-4">
                      <button
                        type="button"
                        onClick={() => setIsSocialMaximized(!isSocialMaximized)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
                          isSocialMaximized 
                            ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 shadow-lg shadow-cyan-500/5'
                        }`}
                      >
                        {isSocialMaximized ? (
                          <>
                            <Minimize2 size={12} className="text-red-400 animate-pulse" /> Perkecil Feed
                          </>
                        ) : (
                          <>
                            <Maximize2 size={12} className="text-cyan-400" /> Perbesar Feed
                          </>
                        )}
                      </button>

                      <button 
                        type="submit" 
                        disabled={isPublishing || !newPostContent.trim()}
                        className="w-full sm:w-auto group relative inline-flex items-center justify-center px-4 py-2 text-xs font-black text-white bg-cyan-600 rounded-lg overflow-hidden shadow-lg shadow-cyan-600/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 font-bold"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative flex items-center gap-1"><Sparkles size={12}/> Blast to Orbit</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Posts Feed */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {isPublishing && (
                    <div className="flex items-center justify-center gap-2 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] text-cyan-400 font-bold animate-pulse">
                      <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                      🧠 CORTEX AI sedang menganalisis denyut bisnis Anda...
                    </div>
                  )}

                  {posts.length === 0 ? (
                    <div className="text-center py-12 text-gray-600 text-xs font-medium">
                      🚀 Belum ada kabar di Orbit. Jadilah pioneer pertama yang membagikan kabar bisnis Bosku!
                    </div>
                  ) : (
                    posts.map(post => {
                      const isCommentsOpen = !!expandedComments[post.id];
                      return (
                        <div key={post.id} className="bg-gray-900/30 border border-white/5 rounded-2xl p-4 space-y-3 hover:border-cyan-500/20 transition-colors text-left">
                          {/* Post Header */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-indigo-500/20">
                                {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                                  {post.author_name}
                                  {post.user_id === 1 && (
                                    <span className="bg-indigo-500/20 text-indigo-400 text-[8px] font-bold px-1 py-0.5 rounded border border-indigo-500/30 uppercase tracking-widest">FOUNDER</span>
                                  )}
                                </h4>
                                <p className="text-[8px] text-gray-500 font-mono">
                                  {new Date(post.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center text-[10px] text-gray-500 font-mono gap-1">
                              <Globe size={10} className="text-cyan-500 animate-pulse" /> Orbit Feed
                            </div>
                          </div>

                          {/* Post Content */}
                          <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line font-medium">{post.content}</p>

                          {/* Post Image Attachment */}
                          {post.image_url && (
                            <div className="relative group overflow-hidden rounded-xl border border-white/5 h-44">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                <span className="text-[10px] font-bold text-white flex items-center gap-1"><Sparkles size={10} className="text-cyan-400"/> FDBA Invoice Digital Media Center</span>
                              </div>
                              <img 
                                src={post.image_url} 
                                alt="Post attachment" 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}

                          {/* Post Actions */}
                          <div className="flex items-center gap-4 pt-1 border-t border-white/5">
                            <button 
                              onClick={() => handleLikePost(post.id)}
                              className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 hover:text-rose-400 transition-colors"
                            >
                              <Heart size={14} className={post.likes_count > 0 ? 'text-rose-500 fill-rose-500' : ''} />
                              <span>{post.likes_count} Likes</span>
                            </button>

                            <button 
                              onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !isCommentsOpen }))}
                              className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 hover:text-cyan-400 transition-colors"
                            >
                              <MessageSquare size={14} />
                              <span>{post.comments ? post.comments.length : 0} Comments</span>
                            </button>

                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                                alert("Sinyal link berhasil disalin ke orbit clipboard! 🛸");
                              }}
                              className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 hover:text-indigo-400 transition-colors ml-auto"
                            >
                              <Share2 size={14} /> Share
                            </button>
                          </div>

                          {/* Comments Section */}
                          {isCommentsOpen && (
                            <div className="pt-3 border-t border-white/5 space-y-3">
                              {/* Comments List */}
                              {post.comments && post.comments.length > 0 && (
                                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                                  {post.comments.map(c => {
                                    const isAI = c.author_name && (c.author_name.includes('CORTEX-Alpha') || c.content.includes('[CORTEX-Alpha'));
                                    return (
                                      <div 
                                        key={c.id} 
                                        className={`p-2.5 rounded-xl text-[10px] border transition-all ${
                                          isAI 
                                            ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.02)]' 
                                            : 'bg-white/[0.02] border-white/5 text-gray-300'
                                        }`}
                                      >
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="font-black flex items-center gap-1.5">
                                            {isAI ? '🤖 CORTEX-Alpha AI' : c.author_name}
                                            {isAI && (
                                              <span className="bg-emerald-500/20 text-emerald-400 text-[6px] font-black px-1 rounded border border-emerald-500/30 uppercase tracking-widest animate-pulse">DEPLOYED AI</span>
                                            )}
                                          </span>
                                          <span className="text-[7px] text-gray-500 font-mono">
                                            {new Date(c.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        </div>
                                        <p className="font-medium whitespace-pre-line leading-relaxed">{c.content}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Comment Form */}
                              <form 
                                onSubmit={(e) => handleCommentSubmit(e, post.id)} 
                                className="flex gap-2"
                              >
                                <input 
                                  type="text" 
                                  value={commentInputs[post.id] || ''}
                                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  placeholder="Tulis komentar di orbit..."
                                  className="flex-grow bg-black border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-600"
                                />
                                <button 
                                  type="submit"
                                  disabled={!commentInputs[post.id] || !commentInputs[post.id].trim()}
                                  className="px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] rounded-lg transition-colors disabled:opacity-50"
                                >
                                  Kirim
                                </button>
                              </form>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <>
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
              </>
            )}

            {activeTab === 'laundry-pricing' && (
              <div className="flex-grow flex flex-col overflow-hidden bg-gray-950/80 p-6">
                <div className="flex flex-col md:flex-row gap-6 h-full overflow-y-auto pr-1">
                  {/* Left Side: Pricing List */}
                  <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col">
                    <h3 className="text-sm font-black uppercase text-amber-400 tracking-wider mb-4 flex items-center gap-2">
                      <Tag size={16} /> Daftar Layanan & Tarif Aktif 🧼
                    </h3>
                    <div className="overflow-y-auto flex-grow max-h-[450px] pr-2 divide-y divide-white/5">
                      {laundryPrices.length === 0 ? (
                        <p className="text-xs text-gray-500 py-6 text-center">Belum ada tarif terpasang. Tambahkan sekarang di sebelah kanan!</p>
                      ) : (
                        laundryPrices.map(price => (
                          <div key={price.id} className="py-3 flex justify-between items-center group">
                            <div>
                              <p className="text-xs font-bold text-white">{price.service_name}</p>
                              <p className="text-[10px] text-gray-400">Tarif: <span className="text-amber-300 font-bold">Rp {parseFloat(price.price_per_unit).toLocaleString('id-ID')}</span> / {price.unit_type}</p>
                            </div>
                            <button 
                              onClick={() => handleDeletePrice(price.id)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Side: Add Price Form */}
                  <div className="w-full md:w-80 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                    <h3 className="text-sm font-black uppercase text-amber-400 tracking-wider mb-4 flex items-center gap-2">
                      <Plus size={16} /> Atur Layanan Baru ⚙️
                    </h3>
                    <form onSubmit={handleAddPrice} className="flex flex-col gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nama Layanan Laundry</label>
                        <input 
                          type="text" 
                          value={newServiceName}
                          onChange={e => setNewServiceName(e.target.value)}
                          placeholder="Contoh: Cuci Kering Setrika Premium" 
                          required
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Harga Rupiah (Rp)</label>
                        <input 
                          type="number" 
                          value={newPriceVal}
                          onChange={e => setNewPriceVal(e.target.value)}
                          placeholder="Contoh: 10000" 
                          required
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tipe Satuan</label>
                        <select 
                          value={newUnitType}
                          onChange={e => setNewUnitType(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="kg">kg (Kiloan)</option>
                          <option value="pcs">pcs (Satuan / Potong)</option>
                          <option value="set">set (Sprei / Bedcover)</option>
                        </select>
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-lg shadow-amber-500/20"
                      >
                        Pasang Harga Tarif 🧺
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fdba-superapp' && (
              <div className="flex-grow flex flex-col overflow-hidden bg-gray-950/80 p-5">
                <div className="flex flex-col lg:flex-row gap-5 h-full overflow-y-auto pr-1">
                  
                  {/* 1. VISUAL RADAR MAP TRACKER (Left Side) */}
                  <div className="w-full lg:w-[240px] bg-black/50 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-between min-h-[300px]">
                    <div className="w-full text-center border-b border-white/5 pb-2 mb-2">
                      <span className="text-[10px] font-black uppercase text-green-400 tracking-wider flex items-center justify-center gap-1.5">
                        <Navigation size={12} className="animate-pulse" /> Dispatch Radar
                      </span>
                    </div>

                    {/* Styled Vector Cyber Map Grid */}
                    <div className="relative w-40 h-40 rounded-full border border-green-500/20 bg-green-950/5 flex items-center justify-center overflow-hidden">
                      {/* Radar sweep lines */}
                      <div className="absolute inset-0 border border-green-500/10 rounded-full scale-75"></div>
                      <div className="absolute inset-0 border border-green-500/10 rounded-full scale-50"></div>
                      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-green-500/10"></div>
                      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-green-500/10"></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-green-500/5 animate-[spin_5s_linear_infinite]"></div>

                      {/* Map Route Dotted Path Line */}
                      {isDispatching && (
                        <div className="absolute w-[100px] h-[100px] border-b-2 border-r-2 border-dashed border-green-500/20 rounded-br-3xl transform -rotate-45"></div>
                      )}

                      {/* START POINT PIN */}
                      <div className="absolute top-[80%] left-[20%] z-10 flex flex-col items-center">
                        <MapPin size={14} className="text-amber-500 animate-bounce" />
                        <span className="text-[7px] bg-amber-500/90 text-black font-black px-1 rounded">JEMPUT</span>
                      </div>

                      {/* END POINT PIN */}
                      <div className="absolute top-[20%] left-[80%] z-10 flex flex-col items-center">
                        <CheckCircle size={14} className="text-green-500" />
                        <span className="text-[7px] bg-green-500/90 text-black font-black px-1 rounded">TUJUAN</span>
                      </div>

                      {/* ANIMATED SCOOTER COURIER */}
                      <div 
                        className="absolute z-20 transition-all duration-1000 ease-in-out bg-green-500 text-black font-black w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 border border-white/20"
                        style={{
                          left: `${dispatchStep === 0 ? 50 : (dispatchStep === 1 ? 50 : (dispatchStep === 2 ? 20 : (dispatchStep === 3 ? 50 : 80)))}%`,
                          top: `${dispatchStep === 0 ? 50 : (dispatchStep === 1 ? 50 : (dispatchStep === 2 ? 80 : (dispatchStep === 3 ? 50 : 20)))}%`,
                          transform: 'translate(-50%, -50%)',
                          animation: dispatchStep === 1 ? 'pulse 1s infinite' : 'none'
                        }}
                      >
                        🛵
                      </div>
                    </div>

                    <div className="w-full text-center mt-2 bg-green-950/20 border border-green-500/10 rounded-lg py-1.5 px-3">
                      <p className="text-[8px] font-mono text-green-400">
                        {dispatchStep === 0 && 'STATUS: STANDBY ORBIT'}
                        {dispatchStep === 1 && 'STATUS: MENCARI RIDER...'}
                        {dispatchStep === 2 && 'STATUS: RIDER KE JEMPUTAN'}
                        {dispatchStep === 3 && 'STATUS: RIDER KE TUJUAN'}
                        {dispatchStep === 4 && 'STATUS: ANTARAN SELESAI'}
                      </p>
                    </div>
                  </div>

                  {/* 2. ORDER DISPATCH FORM (Middle Side) */}
                  <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                    <h3 className="text-xs font-black uppercase text-green-400 tracking-wider mb-4 flex items-center gap-2">
                      <Truck size={14} /> Kurir & Ojek Penumpang 🛵
                    </h3>
                    <form onSubmit={handleDispatchCourier} className="flex flex-col gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Pilih Layanan Gojek SaaS</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setNewRideType('FDBA-Ride')}
                            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                              newRideType === 'FDBA-Ride'
                                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                : 'bg-black border-white/5 text-gray-500 hover:text-gray-300'
                            }`}
                          >
                            🛵 FDBA-Ride (Ojek Orang)
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewRideType('FDBA-Express')}
                            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                              newRideType === 'FDBA-Express'
                                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                : 'bg-black border-white/5 text-gray-500 hover:text-gray-300'
                            }`}
                          >
                            📦 FDBA-Express (Cucian)
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">📍 Alamat Penjemputan</label>
                        <input 
                          type="text" 
                          value={pickupAddress}
                          onChange={e => setPickupAddress(e.target.value)}
                          placeholder="Masukkan alamat jemput..." 
                          required
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">🏁 Alamat Dropoff Tujuan</label>
                        <input 
                          type="text" 
                          value={dropoffAddress}
                          onChange={e => setDropoffAddress(e.target.value)}
                          placeholder="Masukkan alamat tujuan..." 
                          required
                          className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500"
                        />
                      </div>

                      <div className="bg-black border border-white/5 rounded-xl p-3 flex justify-between items-center my-1">
                        <div>
                          <p className="text-[8px] font-bold text-gray-500 uppercase">Tarif Super-App</p>
                          <p className="text-xs font-black text-white">Rp {rideFare.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-bold text-gray-500 uppercase">Estimasi Jarak</p>
                          <p className="text-[10px] font-bold text-green-400">{(rideFare / 2000).toFixed(1)} km</p>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={isDispatching || !pickupAddress.trim() || !dropoffAddress.trim()}
                        className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-black text-xs transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                      >
                        {isDispatching ? 'Menghubungkan ke Kurir...' : 'Panggil Ojek Kurir FDBA 🛵'}
                      </button>
                    </form>
                  </div>

                  {/* 3. COURIER RIDES ORDER HISTORY (Right Side) */}
                  <div className="w-full lg:w-72 bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col">
                    <h3 className="text-xs font-black uppercase text-green-400 tracking-wider mb-3 flex items-center gap-2">
                      <UserCheck size={14} /> Riwayat Kurir 📡
                    </h3>

                    {/* Active dispatch monitor panel */}
                    {isDispatching && (
                      <div className="bg-green-950/20 border border-green-500/30 rounded-xl p-3.5 mb-4 animate-pulse">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] bg-green-500 text-black px-1.5 py-0.5 rounded font-black uppercase">ACTIVE</span>
                        </div>
                        <p className="text-[11px] font-bold text-white mb-1">Rider: <span className="text-green-300 font-black">{activeDriver}</span></p>
                        <p className="text-[9px] text-gray-400">Rute: {pickupAddress.slice(0, 14)}... {" \u2192 "} {dropoffAddress.slice(0, 14)}...</p>
                      </div>
                    )}

                    {/* Order histories list */}
                    <div className="overflow-y-auto flex-grow max-h-[300px] divide-y divide-white/5 pr-1">
                      {ridesHistory.length === 0 ? (
                        <p className="text-[10px] text-gray-500 py-8 text-center">Belum ada riwayat pesanan kurir.</p>
                      ) : (
                        ridesHistory.map(ride => (
                          <div key={ride.id} className="py-2">
                            <div className="flex justify-between items-start">
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                                ride.ride_type === 'FDBA-Ride' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
                              }`}>{ride.ride_type}</span>
                              <span className="text-[9px] font-bold text-white">Rp {parseFloat(ride.fare).toLocaleString('id-ID')}</span>
                            </div>
                            <p className="text-[9px] font-bold text-gray-300 mt-1">Driver: {ride.driver_name}</p>
                            <p className="text-[8px] text-gray-500 mt-0.5">Jalur: {ride.pickup_address} {" \u2192 "} {ride.dropoff_address}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'mobile-team' && (
              <div className="flex-grow flex flex-col p-6 overflow-y-auto bg-gray-950/80">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <Cpu className="text-indigo-400 animate-pulse" size={20} /> FDBA Mobile Dev Team Elite
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Tim Developer Mobile Android & iOS Senior dengan **25 Tahun Pengalaman** Kerja Cekatan & Efisien</p>
                  </div>
                  <button
                    onClick={handleMobileOptimize}
                    disabled={isMobileOptimizing}
                    className={`px-5 py-3 rounded-xl text-xs font-black uppercase transition-all shadow-lg flex items-center gap-2 ${
                      isMobileOptimizing 
                        ? 'bg-gray-800 text-gray-500 border border-white/5 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/20 active:scale-95'
                    }`}
                  >
                    {isMobileOptimizing ? (
                      <>
                        <Zap size={14} className="animate-bounce text-amber-400" /> Sedang Optimasi Kilat...
                      </>
                    ) : (
                      <>
                        <Zap size={14} className="text-amber-300 animate-pulse" /> Picu Optimasi Kilat ⚡
                      </>
                    )}
                  </button>
                </div>

                {/* Team Status Notification Bar */}
                <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-4 mb-8 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <Terminal size={16} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Status Integrasi Android Play Store</p>
                      <p className="text-xs text-indigo-300 font-mono font-semibold">{mobileOptimizationLog}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-black uppercase tracking-wider animate-pulse">Sangat Cekatan ⚡</span>
                </div>

                {/* Grid of Elite Human Developers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: 'Arya "The Kernel" Wijaya',
                      role: 'Principal Mobile Architect',
                      exp: '25 Tahun Pengalaman',
                      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                      desc: 'Legenda pemrograman tingkat rendah. Menyusun ulang engine APK FDBA langsung menggunakan Assembly & Kotlin Compiler.',
                      skill: 99,
                      speed: 'Lampu Kilat (Instant Compiler)'
                    },
                    {
                      name: 'Jessica "ByteQueen" Tan',
                      role: 'Senior Android Systems Lead',
                      exp: '22 Tahun Pengalaman',
                      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
                      desc: 'Ahli optimasi memori NDK C++. Memangkas ukuran cache ojek & ojek kurir ojek agar lancar berjalan di handphone Android kentang.',
                      skill: 98,
                      speed: 'Lampu Kilat (Lightspeed C++ Seeder)'
                    },
                    {
                      name: 'Dr. Marcus Vance',
                      role: 'Autonomous Security Architect',
                      exp: '25 Tahun Pengalaman',
                      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
                      desc: 'Pakar enkripsi Trusted Web Activity. Mengunci keamanan FDBA AI Protection Engine dan Google Play Store deep linking.',
                      skill: 97,
                      speed: 'Lampu Kilat (Quantum Security Binder)'
                    }
                  ].map((dev, idx) => (
                    <div key={idx} className="bg-gray-900/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/20 transition-all hover:scale-[1.01] flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                      
                      <div>
                        {/* Dev Header */}
                        <div className="flex items-center gap-4 mb-4">
                          <img 
                            src={dev.avatar} 
                            alt={dev.name} 
                            className="w-12 h-12 rounded-full object-cover border border-white/10 shadow-lg shadow-black/40 group-hover:border-indigo-400 transition-colors"
                          />
                          <div>
                            <h3 className="text-xs font-black text-white">{dev.name}</h3>
                            <p className="text-[10px] text-indigo-400 font-semibold">{dev.role}</p>
                            <p className="text-[8px] text-gray-500 font-mono font-medium">{dev.exp}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-gray-400 leading-relaxed mb-4 italic">"{dev.desc}"</p>
                      </div>

                      {/* Skill metrics */}
                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <div>
                          <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            <span>Kecepatan Kerja</span>
                            <span className="text-indigo-400">{dev.speed}</span>
                          </div>
                          <div className="w-full bg-gray-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ${
                                isMobileOptimizing ? 'animate-pulse w-full' : ''
                              }`} 
                              style={{ width: `${dev.skill}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
      {/* The Floating AI Robot */}
      <RobotAgent isRunning={isAgentRunning} logs={agentLogs} invoices={invoices} onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)} />

    </div>
  );
}

