import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Printer, CheckCircle, Palette, FileText, ShieldCheck, 
  Pencil, AlertCircle, Clock, Shield, RefreshCw, Landmark, 
  CreditCard, Truck, MapPin, Package, Send, Check
} from 'lucide-react';
import api from '../services/api';
import * as AllThemes from '../themes';
import { SecureText, SecureCanvas, useInvoiceProtection } from '../utils/invoiceProtection.jsx';

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── AKTIFKAN ANTI-AI EXTRACTION ENGINE ──
  useInvoiceProtection();

  // --- THEME ENGINE STATES ---
  const [themeColor, setThemeColor] = useState('indigo'); 
  const [layoutStyle, setLayoutStyle] = useState('modern'); 
  const [selectedMockup, setSelectedMockup] = useState('');

  // --- PHYSICAL PRINT & DELIVERY SYSTEM ---
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [shippingStep, setShippingStep] = useState(1); // 1 = Address, 2 = Pay, 3 = Real-time Tracking
  const [shippingAddress, setShippingAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [courierService, setCourierService] = useState('gosend'); // gosend, grab, lalamove, jne
  const [trackingProgress, setTrackingProgress] = useState(0);
  const [trackingStatus, setTrackingStatus] = useState('Menunggu pembayaran...');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/invoices/${id}`);
        setInvoice(res.data);
      } catch (err) {
        setError('Invoice not found');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleMarkAsPaid = async () => {
    try {
      await api.patch(`/invoices/${id}/status`, { status: 'paid' });
      setInvoice({ ...invoice, status: 'paid' });
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStartCourierTracking = () => {
    setShippingStep(3);
    setTrackingProgress(15);
    setTrackingStatus('Pesanan cetak masuk ke sistem percetakan mitra FDBA Invoice Digital...');
    
    setTimeout(() => {
      setTrackingProgress(45);
      setTrackingStatus('Invoice sedang dicetak fisik menggunakan kertas Concorde Premium 220gr & stempel basah...');
    }, 3000);

    setTimeout(() => {
      setTrackingProgress(70);
      setTrackingStatus(`Dokumen selesai dikemas. Kurir ${courierService.toUpperCase()} sedang menjemput kiriman ke lokasi...`);
    }, 6000);

    setTimeout(() => {
      setTrackingProgress(90);
      setTrackingStatus('Kurir dalam perjalanan menuju alamat tujuan penerima (Estimasi tiba: 15 menit)...');
    }, 9000);

    setTimeout(() => {
      setTrackingProgress(100);
      setTrackingStatus('Paket Invoice Fisik & Kwitansi Resmi telah diterima dengan selamat di alamat tujuan! 📦✨');
    }, 12000);
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-bold">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;
  if (!invoice) return null;

  // --- THEME DICTIONARY ---
  const colors = {
    indigo: {
      text: 'text-indigo-600',
      bgLight: 'bg-indigo-50/50',
      borderLight: 'border-indigo-100',
      gradientBtn: 'from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-200',
      gradientBar: 'from-indigo-500 via-purple-500 to-pink-500'
    },
    emerald: {
      text: 'text-emerald-600',
      bgLight: 'bg-emerald-50/50',
      borderLight: 'border-emerald-100',
      gradientBtn: 'from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-200',
      gradientBar: 'from-emerald-400 via-green-500 to-teal-500'
    },
    rose: {
      text: 'text-rose-600',
      bgLight: 'bg-rose-50/50',
      borderLight: 'border-rose-100',
      gradientBtn: 'from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-200',
      gradientBar: 'from-rose-400 via-pink-500 to-orange-400'
    }
  };
  const activeColor = colors[themeColor];
  const isClassic = layoutStyle === 'classic';
  
  const mockupThemeNames = Object.keys(AllThemes);
  const MockupComponent = selectedMockup ? AllThemes[selectedMockup] : null;

  // Calculate pricing breakdown
  const taxRate = parseFloat(invoice.tax_rate || 0);
  const finalTotal = parseFloat(invoice.total || 0);
  const subtotal = Math.round(taxRate > 0 ? (finalTotal / (1 + (taxRate / 100))) : finalTotal);
  const taxAmount = Math.round(finalTotal - subtotal);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-0 relative">
      
      {/* SaaS Editor Panel */}
      <div className="mb-4 bg-gray-900 text-white p-4 rounded-xl print:hidden flex flex-col items-start gap-4 shadow-lg">
        <div className="flex items-center gap-2">
          <Palette size={20} className="text-gray-400" />
          <span className="font-semibold tracking-wide">FDBA Invoice Digital Theme Engine</span>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center w-full">
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700 w-full sm:w-auto">
            <FileText size={16} className="text-gray-400" />
            <select 
              className="bg-transparent text-white text-sm outline-none cursor-pointer w-full"
              value={selectedMockup}
              onChange={(e) => setSelectedMockup(e.target.value)}
            >
              <option value="" className="text-black">Gunakan Tema FDBA Invoice Digital Utama</option>
              <option disabled className="text-gray-400">--- 100 Tema Generasi AI ---</option>
              {mockupThemeNames.map(name => (
                <option key={name} value={name} className="text-black">{name.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {!selectedMockup && (
            <>
              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Color:</span>
                <button onClick={() => setThemeColor('indigo')} className={`w-5 h-5 rounded-full bg-indigo-50 ${themeColor==='indigo' ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}></button>
                <button onClick={() => setThemeColor('emerald')} className={`w-5 h-5 rounded-full bg-emerald-500 ${themeColor==='emerald' ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}></button>
                <button onClick={() => setThemeColor('rose')} className={`w-5 h-5 rounded-full bg-rose-500 ${themeColor==='rose' ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}></button>
              </div>

              <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Layout:</span>
                <button onClick={() => setLayoutStyle('modern')} className={`text-sm px-2 py-1 rounded ${!isClassic ? 'bg-white text-black font-bold' : 'text-gray-300 hover:text-white'}`}>Modern</button>
                <button onClick={() => setLayoutStyle('classic')} className={`text-sm px-2 py-1 rounded ${isClassic ? 'bg-white text-black font-bold' : 'text-gray-300 hover:text-white'}`}>Classic Corporate</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 print:hidden gap-4">
        <div className="flex flex-col">
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium">
            <ArrowLeft size={18} className="mr-2" /> Kembali ke Dashboard
          </button>
          {invoice.invoice_number && (
            <span className="text-xs text-gray-400 mt-1 ml-1 font-mono">{invoice.invoice_number}</span>
          )}
        </div>

        {invoice.due_date && (
          <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${
            invoice.status === 'overdue' ? 'bg-red-100 text-red-600' :
            invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {invoice.status === 'overdue' ? <AlertCircle size={13} /> : <Clock size={13} />}
            Tempo: {new Date(invoice.due_date).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
          </div>
        )}

        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto justify-end">
          <Link
            to={`/invoice/${id}/edit`}
            className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all text-sm font-semibold shadow-sm"
          >
            <Pencil size={15} className="mr-2" /> Edit
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold shadow-sm"
          >
            <Printer size={16} className="mr-2 text-gray-500" /> Cetak / PDF
          </button>
          <button
            onClick={() => {
              setShippingStep(1);
              setIsPrintModalOpen(true);
            }}
            className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Truck size={16} className="mr-2" /> Cetak & Kirim Fisik
          </button>
          {invoice.status !== 'paid' && (
            <button
              onClick={handleMarkAsPaid}
              className={`inline-flex items-center justify-center bg-gradient-to-r ${activeColor.gradientBtn} text-white px-6 py-2 rounded-lg transition-all text-sm font-semibold shadow-md`}
            >
              <CheckCircle size={16} className="mr-2" /> Tandai Lunas
            </button>
          )}
        </div>
      </div>

      {/* Security alert indicator */}
      <div className="mb-3 flex items-center gap-2 text-emerald-600 text-xs font-bold print:hidden">
        <ShieldCheck size={14} />
        <span>FDBA Invoice Digital AI Protection Active — Konten invoice dilindungi dari pencurian / AI scraping</span>
      </div>

      {selectedMockup && MockupComponent ? (
        <div
          id="protected-invoice"
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8"
          style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
        >
           <MockupComponent invoice={invoice} />
        </div>
      ) : (
        <div
          id="protected-invoice"
          className={`bg-white overflow-hidden relative ${isClassic ? 'border-2 border-gray-800 p-8 sm:p-12' : 'rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100'}`}
          style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
        >
          
          {!isClassic && (
            <div className={`h-2 w-full bg-gradient-to-r ${activeColor.gradientBar}`}></div>
          )}

          <div className={!isClassic ? 'p-8 sm:p-14' : ''}>
            
            {/* e-Faktur watermarks / badges */}
            <div className="absolute right-10 top-20 opacity-10 print:opacity-20 pointer-events-none select-none">
              {invoice.invoice_type === 'tax' && (
                <div className="border-4 border-indigo-700 text-indigo-700 font-black text-2xl uppercase tracking-widest p-4 rounded-xl rotate-12">
                  FAKTUR PAJAK SAH
                </div>
              )}
              {invoice.invoice_type === 'proforma' && (
                <div className="border-4 border-amber-500 text-amber-500 font-black text-2xl uppercase tracking-widest p-4 rounded-xl rotate-12">
                  PRO FORMA ONLY
                </div>
              )}
              {invoice.invoice_type === 'receipt' && (
                <div className="border-4 border-emerald-600 text-emerald-600 font-black text-2xl uppercase tracking-widest p-4 rounded-xl rotate-12">
                  KWITANSI ASLI
                </div>
              )}
            </div>

            {/* Conditionally Render Custom Kwitansi Template */}
            {invoice.invoice_type === 'receipt' ? (
              <div className="border-4 border-double border-emerald-800/40 p-8 rounded-2xl bg-emerald-50/10 relative overflow-hidden font-serif">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none border border-emerald-900 m-2 rounded-xl"></div>
                
                <div className="flex justify-between items-center border-b-2 border-emerald-900 pb-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-extrabold text-emerald-900 tracking-wider">KWITANSI</h2>
                    <p className="text-xs text-gray-500 font-sans mt-1">OFFICIAL RECEIPT</p>
                  </div>
                  <div className="text-right font-mono text-sm text-emerald-800">
                    No. {invoice.invoice_number}
                  </div>
                </div>

                <div className="space-y-6 text-sm text-gray-800 leading-loose">
                  <div className="flex items-end gap-3">
                    <span className="font-bold text-emerald-900 w-44 shrink-0 italic">Telah Diterima Dari :</span>
                    <span className="border-b border-dashed border-gray-400 flex-grow font-sans font-bold text-gray-900 pb-1 text-base">{invoice.client_name}</span>
                  </div>

                  <div className="flex items-end gap-3">
                    <span className="font-bold text-emerald-900 w-44 shrink-0 italic">Uang Sejumlah :</span>
                    <span className="border-b border-dashed border-gray-400 flex-grow font-sans font-medium text-emerald-950 pb-1 italic bg-emerald-50 px-2 rounded">
                      "{invoice.total_in_words || 'Nol rupiah'}"
                    </span>
                  </div>

                  <div className="flex items-end gap-3">
                    <span className="font-bold text-emerald-900 w-44 shrink-0 italic">Untuk Pembayaran :</span>
                    <span className="border-b border-dashed border-gray-400 flex-grow font-sans text-gray-800 pb-1 text-sm">{invoice.notes || 'Pelunasan biaya transaksi'}</span>
                  </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-emerald-900/10 pt-6">
                  <div className="bg-emerald-900 text-white font-sans font-black text-2xl px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-900/20 tracking-wider">
                    Rp {finalTotal.toLocaleString('id-ID')},-
                  </div>
                  
                  <div className="text-center font-sans relative w-48">
                    {invoice.requires_materai && (
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 select-none pointer-events-none border-4 border-dashed border-indigo-500 text-indigo-600 font-black uppercase text-[10px] tracking-widest p-2 rounded rotate-6">
                        Bea Materai Lunas
                      </div>
                    )}
                    <p className="text-xs text-gray-500 font-medium mb-1 font-serif italic">{new Date(invoice.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="mb-12 text-xs font-bold text-gray-700">Penerima,</p>
                    <p className="font-bold uppercase border-b border-gray-800 text-gray-900 text-sm">Finance FDBA Invoice Digital</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard/Faktur/Proforma Template Rendering */
              <>
                {/* Header Section */}
                <div className={`flex flex-col ${isClassic ? 'sm:flex-row-reverse border-b-4 border-gray-900 pb-6' : 'sm:flex-row'} justify-between items-start mb-10 gap-8`}>
                  
                  {/* Logo & Brand */}
                  <div className={isClassic ? 'text-right w-full sm:w-auto' : ''}>
                    <div className={`flex items-center gap-3 mb-4 ${isClassic ? 'justify-end' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-2xl ${isClassic ? 'bg-gray-900 rounded-none' : `bg-gradient-to-br ${activeColor.gradientBtn}`}`}>
                        F
                      </div>
                      <h2 className={`text-3xl font-bold tracking-tight ${isClassic ? 'uppercase' : ''} text-gray-900`}>FDBA Invoice Digital</h2>
                    </div>
                    <p className={`text-gray-600 text-sm leading-relaxed ${isClassic ? 'font-mono' : ''}`}>
                      Gedung FDBA Invoice Digital Lantai 4<br/>
                      Kuningan, Jakarta Selatan 12940<br/>
                      {invoice.company_npwp ? `NPWP: ${invoice.company_npwp}` : 'billing@fdbainvoicedigital.com'}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className={isClassic ? 'text-left' : 'text-left sm:text-right'}>
                    <h1 className={`text-3xl font-black text-gray-900 mb-2 uppercase ${isClassic ? 'tracking-widest' : 'tracking-tight'}`}>
                      {invoice.invoice_type === 'tax' ? 'FAKTUR PAJAK' :
                       invoice.invoice_type === 'proforma' ? 'PRO FORMA INVOICE' :
                       invoice.invoice_type === 'recurring' ? 'RECURRING INVOICE' :
                       'INVOICE'}
                    </h1>
                    <p className="text-gray-500 font-medium mb-4 font-mono">No. Seri: {invoice.invoice_number}</p>
                    
                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-6 ${isClassic ? 'border-2 border-gray-900 text-gray-900 rounded-none' : 'border'}`}
                      style={!isClassic ? {
                        backgroundColor: invoice.status === 'paid' ? '#ecfdf5' : invoice.status === 'overdue' ? '#fef2f2' : '#fffbeb',
                        color: invoice.status === 'paid' ? '#059669' : invoice.status === 'overdue' ? '#dc2626' : '#d97706',
                        borderColor: invoice.status === 'paid' ? '#a7f3d0' : invoice.status === 'overdue' ? '#fca5a5' : '#fde68a'
                      } : {}}>
                      {invoice.status === 'paid' ? 'LUNAS' : invoice.status === 'overdue' ? 'OVERDUE' : 'PENDING'}
                    </div>

                    <div className={`grid grid-cols-2 gap-x-6 gap-y-2 text-sm ${isClassic ? 'font-mono' : ''}`}>
                      <span className="text-gray-500 text-left sm:text-right">Tgl Terbit:</span>
                      <span className="font-semibold text-gray-900 text-left sm:text-right">{new Date(invoice.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {invoice.invoice_type === 'tax' && (
                        <>
                          <span className="text-gray-500 text-left sm:text-right">Kode Transaksi:</span>
                          <span className="font-semibold text-indigo-600 text-left sm:text-right">{invoice.tax_code || '01'}</span>
                        </>
                      )}
                      {invoice.invoice_type === 'recurring' && (
                        <>
                          <span className="text-gray-500 text-left sm:text-right">Siklus:</span>
                          <span className="font-semibold text-purple-600 text-left sm:text-right flex items-center justify-end gap-1"><RefreshCw size={12} className="animate-spin" /> {invoice.recurring_interval}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {!isClassic && <hr className="border-gray-100 mb-8" />}

                {/* Billed To & Tax Identifiers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div>
                    <h3 className={`text-xs font-bold uppercase mb-3 ${isClassic ? 'text-gray-900 border-b-2 border-gray-900 inline-block pb-1' : 'text-gray-400 tracking-widest'}`}>
                      Ditagihkan Kepada
                    </h3>
                    <div className={`${isClassic ? 'p-0' : 'bg-gray-50 p-5 rounded-xl border border-gray-100'} inline-block min-w-full`}>
                      <p className={`text-lg font-bold text-gray-900 mb-1 ${isClassic ? 'uppercase' : ''}`}>{invoice.client_name}</p>
                      {invoice.client_email && <p className="text-indigo-600 font-medium text-sm mb-1">{invoice.client_email}</p>}
                      {invoice.client_phone && <p className="text-gray-500 text-xs">WhatsApp: {invoice.client_phone}</p>}
                    </div>
                  </div>

                  {invoice.invoice_type === 'tax' && (invoice.client_npwp || invoice.client_nik) && (
                    <div>
                      <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-3">Identitas Pajak Pembeli</h3>
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-2 text-sm text-gray-700">
                        {invoice.client_npwp && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">NPWP Klien:</span>
                            <span className="font-bold font-mono text-gray-900">{invoice.client_npwp}</span>
                          </div>
                        )}
                        {invoice.client_nik && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">NIK (KTP):</span>
                            <span className="font-bold font-mono text-gray-900">{invoice.client_nik}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Table */}
                <div className={`${isClassic ? 'mb-8' : 'rounded-xl border border-gray-200 overflow-hidden mb-8'}`}>
                  <div className="overflow-x-auto">
                    <table className={`w-full text-left border-collapse min-w-[600px] ${isClassic ? 'border-2 border-gray-900' : ''}`}>
                      <thead>
                        <tr className={`${isClassic ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500'} text-xs uppercase tracking-wider`}>
                          <th className={`py-4 px-6 font-semibold ${isClassic ? 'border border-gray-700' : ''}`}>Deskripsi Item</th>
                          <th className={`py-4 px-6 font-semibold text-center w-24 ${isClassic ? 'border border-gray-700' : ''}`}>Qty</th>
                          <th className={`py-4 px-6 font-semibold text-right w-32 ${isClassic ? 'border border-gray-700' : ''}`}>Harga Satuan</th>
                          <th className={`py-4 px-6 font-semibold text-right w-32 ${isClassic ? 'border border-gray-700' : ''}`}>Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {invoice.items && invoice.items.map((item) => (
                          <tr key={item.id} className={!isClassic ? 'hover:bg-gray-50/50 transition-colors' : ''}>
                            <td className={`py-5 px-6 text-gray-900 font-medium ${isClassic ? 'border-r border-gray-300' : ''}`}>{item.description}</td>
                            <td className={`py-5 px-6 text-center text-gray-600 ${isClassic ? 'border-r border-gray-300' : ''}`}>{item.quantity}</td>
                            <td className={`py-5 px-6 text-right text-gray-600 ${isClassic ? 'border-r border-gray-300' : ''}`}>Rp {parseFloat(item.price).toLocaleString('id-ID')}</td>
                            <td className="py-5 px-6 text-right text-gray-900 font-bold">
                              Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals & Payment Details */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-8">
                  <div className={`w-full sm:w-1/2 text-sm p-6 ${isClassic ? 'border-2 border-gray-900' : `${activeColor.bgLight} rounded-xl border ${activeColor.borderLight}`}`}>
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5"><Landmark size={16} /> Instruksi Pembayaran</h4>
                    <p className="mb-1 text-gray-700 text-xs">Mohon transfer pembayaran tagihan ke rekening resmi kami:</p>
                    <p className="font-bold text-gray-900">Bank BCA (Cabang Jakarta)</p>
                    <p className="font-mono mt-2 inline-block bg-white px-3 py-1.5 rounded border border-gray-200 shadow-sm text-gray-800 font-bold text-base">
                      A/N FDBA Invoice Digital: 098-765-4321
                    </p>
                    {invoice.notes && (
                      <div className="mt-4 border-t border-gray-200/50 pt-3 text-xs text-gray-500">
                        <span className="font-bold text-gray-700 block mb-1">Catatan Internal:</span>
                        {invoice.notes}
                      </div>
                    )}
                  </div>

                  <div className="w-full sm:w-1/3 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Subtotal (DPP)</span>
                        <span className="font-medium text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                      </div>
                      
                      {invoice.invoice_type === 'tax' && (
                        <div className="flex justify-between">
                          <span>PPN ({taxRate}%)</span>
                          <span className="font-medium text-gray-900">Rp {taxAmount.toLocaleString('id-ID')}</span>
                        </div>
                      )}

                      {invoice.requires_materai && (
                        <div className="flex justify-between text-amber-600 font-semibold text-xs border-t border-gray-200/50 pt-2">
                          <span>Bea Materai</span>
                          <span>LUNAS Rp 10.000</span>
                        </div>
                      )}

                      <div className={`flex justify-between items-center pt-4 mt-2 ${isClassic ? 'border-t-4 border-gray-900' : 'border-t border-gray-200'}`}>
                        <span className="font-bold text-gray-900 text-base">TOTAL DUE</span>
                        <span className={`font-black text-xl text-indigo-600`}>
                          Rp {finalTotal.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terbilang Section */}
                {invoice.total_in_words && (
                  <div className="mt-6 bg-gray-50/50 border border-dashed border-gray-200 p-4 rounded-xl text-xs text-gray-600 font-semibold italic">
                    Terbilang: "{invoice.total_in_words}"
                  </div>
                )}
                
                {/* Footer */}
                <div className={`mt-16 pt-8 flex flex-col sm:flex-row justify-between items-end ${isClassic ? '' : 'border-t border-gray-100'}`}>
                  <div className="text-gray-400 text-[10px] w-full sm:w-1/2 leading-relaxed font-sans">
                    * Pembayaran dianggap sah apabila dana telah masuk sepenuhnya ke rekening kami.<br/>
                    * Dokumen ini diterbitkan secara elektronik dan dilindungi oleh FDBA Invoice Digital AI Protection Engine.
                  </div>
                  
                  <div className="text-center w-full sm:w-48 mt-8 sm:mt-0 relative">
                    {invoice.requires_materai && (
                      <div className="absolute left-1/2 top-10 -translate-x-1/2 -translate-y-1/2 opacity-30 select-none pointer-events-none border-4 border-dashed border-indigo-500 text-indigo-600 font-black uppercase text-[10px] tracking-widest p-2 rounded rotate-6">
                        Bea Materai Lunas
                      </div>
                    )}
                    <p className="mb-14 text-sm font-bold text-gray-700">Hormat Kami,</p>
                    <p className="font-bold uppercase border-b border-gray-900 text-gray-900">Finance FDBA Invoice Digital</p>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 🚚 CETAK & KIRIM FISIK (COURIER) checkout modal */}
      {/* ========================================================== */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 print:hidden animate-in fade-in duration-300">
          <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Truck className="text-emerald-400" size={22} />
                <h3 className="text-lg font-bold text-white">Layanan Cetak & Kirim Fisik</h3>
              </div>
              <button 
                onClick={() => setIsPrintModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Step Progress Bar */}
              <div className="flex items-center justify-between mb-8 px-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${shippingStep >= 1 ? 'bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-500/20' : 'bg-gray-800 text-gray-500'}`}>1</div>
                  <span className="text-[10px] text-gray-400 mt-1 font-semibold">Alamat</span>
                </div>
                <div className={`h-0.5 flex-grow mx-2 transition-colors ${shippingStep >= 2 ? 'bg-emerald-500' : 'bg-gray-850'}`}></div>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${shippingStep >= 2 ? 'bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-500/20' : 'bg-gray-850 text-gray-500'}`}>2</div>
                  <span className="text-[10px] text-gray-400 mt-1 font-semibold">Bayar</span>
                </div>
                <div className={`h-0.5 flex-grow mx-2 transition-colors ${shippingStep >= 3 ? 'bg-emerald-500' : 'bg-gray-850'}`}></div>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${shippingStep >= 3 ? 'bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-500/20' : 'bg-gray-850 text-gray-500'}`}>3</div>
                  <span className="text-[10px] text-gray-400 mt-1 font-semibold">Kirim</span>
                </div>
              </div>

              {/* Step 1: Address Details */}
              {shippingStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed mb-2">Masukkan alamat tujuan pengiriman invoice fisik Anda. Kami bekerjasama dengan percetakan terdekat dari alamat penerima untuk menekan ongkos kirim.</p>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nama Lengkap Penerima</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Budi Santoso (PT. Maju Bersama)"
                      value={receiverName} 
                      onChange={e => setReceiverName(e.target.value)} 
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">No. HP / WhatsApp Penerima</label>
                    <input 
                      type="tel" 
                      placeholder="Contoh: 0812XXXXXXXX"
                      value={receiverPhone} 
                      onChange={e => setReceiverPhone(e.target.value)} 
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Alamat Pengiriman Lengkap</label>
                    <textarea 
                      placeholder="Nama Jalan, Blok, Nomor Rumah, Kecamatan, Kota, Kode Pos"
                      value={shippingAddress} 
                      onChange={e => setShippingAddress(e.target.value)} 
                      rows="3"
                      className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Metode Pengiriman</label>
                    <div className="grid grid-cols-2 gap-3 mt-1.5">
                      {[
                        ['gosend', '🛵 GoSend Instant'],
                        ['grab', '🛵 Grab Express'],
                        ['lalamove', '🚙 Lalamove Car'],
                        ['jne', '📦 JNE Reguler']
                      ].map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setCourierService(val)}
                          className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-left ${courierService === val ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-black border-white/5 text-gray-400 hover:text-white'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!receiverName || !receiverPhone || !shippingAddress}
                    onClick={() => setShippingStep(2)}
                    className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-800 text-black disabled:text-gray-500 font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    Lanjutkan ke Pembayaran
                  </button>
                </div>
              )}

              {/* Step 2: Payment Review */}
              {shippingStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-black/40 rounded-2xl p-5 border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5"><MapPin size={14} className="text-emerald-400"/> Tujuan Pengiriman</h4>
                    <p className="text-sm text-white font-bold">{receiverName} ({receiverPhone})</p>
                    <p className="text-xs text-gray-400 leading-relaxed font-mono">{shippingAddress}</p>
                    <p className="text-xs text-emerald-400 font-bold uppercase font-mono">Layanan: {courierService.toUpperCase()}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Rincian Biaya Transaksi</h4>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Cetak Kertas Concorde Premium + Stempel Basah</span>
                      <span className="text-white font-bold font-mono">Rp 10.000</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Tarif Pengiriman Kurir Lokal</span>
                      <span className="text-white font-bold font-mono">Rp 25.000</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Biaya Administrasi & Layanan FDBA Invoice Digital</span>
                      <span className="text-white font-bold font-mono">Rp 15.000</span>
                    </div>
                    <hr className="border-white/5 my-2" />
                    <div className="flex justify-between text-sm font-bold text-white">
                      <span>TOTAL BIAYA LAYANAN</span>
                      <span className="text-emerald-400 font-mono">Rp 50.000</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartCourierTracking}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <CreditCard size={18} /> Bayar & Kirim Invoice Fisik (Rp 50.000)
                  </button>
                </div>
              )}

              {/* Step 3: Courier Real-time Tracking */}
              {shippingStep === 3 && (
                <div className="space-y-6 text-center py-4">
                  <div className="flex justify-center mb-2">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 relative">
                      <Truck className="text-emerald-400 animate-bounce" size={32} />
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-white">Proses Percetakan & Pengiriman</h4>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden mb-4 border border-white/5">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                      style={{ width: `${trackingProgress}%` }}
                    />
                  </div>

                  {/* Status Text Box */}
                  <div className="bg-black/60 border border-white/10 rounded-2xl p-5 min-h-[80px] flex items-center justify-center">
                    <p className="text-xs text-emerald-400 leading-relaxed font-semibold italic">{trackingStatus}</p>
                  </div>

                  {trackingProgress === 100 ? (
                    <button
                      type="button"
                      onClick={() => setIsPrintModalOpen(false)}
                      className="w-full bg-gray-850 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl shadow-lg border border-white/10 transition-all hover:scale-[1.01]"
                    >
                      Tutup & Selesai
                    </button>
                  ) : (
                    <p className="text-[10px] text-gray-500 animate-pulse">Memperbarui status pengiriman secara real-time...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
