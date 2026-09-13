'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
  Package, 
  ShoppingCart, 
  AlertOctagon, 
  Percent, 
  TrendingUp, 
  ShieldAlert, 
  Download, 
  ExternalLink,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    abandonedCount: 0,
    rtoPercentage: 0,
    rtoCount: 0,
    deliveredCount: 0
  });
  const [rtoOrders, setRtoOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const cId = localStorage.getItem('companyId') || '';
      setCompanyId(cId);

      // 1. Fetch products count
      const prodRes = await api.get(`/products/list${cId ? `?companyId=${cId}` : ''}`);
      const totalProducts = prodRes.data.length;

      // 2. Fetch order stats: total, rtoCount, deliveredCount
      const statsRes = await api.get(`/orders/stats${cId ? `?companyId=${cId}` : ''}`);
      const { total = 0, rtoCount = 0, deliveredCount = 0 } = statsRes.data;

      // 3. Fetch abandoned carts count
      const abRes = await api.get(`/orders/abandoned/list${cId ? `?companyId=${cId}` : ''}`);
      const abandonedCount = abRes.data.length;

      // Calculate RTO %
      const rtoPercentage = total > 0 ? ((rtoCount / total) * 100).toFixed(1) : 0;

      setStats({
        totalProducts,
        totalOrders: total,
        abandonedCount,
        rtoPercentage,
        rtoCount,
        deliveredCount
      });

      // 4. Fetch RTO Risk Orders from /orders/list?status=rto
      const rtoRes = await api.get(`/orders/list?status=rto${cId ? `&companyId=${cId}` : ''}`);
      setRtoOrders(rtoRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExportAudit = () => {
    const cId = localStorage.getItem('companyId') || '';
    window.open(`http://localhost:5000/api/audit/export?companyId=${cId}&year=2026`, '_blank');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Store Performance & Risk Control
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time analytics, automated RTO fraud detection, and multi-channel abandoned recovery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportAudit}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export 2026 Audit (Excel)</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 relative overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Products</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">{stats.totalProducts}</span>
            <span className="text-xs text-slate-500 ml-2">in active catalog</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 relative overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">{stats.totalOrders}</span>
            <span className="text-xs text-emerald-400 flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-0.5" />
              {stats.deliveredCount} delivered
            </span>
          </div>
        </div>

        {/* Abandoned Count */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 relative overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Abandoned Count</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertOctagon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">{stats.abandonedCount}</span>
            <span className="text-xs text-amber-400 ml-2">Recovery active</span>
          </div>
        </div>

        {/* RTO % */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 relative overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">RTO %</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-400 tracking-tight">{stats.rtoPercentage}%</span>
            <span className="text-xs text-slate-500 font-mono">({stats.rtoCount} flagged)</span>
          </div>
        </div>
      </div>

      {/* RTO Risk Orders Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            <h2 className="text-base font-semibold text-white">RTO Risk Orders (/orders/list?status=rto)</h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium self-start sm:self-auto">
            High Fraud / Cancellation Probability
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer / Phone</th>
                <th className="py-3 px-4">Cart Total (w/ GST)</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">RTO Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rtoOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    {loading ? 'Analyzing orders...' : 'No high-risk RTO orders detected. Your shipments are in healthy standing.'}
                  </td>
                </tr>
              ) : (
                rtoOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-300">
                      #{order._id.substring(order._id.length - 8)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{order.customerName}</div>
                      <div className="text-[11px] text-slate-400">{order.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      ₹{order.total?.toFixed(2)}
                      <div className="text-[10px] text-slate-500">GST: ₹{order.gstTotal?.toFixed(2)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        {order.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-rose-400 text-sm">{order.rtoScore}</span>
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded-full"
                            style={{ width: `${order.rtoScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => router.push('/orders')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors text-[11px]"
                      >
                        Manage Order
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
