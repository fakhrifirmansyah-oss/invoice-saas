import React from 'react';

export default function Theme055_Corporate_Bold_Cyan({ invoice }) {
  if (!invoice || !invoice.items) return null;
  return (
    
    <div className="max-w-5xl mx-auto bg-white border-t-[20px] border-cyan-700 shadow-2xl">
      <div className="p-12 flex justify-between bg-gray-50">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">INVOICE</h1>
        <div className="text-right">
          <p className="text-2xl font-bold text-cyan-700">FDBAtech Inc.</p>
          <p className="text-sm text-gray-500">BILL TO: {invoice.client_name}</p>
        </div>
      </div>
      <div className="p-12">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-white"><tr><th className="p-4">ITEM</th><th className="p-4 text-right">TOTAL</th></tr></thead>
          <tbody>
            {invoice.items.map(i => <tr key={i.id} className="border-b"><td className="p-4 font-medium">{i.description}</td><td className="p-4 text-right font-bold">${i.price}</td></tr>)}
          </tbody>
        </table>
        <div className="mt-8 flex justify-end"><div className="w-1/3 bg-cyan-50 p-6 rounded text-right"><p className="text-sm">BALANCE DUE</p><p className="text-4xl font-black text-cyan-700">${invoice.total}</p></div></div>
      </div>
    </div>
  );
}