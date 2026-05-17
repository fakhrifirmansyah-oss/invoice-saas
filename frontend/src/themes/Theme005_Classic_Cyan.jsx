import React from 'react';

export default function Theme005_Classic_Cyan({ invoice }) {
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

      <div className="mb-10 bg-cyan-50 border border-cyan-200 p-4 rounded text-center">
         <p className="font-bold text-cyan-800">Terbilang (Say in Words):</p>
         <p className="text-lg font-black uppercase text-cyan-900 border-b-2 border-cyan-900 inline-block pb-1">
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
    </div>
  );
}