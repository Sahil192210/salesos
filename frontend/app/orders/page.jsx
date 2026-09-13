'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  ShoppingCart, 
  Truck, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  X
} from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shippingOrderId, setShippingOrderId] = useState(null);
  const [messagingOrderId, setMessagingOrderId] = useState(null);
  const [notification, setNotification] = useState('');
  
  // New Order Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('Ananya Sen');
  const [newPhone, setNewPhone] = useState('9830012345');
  const [newProductId, setNewProductId] = useState('');
  const [newQty, setNewQty] = useState('1');
  const [newPaymentMode, setNewPaymentMode] = useState('COD');
  const [creating, setCreating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const companyId = localStorage.getItem('companyId') || '';
      const [orderRes, prodRes] = await Promise.all([
        api.get(`/orders/list${companyId ? `?companyId=${companyId}` : ''}`),
        api.get(`/products/list${companyId ? `?companyId=${companyId}` : ''}`)
      ]);
      setOrders(orderRes.data);
      setProducts(prodRes.data);
      if (prodRes.data.length > 0 && !newProductId) {
        setNewProductId(prodRes.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // button Mark Shipped -> Shiprocket API
  const handleMarkShipped = async (orderId) => {
    setShippingOrderId(orderId);
    try {
      const res = await api.post('/orders/shiprocket/ship', { orderId });
      setNotification(`Shiprocket AWB Generated: ${res.data.shiprocketAwb}. Order status set to Shipped!`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setNotification('Failed to ship order via Shiprocket.');
    } finally {
      setShippingOrderId(null);
    }
  };

  // button Send Invoice WhatsApp
  const handleSendInvoiceWhatsApp = async (order) => {
    setMessagingOrderId(order._id);
    try {
      await api.post('/whatsapp/invoice', {
        orderId: order._id,
        phone: order.phone,
        total: order.total
      });
      setNotification(`Invoice WhatsApp dispatched to ${order.phone}!`);
    } catch (err) {
      console.error(err);
      setNotification('Failed to send invoice WhatsApp.');
    } finally {
      setMessagingOrderId(null);
    }
  };

  // POST /api/orders/create - create order with RTO score
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const companyId = localStorage.getItem('companyId') || '';
      await api.post('/orders/create', {
        companyId,
        customerName: newCustomerName,
        phone: newPhone,
        paymentMode: newPaymentMode,
        items: [
          { productId: newProductId, qty: Number(newQty) }
        ]
      });
      setNotification('New order created successfully with automated RTO scoring!');
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setNotification(err.response?.data?.message || 'Error creating order.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Orders & Shiprocket Fulfillment
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time fraud screening, 1-click Shiprocket logistics dispatch, and WhatsApp invoice automation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Create Order (Test RTO)</span>
          </button>

          <button
            onClick={fetchOrders}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">All Orders ({orders.length})</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Sorted Expiry / Creation ASC</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Order ID / Date</th>
                <th className="py-3 px-4">Customer Phone</th>
                <th className="py-3 px-4">Items / Total</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">RTO Score</th>
                <th className="py-3 px-4">Status / AWB</th>
                <th className="py-3 px-4 text-right">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    No orders registered yet. Click &quot;Create Order&quot; above to simulate an incoming order!
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const isHighRto = o.rtoScore > 70;
                  return (
                    <tr key={o._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono">
                        <div className="text-slate-200 font-semibold">#{o._id.substring(o._id.length - 8)}</div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{o.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{o.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">₹{o.total?.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-400">GST: ₹{o.gstTotal?.toFixed(2)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                          {o.paymentMode} ({o.paymentStatus})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          isHighRto 
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {o.rtoScore}/100 {isHighRto ? '⚠️ High' : '✓ Safe'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          o.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          o.status === 'shipped' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                          o.status === 'rto' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {o.status}
                        </span>
                        {o.shiprocketAwb && (
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            AWB: {o.shiprocketAwb}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {/* button Mark Shipped -> Shiprocket API */}
                        <button
                          onClick={() => handleMarkShipped(o._id)}
                          disabled={shippingOrderId === o._id || o.status === 'shipped' || o.status === 'delivered'}
                          className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded border border-indigo-500/30 transition-colors text-[11px] inline-flex items-center space-x-1 disabled:opacity-40"
                        >
                          <Truck className="h-3 w-3" />
                          <span>{shippingOrderId === o._id ? 'Shipping...' : 'Mark Shipped'}</span>
                        </button>

                        {/* button Send Invoice WhatsApp */}
                        <button
                          onClick={() => handleSendInvoiceWhatsApp(o)}
                          disabled={messagingOrderId === o._id}
                          className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded border border-emerald-500/30 transition-colors text-[11px] inline-flex items-center space-x-1 disabled:opacity-40"
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>{messagingOrderId === o._id ? 'Sending...' : 'Send Invoice WhatsApp'}</span>
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

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Create Test Order (With Auto RTO & GST)</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Product</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                >
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} (₹{p.price} + {p.gstPercent}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Payment Mode</label>
                  <select
                    value={newPaymentMode}
                    onChange={(e) => setNewPaymentMode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                  >
                    <option value="COD">COD (High Risk)</option>
                    <option value="UPI">UPI</option>
                    <option value="Razorpay">Razorpay</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-500/25"
                >
                  {creating ? 'Calculating & Saving...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
