import React from 'react';

export default function Theme089_Playful_Pop_Violet({ invoice }) {
  if (!invoice || !invoice.items) return null;
  return (
    
    <div className="max-w-4xl mx-auto p-8 bg-violet-50 border-[10px] border-violet-400 rounded-[3rem] text-gray-800">
      <h1 className="text-5xl font-black text-violet-600 mb-8 transform -rotate-2">YAY! IT'S AN INVOICE! 🎉</h1>
      <div className="bg-white p-6 rounded-3xl shadow-xl mb-8 transform rotate-1">
        <p className="text-xl font-bold">For: {invoice.client_name}</p>
        <p className="text-4xl font-black text-violet-500 mt-2">Total: ${invoice.total}</p>
      </div>
      <div className="space-y-4">
        {invoice.items.map(i => (
          <div key={i.id} className="bg-white p-4 rounded-2xl flex justify-between shadow-sm border-2 border-violet-100">
            <span className="font-bold">{i.description}</span>
            <span className="bg-violet-100 px-3 py-1 rounded-full font-bold">${i.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}