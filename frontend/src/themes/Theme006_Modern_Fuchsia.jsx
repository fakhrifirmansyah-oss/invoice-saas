import React from 'react';

export default function Theme006_Modern_Fuchsia({ invoice }) {
  if (!invoice || !invoice.items) return null;
  return (
    
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-2xl shadow-xl shadow-fuchsia-100 border border-fuchsia-50">
      <div className="flex justify-between mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">F</div>
        <div className="text-right"><h1 className="text-3xl font-bold text-gray-800">Invoice</h1><p className="text-fuchsia-500 font-medium">#{invoice.id}</p></div>
      </div>
      <div className="bg-fuchsia-50 p-6 rounded-xl mb-8"><p className="text-sm text-fuchsia-600 font-bold uppercase">Billed To</p><p className="text-xl font-bold text-gray-900">{invoice.client_name}</p></div>
      <div className="space-y-3 mb-8">
        {invoice.items.map(i => (
          <div key={i.id} className="flex justify-between p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
            <span className="font-medium text-gray-700">{i.description}</span><span className="font-bold text-gray-900">${i.price}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 rounded-xl text-white">
        <span className="text-lg font-medium">Amount Due</span><span className="text-3xl font-black">${invoice.total}</span>
      </div>
    </div>
  );
}