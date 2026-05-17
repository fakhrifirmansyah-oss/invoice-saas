import React from 'react';

export default function Theme018_Modern_Blue({ invoice }) {
  if (!invoice || !invoice.items) return null;
  
  const subtotal = parseFloat(invoice.total);
  const taxRate = 0.11; // PPN 11%
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount;
  const requiresMaterai = grandTotal > 5000000;
  
  // LOGIKA STATUS: Invoice vs Bukti Pembayaran (Receipt)
  const isPaid = invoice.status === 'paid';
  const docTitle = isPaid ? 'OFFICIAL RECEIPT' : 'TAX INVOICE';
  const docSubtitle = isPaid ? 'BUKTI PEMBAYARAN SAH' : 'FAKTUR TAGIHAN';

  return (
    
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-2xl shadow-xl shadow-blue-100 border border-blue-50 relative overflow-hidden">
      {/* Watermark Lunas */}
      {isPaid && (
        <div className="absolute top-1/4 left-1/4 transform -rotate-12 text-[120px] font-black text-emerald-500 opacity-[0.03] pointer-events-none">
          PAID IN FULL
        </div>
      )}

      <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
        <div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">F</div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{docTitle}</h1>
          <p className="text-gray-500 font-mono mt-1">{isPaid ? 'REC' : 'INV'}-{(Math.random()*10000).toFixed(0).padStart(5,'0')}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">FDBAtech Global</h2>
          <p className="text-sm text-gray-500">VAT Reg / NPWP: 01.234.567.8</p>
          {!isPaid ? (
            <div className="mt-4 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold inline-block border border-blue-100">
              DUE: 14 DAYS
            </div>
          ) : (
            <div className="mt-4 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold inline-block border border-emerald-100">
              STATUS: PAID
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <p className="text-xs text-gray-400 font-bold uppercase mb-2">{isPaid ? 'Received From' : 'Billed To'}</p>
          <p className="text-xl font-bold text-gray-900 uppercase">{invoice.client_name}</p>
          <p className="text-sm text-gray-600 mt-1">NPWP: 09.876.543.2</p>
        </div>
        <div className={`p-6 rounded-xl text-white shadow-lg flex flex-col justify-center items-end ${isPaid ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200/50' : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200/50'}`}>
          <p className="text-sm font-medium uppercase tracking-wider mb-1 opacity-90">{isPaid ? 'Amount Received' : 'Total Amount Due'}</p>
          <p className="text-4xl font-black">Rp {grandTotal.toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold text-center">Qty</th>
              <th className="p-4 font-semibold text-right">Price</th>
              <th className="p-4 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoice.items.map(i => (
              <tr key={i.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{i.description}</td>
                <td className="p-4 text-center text-gray-600">{i.quantity}</td>
                <td className="p-4 text-right text-gray-600">Rp {(i.price).toLocaleString('id-ID')}</td>
                <td className="p-4 text-right font-bold text-gray-900">Rp {(i.price * i.quantity).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-8">
        <div className="w-full sm:w-1/2">
           <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mb-6">
              <p className="text-xs font-bold text-blue-600 uppercase mb-2">Terbilang (Say in Words)</p>
              <p className="font-black text-gray-800 uppercase">[ TERBILANG OTOMATIS OLEH SISTEM ]</p>
           </div>
           <div>
             {!isPaid ? (
               <>
                 <p className="font-bold text-gray-900 text-sm mb-2">Payment Details</p>
                 <p className="text-sm text-gray-600">Bank BCA: 123-456-7890<br/>A/N FDBAtech Global</p>
               </>
             ) : (
               <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                 <p className="font-bold text-emerald-800 text-sm mb-1">Transaction Completed</p>
                 <p className="text-sm text-emerald-600">This document serves as an official receipt. No further action is required.</p>
               </div>
             )}
           </div>
        </div>

        <div className="w-full sm:w-1/3 space-y-3">
          <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span></div>
          <div className="flex justify-between text-sm text-blue-600 font-bold"><span>Tax / PPN (11%)</span><span>Rp {taxAmount.toLocaleString('id-ID')}</span></div>
          <div className="pt-4 border-t border-gray-200 flex justify-between items-center mt-2">
            <span className="font-bold text-gray-900">{isPaid ? 'TOTAL PAID' : 'GRAND TOTAL'}</span>
            <span className={`font-black text-2xl ${isPaid ? 'text-emerald-600' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800'}`}>
              Rp {grandTotal.toLocaleString('id-ID')}
            </span>
          </div>
          {isPaid && (
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
               <span className="font-bold text-gray-500">Balance Due</span>
               <span className="font-black text-gray-400">Rp 0</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 border-t border-gray-100 pt-8 flex justify-between items-end">
        <p className="text-xs text-gray-400 font-medium">Auto-generated by FDBAtech Enterprise</p>
        <div className="text-center w-48 relative">
          <p className="mb-16 font-bold text-gray-800">Authorized Signature</p>
          {requiresMaterai && (
             <div className="absolute bottom-6 left-4 border-2 border-dashed border-blue-400 w-16 h-20 flex items-center justify-center text-[10px] text-blue-500 font-bold text-center bg-blue-50/50 transform rotate-[3deg]">
               E-MATERAI<br/>10000
             </div>
          )}
          <div className="border-b-2 border-gray-800 mb-1"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Finance Dept.</p>
        </div>
      </div>
    </div>
  );
}