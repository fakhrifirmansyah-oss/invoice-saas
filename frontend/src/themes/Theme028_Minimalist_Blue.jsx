import React from 'react';

export default function Theme028_Minimalist_Blue({ invoice }) {
  if (!invoice || !invoice.items) return null;
  return (
    
    <div className="max-w-3xl mx-auto p-12 bg-white text-gray-800 font-sans tracking-wide">
      <h1 className="text-6xl font-light mb-12 text-blue-500 border-b pb-4">INVOICE.</h1>
      <div className="flex justify-between mb-20 text-sm">
        <div><p className="text-gray-400 uppercase">To</p><p className="text-xl">{invoice.client_name}</p></div>
        <div className="text-right"><p className="text-gray-400 uppercase">Total</p><p className="text-3xl font-bold">${invoice.total}</p></div>
      </div>
      <div className="space-y-4">
        {invoice.items.map(i => (
          <div key={i.id} className="flex justify-between border-b py-4">
            <span>{i.description} (x{i.quantity})</span>
            <span className="font-medium">${i.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}