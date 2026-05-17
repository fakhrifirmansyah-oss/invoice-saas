import React from 'react';

export default function Theme050_Retail_Receipt_Orange({ invoice }) {
  if (!invoice || !invoice.items) return null;
  return (
    
    <div className="max-w-sm mx-auto p-6 bg-amber-50 text-gray-800 font-mono text-xs border-x border-y border-dashed border-gray-400 shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold uppercase mb-1">FDBAtech Store</h1>
        <p>123 Receipt Lane, NY</p>
        <p>--------------------------------</p>
      </div>
      <p>CASHIER: 01</p>
      <p>CUSTOMER: {invoice.client_name}</p>
      <p>--------------------------------</p>
      <div className="mb-4">
        {invoice.items.map(i => (
          <div key={i.id} className="flex justify-between my-1">
            <span>{i.quantity}x {i.description.substring(0,10)}</span><span>${i.price}</span>
          </div>
        ))}
      </div>
      <p>--------------------------------</p>
      <div className="flex justify-between text-base font-bold my-2"><span>TOTAL</span><span>${invoice.total}</span></div>
      <div className="text-center mt-8 text-[10px]"><p>*** THANK YOU ***</p></div>
    </div>
  );
}