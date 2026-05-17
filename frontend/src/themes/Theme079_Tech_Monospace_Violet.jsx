import React from 'react';

export default function Theme079_Tech_Monospace_Violet({ invoice }) {
  if (!invoice || !invoice.items) return null;
  return (
    
    <div className="max-w-4xl mx-auto p-8 bg-black text-violet-500 font-mono border-2 border-violet-500 rounded">
      <div className="border-b-2 border-violet-500 pb-4 mb-8">
        <h1 className="text-2xl">> FDBATECH_SYSTEM_INVOICE</h1>
        <p className="text-sm">STATUS: {invoice.status.toUpperCase()}</p>
      </div>
      <div className="mb-8 p-4 bg-violet-900/30">
        <p>> TARGET_ENTITY: {invoice.client_name}</p>
        <p>> PAYLOAD_VALUE: ${invoice.total}</p>
      </div>
      <table className="w-full text-left">
        <thead><tr className="border-b border-violet-500"><th>EXEC_ID</th><th>OP_DESC</th><th>VAL</th></tr></thead>
        <tbody>
          {invoice.items.map((i, idx) => <tr key={i.id}><td>0x0{idx}</td><td>{i.description}</td><td>${i.price}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}