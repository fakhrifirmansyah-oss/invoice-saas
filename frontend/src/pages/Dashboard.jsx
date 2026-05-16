import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await api.delete(`/invoices/${id}`);
        setInvoices(invoices.filter(inv => inv.id !== id));
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading invoices...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Invoices</h1>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 mb-4">You don't have any invoices yet.</p>
          <Link to="/create" className="text-indigo-600 font-medium hover:underline">Create your first invoice</Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="py-3 px-4 font-medium">Invoice ID</th>
                <th className="py-3 px-4 font-medium">Client</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-500">#INV-{invoice.id.toString().padStart(4, '0')}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{invoice.client_name}</td>
                  <td className="py-3 px-4 text-gray-500">{new Date(invoice.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">${parseFloat(invoice.total).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link to={`/invoice/${invoice.id}`} className="inline-flex items-center justify-center text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-md transition-colors">
                      <Eye size={18} />
                    </Link>
                    <button onClick={() => handleDelete(invoice.id)} className="inline-flex items-center justify-center text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
