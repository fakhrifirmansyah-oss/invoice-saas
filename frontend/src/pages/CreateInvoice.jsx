import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
  }, [items]);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!clientName) return setError('Client name is required');
    if (items.some(i => !i.description || i.price <= 0)) {
      return setError('All items must have a description and price > 0');
    }

    setLoading(true);
    try {
      const payload = {
        clientName,
        clientEmail,
        items: items.map(i => ({
          ...i,
          quantity: Number(i.quantity),
          price: Number(i.price)
        }))
      };
      
      const res = await api.post('/invoices', payload);
      navigate(`/invoice/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create invoice');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Create New Invoice</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="billing@acme.com"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-800">Items</h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-1 border border-gray-200">
            <div className="grid grid-cols-12 gap-2 p-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-3">Price</div>
              <div className="col-span-1"></div>
            </div>
            
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border border-gray-100 shadow-sm">
                  <div className="col-span-6">
                    <input
                      type="text"
                      required
                      placeholder="Item description"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-400 hover:text-red-600 p-1"
                      disabled={items.length === 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-3">
            <button
              type="button"
              onClick={handleAddItem}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add Item
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 mt-8 flex justify-end">
          <div className="w-full md:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Total:</span>
              <span className="text-2xl font-bold text-gray-800">${total.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 font-medium transition-colors disabled:opacity-70"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
