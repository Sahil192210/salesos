'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { RefreshCw, Database, CheckCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function TallyPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const companyId = localStorage.getItem('companyId') || '';
      const res = await api.get(`/tally/logs${companyId ? `?companyId=${companyId}` : ''}`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // POST /api/tally/sync - companyId, tallyData -> sync stock, TallySync log
  const handleTriggerSync = async () => {
    setSyncing(true);
    setMessage('');
    try {
      const companyId = localStorage.getItem('companyId') || '';
      const res = await api.post('/tally/sync', {
        companyId,
        tallyData: null // Will trigger automated stock update for catalog items
      });
      setMessage(res.data.message || 'Tally ERP stock synchronization succeeded!');
      fetchLogs();
    } catch (err) {
      console.error(err);
      setMessage('Failed to execute Tally sync.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Tally ERP Stock Synchronization
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Bi-directional ledger synchronization between local warehouse Tally and D2C online store stock.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerSync}
            disabled={syncing}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-medium bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing with Tally...' : 'Trigger Tally Sync Now'}</span>
          </button>

          <button
            onClick={fetchLogs}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors"
          >
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Refresh Logs</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Sync Status Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Tally Connector Status</div>
              <div className="text-lg font-bold text-white flex items-center gap-1.5">
                Connected &amp; Ready
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div className="text-xs text-slate-400">Last Synced Record</div>
            <div className="text-sm font-semibold text-slate-200 mt-0.5">
              {logs.length > 0 ? new Date(logs[0].lastSyncAt).toLocaleString() : 'No sync recorded yet'}
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div className="text-xs text-slate-400">Total Items Updated</div>
            <div className="text-sm font-semibold text-indigo-400 mt-0.5 font-mono">
              {logs.length > 0 ? `${logs[0].itemsSynced} items updated` : '0 items'}
            </div>
          </div>
        </div>
      </div>

      {/* Tally Sync Audit Log Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Tally Sync Audit Logs</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">TallySync schema: companyId, lastSyncAt, itemsSynced, status</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Sync ID</th>
                <th className="py-3 px-4">Timestamp (lastSyncAt)</th>
                <th className="py-3 px-4">Items Synced</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">
                    No sync logs recorded yet. Click &quot;Trigger Tally Sync Now&quot; to test.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-300">
                      #{log._id.substring(log._id.length - 8)}
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {new Date(log.lastSyncAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-300">
                      {log.itemsSynced} items
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        log.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {log.status}
                      </span>
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
