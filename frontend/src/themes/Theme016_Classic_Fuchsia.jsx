import React from 'react';

export default function Theme016_Classic_Fuchsia({ invoice }) {
  if (!invoice || !invoice.items) return null;
  return (
    
    <div className="max-w-4xl mx-auto p-12 bg-white border-2 border-gray-900">
      <div className="flex justify-between border-b-4 border-gray-900 pb-6 mb-8">
        <div><h1 className="text-4xl font-black uppercase">FAKTUR</h1><p>NO: {invoice.id}</p></div>
        <div className="text-right"><h2 className="text-2xl font-bold">FDBAtech</h2><p>NPWP: 01.234.567.8</p></div>
      </div>
      <div className="mb-8 p-4 border border-gray-400"><strong>Ke:</strong> {invoice.client_name}</div>
      <table className="w-full text-left border-collapse border-2 border-gray-900 mb-8">
        <thead className="bg-gray-200"><tr><th className="border border-gray-900 p-2">Deskripsi</th><th className="border border-gray-900 p-2 text-right">Harga</th></tr></thead>
        <tbody>
          {invoice.items.map(i => <tr key={i.id}><td className="border border-gray-900 p-2">{i.description}</td><td className="border border-gray-900 p-2 text-right">${i.price}</td></tr>)}
        </tbody>
      </table>
      <div className="flex justify-end"><h3 className="text-2xl font-bold bg-fuchsia-100 p-4 border-2 border-gray-900">TOTAL: ${invoice.total}</h3></div>
    </div>
  );
}