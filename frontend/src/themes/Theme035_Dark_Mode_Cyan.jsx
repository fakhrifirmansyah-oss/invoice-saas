import React from 'react';

export default function Theme035_Dark_Mode_Cyan({ invoice }) {
  if (!invoice || !invoice.items) return null;
  return (
    
    <div className="max-w-4xl mx-auto p-10 bg-gray-900 text-gray-100 rounded-xl shadow-2xl border border-cyan-500/30">
      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600 mb-8">FDBATECH_</h2>
      <div className="grid grid-cols-2 gap-8 mb-8 p-6 bg-gray-800 rounded-lg">
        <div><p className="text-cyan-400 text-xs uppercase">Client ID</p><p className="text-xl font-mono">{invoice.client_name}</p></div>
        <div className="text-right"><p className="text-cyan-400 text-xs uppercase">Amount Due</p><p className="text-4xl font-black">${invoice.total}</p></div>
      </div>
      <table className="w-full text-left font-mono text-sm">
        <thead className="text-cyan-400 border-b border-gray-700"><tr><th className="py-2">Item</th><th className="py-2 text-right">Cost</th></tr></thead>
        <tbody>
          {invoice.items.map(i => <tr key={i.id} className="border-b border-gray-800"><td className="py-4">{i.description}</td><td className="py-4 text-right">${i.price}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}