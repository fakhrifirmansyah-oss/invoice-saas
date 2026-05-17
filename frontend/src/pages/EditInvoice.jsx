import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Plus, Trash2, FileText, User, Mail, Phone, Calendar, ArrowLeft, Zap, DollarSign, StickyNote, Settings, Shield, Percent, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function EditInvoice({ invoiceData }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Basic Info
  const [clientName, setClientName] = useState(invoiceData?.client_name || '');
  const [clientEmail, setClientEmail] = useState(invoiceData?.client_email || '');
  const [clientPhone, setClientPhone] = useState(invoiceData?.client_phone || '');
  const [dueDate, setDueDate] = useState(
    invoiceData?.due_date ? new Date(invoiceData.due_date).toISOString().split('T')[0] : ''
  );
  const [notes, setNotes] = useState(invoiceData?.notes || '');

  // Invoice & Recurring Types
  const [invoiceType, setInvoiceType] = useState(invoiceData?.invoice_type || 'standard');
  const [recurringInterval, setRecurringInterval] = useState(invoiceData?.recurring_interval || 'none');

  // Indonesian e-Faktur compliant fields
  const [companyNpwp, setCompanyNpwp] = useState(invoiceData?.company_npwp || '');
  const [clientNpwp, setClientNpwp] = useState(invoiceData?.client_npwp || '');
  const [clientNik, setClientNik] = useState(invoiceData?.client_nik || '');
  const [taxCode, setTaxCode] = useState(invoiceData?.tax_code || '01');
  const [taxRate, setTaxRate] = useState(invoiceData?.tax_rate !== undefined ? Number(invoiceData.tax_rate) : 11);

  // Parse items correctly (deducting PPN if items stored in DB already include tax or standard subtotal)
  // Let's use the actual items returned by getInvoiceById
  const [items, setItems] = useState(invoiceData?.items || [{ description: '', quantity: 1, price: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate totals
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
  }, [items]);

  const calculatedTax = useMemo(() => {
    if (invoiceType === 'tax') {
      return subtotal * (Number(taxRate) / 100);
    }
    return 0;
  }, [subtotal, invoiceType, taxRate]);

  const grandTotal = subtotal + calculatedTax;

  const handleAddItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }]);
  const handleRemoveItem = (idx) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!clientName) return setError('Nama klien wajib diisi!');
    if (items.some(i => !i.description || i.price <= 0)) {
      return setError('Semua item harus punya deskripsi dan harga > 0.');
    }

    setLoading(true);
    try {
      const payload = {
        clientName,
        clientEmail,
        clientPhone,
        dueDate,
        notes,
        invoiceType,
        recurringInterval: invoiceType === 'recurring' ? recurringInterval : 'none',
        clientNik: invoiceType === 'tax' ? clientNik : null,
        taxCode: invoiceType === 'tax' ? taxCode : '01',
        companyNpwp: invoiceType === 'tax' ? companyNpwp : null,
        clientNpwp: invoiceType === 'tax' ? clientNpwp : null,
        taxRate: invoiceType === 'tax' ? taxRate : 0,
        items: items.map(i => ({
          ...i,
          quantity: Number(i.quantity),
          price: Number(i.price)
        }))
      };
      await api.put(`/invoices/${id}`, payload);
      navigate(`/invoice/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan perubahan.');
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-950 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all";
  const selectClass = "w-full bg-gray-950 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer";

  return (
    <div className="min-h-screen bg-[#030712] text-gray-300 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link to={`/invoice/${id}`} className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-amber-500/50 transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Edit Invoice</h1>
            <p className="text-gray-500 text-sm mt-0.5">Ubah detail invoice #{invoiceData?.invoice_number || `INV-${id}`}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-3.5 rounded-2xl text-sm font-medium flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Invoice Type & General Settings */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Settings size={16} className="text-amber-400" />
              </div>
              <h2 className="font-bold text-white text-lg">Pengaturan Invoice</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Jenis Invoice</label>
                <select value={invoiceType} onChange={(e) => setInvoiceType(e.target.value)} className={selectClass}>
                  <option value="standard">Standard Invoice</option>
                  <option value="proforma">Pro Forma Invoice</option>
                  <option value="tax">Faktur Pajak (Indonesian e-Faktur)</option>
                  <option value="receipt">Kwitansi Asli (Official Receipt)</option>
                  <option value="recurring">Recurring Invoice (Tagihan Berulang)</option>
                </select>
              </div>

              {invoiceType === 'recurring' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Interval Pengulangan</label>
                  <select value={recurringInterval} onChange={(e) => setRecurringInterval(e.target.value)} className={selectClass}>
                    <option value="none">Pilih interval...</option>
                    <option value="weekly">Setiap Minggu (Weekly)</option>
                    <option value="monthly">Setiap Bulan (Monthly)</option>
                    <option value="yearly">Setiap Tahun (Yearly)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Jatuh Tempo (Due Date)</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Indonesian e-Faktur Specific Fields */}
          {invoiceType === 'tax' && (
            <div className="bg-gradient-to-br from-amber-950/20 to-orange-950/20 backdrop-blur-xl border border-amber-500/25 rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-3">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-amber-500/30 flex items-center justify-center border border-amber-500/40">
                  <Shield size={16} className="text-amber-300" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg">Informasi e-Faktur & PPN</h2>
                  <p className="text-[10px] text-gray-500">Regulasi e-Faktur v4.0 DJP Indonesia</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">NPWP Perusahaan (Penjual)</label>
                  <input type="text" placeholder="Format: 15 / 16 digit" value={companyNpwp} onChange={(e) => setCompanyNpwp(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">NPWP Klien (Pembeli)</label>
                  <input type="text" placeholder="Opsional jika ada NPWP" value={clientNpwp} onChange={(e) => setClientNpwp(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">NIK Klien (Jika tidak ada NPWP)</label>
                  <input type="text" maxLength="16" placeholder="KTP 16 digit" value={clientNik} onChange={(e) => setClientNik(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Kode Transaksi</label>
                  <select value={taxCode} onChange={(e) => setTaxCode(e.target.value)} className={selectClass}>
                    <option value="01">01 - Penyerahan Normal B2B</option>
                    <option value="02">02 - Bendahara Pemerintah</option>
                    <option value="03">03 - BUMN / Badan Tertentu</option>
                    <option value="04">04 - DPP Nilai Lain</option>
                    <option value="05">05 - Penyerahan Turis Asing</option>
                    <option value="06">06 - Penyerahan Lainnya</option>
                    <option value="07">07 - PPN Tidak Dipungut</option>
                    <option value="08">08 - PPN Dibebaskan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tarif PPN (%)</label>
                  <input type="number" min="0" max="100" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {/* Client Info Card */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <User size={16} className="text-amber-400" />
              </div>
              <h2 className="font-bold text-white text-lg">Informasi Klien</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {invoiceType === 'receipt' ? 'Telah Diterima Dari (Client Name) *' : 'Nama Klien *'}
                </label>
                <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder={invoiceType === 'receipt' ? 'Nama lengkap pembayar/perusahaan' : 'PT. Maju Bersama'} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Klien</label>
                <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="billing@perusahaan.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nomor WhatsApp Klien</label>
                <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="081234567890" className={inputClass} />
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {invoiceType === 'receipt' ? 'Untuk Pembayaran (Purpose of Payment)' : 'Catatan Tambahan (Notes)'}
              </label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={invoiceType === 'receipt' ? 'Uraian lengkap peruntukan pembayaran (contoh: Pelunasan biaya pembuatan website SaaS FDBAtech)' : 'Syarat pembayaran, detail rekening bank, dll...'} rows="3" className="w-full bg-gray-950 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 resize-none transition-all" />
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <FileText size={16} className="text-purple-400" />
                </div>
                <h2 className="font-bold text-white text-lg">Item Tagihan</h2>
              </div>
              <span className="text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">{items.length} item</span>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-3 px-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <div className="col-span-5">Deskripsi</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-3">Harga (Rp)</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {items.map((item, index) => {
                const subtotalItem = Number(item.quantity) * Number(item.price);
                return (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center bg-gray-950/60 border border-white/5 rounded-2xl p-3 group hover:border-amber-500/20 transition-all">
                    <div className="col-span-5">
                      <input type="text" required placeholder="Nama layanan / produk" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full bg-transparent border border-white/10 rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-all" />
                    </div>
                    <div className="col-span-2">
                      <input type="number" required min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-full bg-transparent border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white text-center focus:outline-none focus:border-amber-500 transition-all" />
                    </div>
                    <div className="col-span-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">Rp</span>
                        <input type="number" required min="0" step="1000" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} className="w-full bg-transparent border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-all" />
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span className="text-xs font-bold text-emerald-400 font-mono">{subtotalItem > 0 ? `${(subtotalItem / 1000).toFixed(0)}K` : '-'}</span>
                      <button type="button" onClick={() => handleRemoveItem(index)} disabled={items.length === 1} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-20">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button type="button" onClick={handleAddItem} className="mt-4 w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/10 rounded-2xl text-gray-500 hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all text-sm font-semibold">
              <Plus size={16} /> Tambah Item
            </button>
          </div>

          {/* Pricing Summary Card */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Dasar Pengenaan Pajak (DPP)</span>
              <span className="font-mono text-white font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>

            {invoiceType === 'tax' && (
              <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3 animate-in fade-in">
                <span className="text-amber-400 font-semibold flex items-center gap-1.5"><Percent size={14} /> PPN ({taxRate}%)</span>
                <span className="font-mono text-amber-300 font-bold">Rp {calculatedTax.toLocaleString('id-ID')}</span>
              </div>
            )}

            {invoiceType === 'recurring' && (
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3 text-gray-500">
                <span className="flex items-center gap-1.5"><RefreshCw size={13} className="animate-spin text-purple-400" /> Siklus Berulang</span>
                <span className="font-bold uppercase tracking-wider text-purple-300">{recurringInterval}</span>
              </div>
            )}

            {grandTotal > 5000000 && (
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3 text-amber-400 font-bold">
                <span className="flex items-center gap-1.5">📦 Bea Materai Otomatis</span>
                <span>Aktif (Lunas)</span>
              </div>
            )}
          </div>

          {/* Submit Card */}
          <div className="bg-gradient-to-br from-amber-950/60 to-orange-950/40 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 shadow-2xl shadow-amber-900/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Total Tagihan (Grand Total)</p>
                <p className="text-4xl font-black text-white mt-1">Rp {grandTotal.toLocaleString('id-ID')}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/20">
                <DollarSign size={28} className="text-amber-400" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full relative group overflow-hidden bg-amber-600 hover:bg-amber-500 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-amber-900/40 hover:shadow-amber-700/50 hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2">
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan...</>
                ) : (
                  <><Zap size={18} />Simpan Perubahan</>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
