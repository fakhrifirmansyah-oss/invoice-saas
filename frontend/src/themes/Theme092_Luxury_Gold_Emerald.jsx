import React from 'react';

export default function Theme092_Luxury_Gold_Emerald({ invoice }) {
  if (!invoice || !invoice.items) return null;
  return (
    
    <div className="max-w-4xl mx-auto p-12 bg-[#0a0a0a] text-gray-300 border border-[#b8860b]">
      <div className="text-center mb-12 border-b border-[#b8860b] pb-8">
        <h1 className="text-3xl text-[#b8860b] tracking-widest uppercase mb-2">F D B A t e c h</h1>
        <p className="text-xs uppercase tracking-widest">Premium Services</p>
      </div>
      <div className="flex justify-between mb-16 text-sm">
        <div><span className="text-[#b8860b] uppercase">Prepared For</span><br/><span className="text-white text-lg">{invoice.client_name}</span></div>
        <div className="text-right"><span className="text-[#b8860b] uppercase">Total Investment</span><br/><span className="text-white text-2xl">${invoice.total}</span></div>
      </div>
      <div className="space-y-4">
        {invoice.items.map(i => (
          <div key={i.id} className="flex justify-between items-center py-3 border-b border-gray-800">
            <span className="text-gray-400">{i.description}</span><span className="text-[#b8860b]">${i.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}