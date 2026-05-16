import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/invoices/${id}`);
        setInvoice(res.data);
      } catch (err) {
        setError('Invoice not found');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleMarkAsPaid = async () => {
    try {
      await api.patch(`/invoices/${id}/status`, { status: 'paid' });
      setInvoice({ ...invoice, status: 'paid' });
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!invoice) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={18} className="mr-1" /> Back
        </button>
        <div className="space-x-3">
          {invoice.status !== 'paid' && (
            <button 
              onClick={handleMarkAsPaid}
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <CheckCircle size={16} className="mr-2" /> Mark as Paid
            </button>
          )}
          <button 
            onClick={handlePrint}
            className="inline-flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Printer size={16} className="mr-2" /> Print
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-none print:p-0">
        <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">INVOICE</h1>
            <p className="text-gray-500">#{invoice.id.toString().padStart(4, '0')}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {invoice.status.toUpperCase()}
            </span>
            <p className="text-gray-600 text-sm"><span className="font-medium text-gray-800">Date:</span> {new Date(invoice.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Billed To</h3>
          <p className="text-lg font-medium text-gray-800">{invoice.client_name}</p>
          {invoice.client_email && <p className="text-gray-600">{invoice.client_email}</p>}
        </div>

        <table className="w-full text-left mb-8">
          <thead>
            <tr className="border-b-2 border-gray-200 text-gray-600 text-sm">
              <th className="py-3 font-semibold w-1/2">Description</th>
              <th className="py-3 font-semibold text-center w-1/6">Qty</th>
              <th className="py-3 font-semibold text-right w-1/6">Price</th>
              <th className="py-3 font-semibold text-right w-1/6">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-4 text-gray-800">{item.description}</td>
                <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                <td className="py-4 text-right text-gray-600">${parseFloat(item.price).toFixed(2)}</td>
                <td className="py-4 text-right text-gray-800 font-medium">
                  ${(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-1/2 md:w-1/3">
            <div className="flex justify-between border-t-2 border-gray-800 pt-3">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-bold text-xl text-indigo-600">${parseFloat(invoice.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm print:mt-8">
          <p>Thank you for your business.</p>
        </div>
      </div>
    </div>
  );
}
