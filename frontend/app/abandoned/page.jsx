'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  AlertCircle, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Sparkles,
  Plus
} from 'lucide-react';

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [notification, setNotification] = useState('');
  const [selectedLang, setSelectedLang] = useState('English');

  // New Cart simulation
  const [newPhone, setNewPhone] = useState('9876500003');
  const [newCartValue, setNewCartValue] = useState('1499');
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [simulating, setSimulating] = useState(false);

  const fetchCartsAndProducts = async () => {
    setLoading(true);
    try {
      const companyId = localStorage.getItem('companyId') || '';
      const [cRes, pRes] = await Promise.all([
        api.get(`/orders/abandoned/list${companyId ? `?companyId=${companyId}` : ''}`),
        api.get(`/products/list${companyId ? `?companyId=${companyId}` : ''}`)
      ]);
      setCarts(cRes.data);
      setProducts(pRes.data);
      if (pRes.data.length > 0 && !selectedProductId) {
        setSelectedProductId(pRes.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartsAndProducts();
  }, []);

  // button Send WhatsApp Now -> POST /api/whatsapp/abandoned
  const handleSendWhatsAppNow = async (cartId) => {
    setDispatchingId(cartId);
    try {
      const res = await api.post('/whatsapp/abandoned', {
        abandonedCartId: cartId,
        language: selectedLang
      });
      setNotification(`WhatsApp recovery message dispatched! Preview: "${res.data.details?.message}"`);
      fetchCartsAndProducts();
    } catch (err) {
      console.error(err);
      setNotification('Failed to dispatch WhatsApp recovery message.');
    } finally {
      setDispatchingId(null);
    }
  };

  // Simulate new Abandoned Cart: POST /orders/abandoned/check
  const handleSimulateAbandoned = async (e) => {
    e.preventDefault();
    setSimulating(true);
    try {
      const companyId = localStorage.getItem('companyId') || '';
      await api.post('/orders/abandoned/check', {
        companyId,
        phone: newPhone,
        productId: selectedProductId,
        cartValue: Number(newCartValue)
      });
      setNotification('New abandoned cart detected and queued for recovery!');
      fetchCartsAndProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Abandoned Cart Recovery Engine
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated 0, 1, 3 day recovery loop with instant UPI deep links & WhatsApp Cloud API.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <span className="text-[11px] text-slate-400 px-2">Language:</span>
            {['English', 'Marathi', 'Hindi'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  selectedLang === lang 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={fetchCartsAndProducts}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-slate-400 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* Abandoned Cart Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-semibold text-white">
              Abandoned Carts ({carts.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Reminder Days: [0, 1, 3]</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Cart ID / Created</th>
                <th className="py-3 px-4">Customer Phone</th>
                <th className="py-3 px-4">Item Left Behind</th>
                <th className="py-3 px-4">Cart Value</th>
                <th className="py-3 px-4">Recovery Status</th>
                <th className="py-3 px-4 text-right">Instant Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {carts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No abandoned carts recorded. Use the simulator below to test one!
                  </td>
                </tr>
              ) : (
                carts.map((c) => {
                  const product = c.productId || {};
                  return (
                    <tr key={c._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono">
                        <div className="text-slate-300 font-semibold">#{c._id.substring(c._id.length - 8)}</div>
                        <div className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-200">
                        <div className="flex items-center space-x-1.5">
                          <Smartphone className="h-3.5 w-3.5 text-slate-500" />
                          <span>{c.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">
                        {product.title || 'Product Item'}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                        ₹{c.cartValue?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase flex items-center w-max gap-1 ${
                          c.recovered 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${c.recovered ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
                          {c.recovered ? 'Recovered' : 'Pending Recovery'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {/* button Send WhatsApp Now */}
                        <button
                          onClick={() => handleSendWhatsAppNow(c._id)}
                          disabled={dispatchingId === c._id}
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg shadow-md shadow-emerald-500/20 transition-all text-xs font-medium inline-flex items-center space-x-1.5 disabled:opacity-50"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>{dispatchingId === c._id ? 'Sending...' : 'Send WhatsApp Now'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulator Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Plus className="h-5 w-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-white">Simulate Abandoned Cart (POST /api/orders/abandoned/check)</h2>
        </div>

        <form onSubmit={handleSimulateAbandoned} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Customer Phone</label>
            <input
              type="text"
              required
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
            >
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title} (₹{p.price})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Cart Value (₹)</label>
            <input
              type="number"
              required
              value={newCartValue}
              onChange={(e) => setNewCartValue(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={simulating}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-lg shadow-indigo-500/25 transition-all"
          >
            {simulating ? 'Recording...' : 'Register Drop-off'}
          </button>
        </form>
      </div>
    </div>
  );
}
