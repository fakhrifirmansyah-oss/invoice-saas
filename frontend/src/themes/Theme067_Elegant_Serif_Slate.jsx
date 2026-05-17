import React from 'react';

export default function Theme067_Elegant_Serif_Slate({ invoice }) {
  if (!invoice || !invoice.items) return null;
  return (
    
    <div className="max-w-4xl mx-auto p-16 bg-[#faf9f6] text-gray-900 border border-[#d4af37] shadow-lg" style={{fontFamily: 'Georgia, serif'}}>
      <div className="text-center mb-16">
        <div className="w-16 h-16 mx-auto border-2 border-[#d4af37] flex items-center justify-center text-2xl text-[#d4af37] mb-4">F</div>
        <h1 className="text-3xl tracking-[0.3em] uppercase">Invoice</h1>
      </div>
      <div className="flex justify-between mb-12 border-y border-gray-300 py-6">
        <div><i className="text-gray-500">Billed To:</i><br/><span className="text-lg">{invoice.client_name}</span></div>
        <div className="text-right"><i className="text-gray-500">Amount:</i><br/><span className="text-2xl font-bold">${invoice.total}</span></div>
      </div>
      <ul className="space-y-6">
        {invoice.items.map(i => (
          <li key={i.id} className="flex justify-between items-end border-b border-gray-200 pb-2">
            <span className="text-lg">{i.description}</span><span className="italic">${i.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}