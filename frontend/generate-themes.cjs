const fs = require('fs');
const path = require('path');

const colors = {
  Indigo: 'indigo', Emerald: 'emerald', Rose: 'rose', 
  Amber: 'amber', Cyan: 'cyan', Fuchsia: 'fuchsia', 
  Slate: 'slate', Blue: 'blue', Violet: 'violet', Orange: 'orange'
};

const themesDir = path.join(__dirname, 'src', 'themes');
if (!fs.existsSync(themesDir)) fs.mkdirSync(themesDir, { recursive: true });

let themeCount = 1;
let exportsList = [];

// Helper to inject calculation and status logic
const logicString = `
  const subtotal = parseFloat(invoice.total);
  const taxRate = 0.11; // PPN 11%
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount;
  const requiresMaterai = grandTotal > 5000000;
  
  // LOGIKA STATUS: Invoice vs Bukti Pembayaran (Receipt)
  const isPaid = invoice.status === 'paid';
  const docTitle = isPaid ? 'OFFICIAL RECEIPT' : 'TAX INVOICE';
  const docSubtitle = isPaid ? 'BUKTI PEMBAYARAN SAH' : 'FAKTUR TAGIHAN';
`;

const generateLayout = (layoutName, colorClass) => {
  const c = colorClass;
  
  if (layoutName === 'Classic') return `
    <div className="max-w-4xl mx-auto p-12 bg-white border-2 border-gray-900 font-sans text-sm relative overflow-hidden">
      {/* Watermark Lunas */}
      {isPaid && (
        <div className="absolute top-1/3 left-1/4 transform -rotate-45 text-[150px] font-black text-green-500 opacity-10 pointer-events-none">
          LUNAS
        </div>
      )}

      <div className="flex justify-between border-b-4 border-gray-900 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-widest text-gray-900">{docSubtitle}</h1>
          <p className="font-bold mt-2">NO: {isPaid ? 'REC' : 'INV'}/FDBA/{invoice.id.toString().padStart(5, '0')}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-900 uppercase">PT FDBAtech Global Nusantara</h2>
          <p>NPWP: 01.234.567.8-901.000</p>
          <p>Jakarta, Indonesia</p>
        </div>
      </div>
      
      <div className="mb-8 p-4 border border-gray-400 bg-gray-50 flex justify-between">
        <div>
          <p className="font-bold underline mb-1">{isPaid ? 'Telah Terima Dari / Received From:' : 'Kepada Yth. / Billed To:'}</p>
          <p className="text-lg font-bold uppercase">{invoice.client_name}</p>
          <p>NPWP Klien: 09.876.543.2-100.000</p>
        </div>
        <div className="text-right">
          <p><strong>Tgl Terbit:</strong> {new Date().toLocaleDateString('id-ID')}</p>
          {!isPaid && <p><strong>Jatuh Tempo:</strong> Net 14 Days</p>}
          {isPaid && <p className="text-green-600 font-bold">STATUS: TELAH DIBAYAR LUNAS</p>}
        </div>
      </div>

      <table className="w-full text-left border-collapse border-2 border-gray-900 mb-6">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="border border-gray-900 p-3 w-12 text-center">No</th>
            <th className="border border-gray-900 p-3">Deskripsi Barang / Jasa</th>
            <th className="border border-gray-900 p-3 text-center w-20">Qty</th>
            <th className="border border-gray-900 p-3 text-right w-32">Harga (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((i, idx) => (
            <tr key={i.id}>
              <td className="border border-gray-900 p-3 text-center">{idx + 1}</td>
              <td className="border border-gray-900 p-3 font-medium">{i.description}</td>
              <td className="border border-gray-900 p-3 text-center">{i.quantity}</td>
              <td className="border border-gray-900 p-3 text-right">{(i.price * i.quantity).toLocaleString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col items-end mb-8">
        <div className="w-1/2 border-2 border-gray-900">
          <div className="flex justify-between p-2 border-b border-gray-900"><span>Dasar Pengenaan Pajak (DPP):</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
          <div className="flex justify-between p-2 border-b border-gray-900"><span>PPN (11%):</span><span>Rp {taxAmount.toLocaleString('id-ID')}</span></div>
          <div className="flex justify-between p-3 bg-gray-200 text-xl font-bold"><span>GRAND TOTAL:</span><span>Rp {grandTotal.toLocaleString('id-ID')}</span></div>
        </div>
      </div>

      <div className="mb-10 bg-${c}-50 border border-${c}-200 p-4 rounded text-center">
         <p className="font-bold text-${c}-800">Terbilang (Say in Words):</p>
         <p className="text-lg font-black uppercase text-${c}-900 border-b-2 border-${c}-900 inline-block pb-1">
           [ TERBILANG OTOMATIS OLEH SISTEM ]
         </p>
      </div>

      <div className="flex justify-between items-end mt-16">
        <div className="w-1/2 text-xs text-gray-600">
          {!isPaid ? (
             <>
               <strong>Instruksi Pembayaran:</strong><br/>
               Transfer ke Bank BCA Cab. Sudirman<br/>
               A/N PT FDBAtech Global Nusantara<br/>
               A/C: 123-456-7890<br/>
               *Keterlambatan dikenakan denda 1% per hari.
             </>
          ) : (
             <div className="border-l-4 border-green-500 pl-3">
               <strong className="text-green-700 text-sm">PEMBAYARAN DITERIMA</strong><br/>
               Terima kasih atas pembayaran Anda.<br/>
               Dokumen ini adalah bukti sah penerimaan dana.
             </div>
          )}
        </div>
        <div className="text-center w-64 relative">
          <p className="mb-20 font-bold">{isPaid ? 'Penerima / Receiver,' : 'Hormat Kami,'}</p>
          {requiresMaterai && (
             <div className="absolute bottom-6 left-8 border-2 border-dashed border-red-400 w-16 h-20 flex items-center justify-center text-[10px] text-red-500 font-bold text-center bg-red-50/50 transform rotate-[-5deg]">
               MATERAI<br/>10000
             </div>
          )}
          <p className="font-bold uppercase underline">Direktur Keuangan</p>
          <p className="text-xs">FDBAtech Nusantara</p>
        </div>
      </div>
    </div>`;

  // Default Modern Layout
  return `
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-2xl shadow-xl shadow-${c}-100 border border-${c}-50 relative overflow-hidden">
      {/* Watermark Lunas */}
      {isPaid && (
        <div className="absolute top-1/4 left-1/4 transform -rotate-12 text-[120px] font-black text-emerald-500 opacity-[0.03] pointer-events-none">
          PAID IN FULL
        </div>
      )}

      <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
        <div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-${c}-400 to-${c}-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">F</div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{docTitle}</h1>
          <p className="text-gray-500 font-mono mt-1">{isPaid ? 'REC' : 'INV'}-{(Math.random()*10000).toFixed(0).padStart(5,'0')}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">FDBAtech Global</h2>
          <p className="text-sm text-gray-500">VAT Reg / NPWP: 01.234.567.8</p>
          {!isPaid ? (
            <div className="mt-4 px-4 py-1.5 bg-${c}-50 text-${c}-700 rounded-full text-sm font-bold inline-block border border-${c}-100">
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
        <div className={\`p-6 rounded-xl text-white shadow-lg flex flex-col justify-center items-end \${isPaid ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200/50' : 'bg-gradient-to-br from-${c}-500 to-${c}-600 shadow-${c}-200/50'}\`}>
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
           <div className="bg-${c}-50/50 p-5 rounded-xl border border-${c}-100 mb-6">
              <p className="text-xs font-bold text-${c}-600 uppercase mb-2">Terbilang (Say in Words)</p>
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
          <div className="flex justify-between text-sm text-${c}-600 font-bold"><span>Tax / PPN (11%)</span><span>Rp {taxAmount.toLocaleString('id-ID')}</span></div>
          <div className="pt-4 border-t border-gray-200 flex justify-between items-center mt-2">
            <span className="font-bold text-gray-900">{isPaid ? 'TOTAL PAID' : 'GRAND TOTAL'}</span>
            <span className={\`font-black text-2xl \${isPaid ? 'text-emerald-600' : 'text-transparent bg-clip-text bg-gradient-to-r from-${c}-600 to-${c}-800'}\`}>
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
             <div className="absolute bottom-6 left-4 border-2 border-dashed border-${c}-400 w-16 h-20 flex items-center justify-center text-[10px] text-${c}-500 font-bold text-center bg-${c}-50/50 transform rotate-[3deg]">
               E-MATERAI<br/>10000
             </div>
          )}
          <div className="border-b-2 border-gray-800 mb-1"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Finance Dept.</p>
        </div>
      </div>
    </div>`;
};

const layouts = ['Classic', 'Modern'];

layouts.forEach(layout => {
  Object.keys(colors).forEach(colorName => {
    const colorClass = colors[colorName];
    const themeName = `Theme${String(themeCount).padStart(3, '0')}_${layout}_${colorName}`;
    
    const fileContent = `
import React from 'react';

export default function ${themeName}({ invoice }) {
  if (!invoice || !invoice.items) return null;
  ${logicString}
  return (
    ${generateLayout(layout, colorClass)}
  );
}
`;
    fs.writeFileSync(path.join(themesDir, `${themeName}.jsx`), fileContent.trim());
    exportsList.push(`export { default as ${themeName} } from './${themeName}';`);
    themeCount++;
  });
});

fs.writeFileSync(path.join(themesDir, 'index.js'), exportsList.join('\n'));
console.log("SELESAI! Logika Invoice vs Receipt (Bukti Pembayaran) telah ditambahkan.");
