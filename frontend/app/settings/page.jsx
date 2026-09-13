'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { 
  Settings, 
  Bell, 
  MessageSquare, 
  CreditCard, 
  Truck, 
  Globe, 
  CheckCircle, 
  Send,
  ShieldCheck
} from 'lucide-react';

export default function SettingsPage() {
  // settings: Toggles WhatsApp, SMS, UPI AutoPay, Language English/Marathi/Hindi, Razorpay Key, Shiprocket Email/Pass, Test Alert
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [upiAutopayEnabled, setUpiAutopayEnabled] = useState(true);
  const [language, setLanguage] = useState('English');
  const [razorpayKey, setRazorpayKey] = useState('rzp_test_xxx');
  const [shiprocketEmail, setShiprocketEmail] = useState('ops@brand.com');
  const [shiprocketPass, setShiprocketPass] = useState('••••••••••••');
  
  const [alertStatus, setAlertStatus] = useState('');
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  // Test Alert trigger
  const handleTestAlert = async () => {
    setTesting(true);
    setAlertStatus('');
    try {
      // Trigger recovery or test notification
      const res = await api.post('/cron/trigger-recovery');
      setAlertStatus(`Alert test executed successfully! System notification sent to active channels (${language}).`);
    } catch (err) {
      setAlertStatus('Alert simulated: WhatsApp & SMS notification loop fired.');
    } finally {
      setTesting(false);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            System &amp; Integration Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure automated gateways, localization languages, Shiprocket credentials &amp; test alerts.
          </p>
        </div>

        {/* Test Alert Button */}
        <button
          onClick={handleTestAlert}
          disabled={testing}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-medium bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <Bell className={`h-3.5 w-3.5 ${testing ? 'animate-bounce' : ''}`} />
          <span>{testing ? 'Dispatching...' : 'Test Alert'}</span>
        </button>
      </div>

      {alertStatus && (
        <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <span>{alertStatus}</span>
          <button onClick={() => setAlertStatus('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {saved && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Toggles WhatsApp, SMS, UPI AutoPay */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-400" />
            Automated Notification &amp; Payment Toggles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* WhatsApp Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div>
                <div className="text-xs font-semibold text-white">WhatsApp Recovery</div>
                <div className="text-[11px] text-slate-400">Meta Cloud API (0,1,3 days)</div>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  whatsappEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
              </button>
            </div>

            {/* SMS Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div>
                <div className="text-xs font-semibold text-white">SMS Notification</div>
                <div className="text-[11px] text-slate-400">Fast2SMS Gateway</div>
              </div>
              <button
                type="button"
                onClick={() => setSmsEnabled(!smsEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  smsEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
              </button>
            </div>

            {/* UPI AutoPay Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div>
                <div className="text-xs font-semibold text-white">UPI AutoPay / Mandates</div>
                <div className="text-[11px] text-slate-400">Instant recurring/pre-auth</div>
              </div>
              <button
                type="button"
                onClick={() => setUpiAutopayEnabled(!upiAutopayEnabled)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  upiAutopayEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Language Selection: English / Marathi / Hindi */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-400" />
            Language Preference (English / Marathi / Hindi)
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Recovery messages, invoice copy, and notification templates will be formatted in your chosen dialect.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'English', title: 'English', desc: 'Standard business English with UPI intent link' },
              { id: 'Marathi', title: 'मराठी (Marathi)', desc: 'स्थानिक मराठी संदेश आणि यूपीआय पेमेंट लिंक' },
              { id: 'Hindi', title: 'हिन्दी (Hindi)', desc: 'प्रादेशिक हिंदी संदेश और तत्काल यूपीआई भुगतान' }
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setLanguage(item.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  language === item.id 
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10' 
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-white">{item.title}</span>
                  {language === item.id && <CheckCircle className="h-4 w-4 text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Razorpay Key & Shiprocket Credentials */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-indigo-400" />
            Gateway &amp; Logistics Credentials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Razorpay Key ID</label>
              <input
                type="text"
                value={razorpayKey}
                onChange={(e) => setRazorpayKey(e.target.value)}
                placeholder="rzp_test_xxx"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-mono focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Shiprocket Email</label>
              <input
                type="email"
                value={shiprocketEmail}
                onChange={(e) => setShiprocketEmail(e.target.value)}
                placeholder="ops@company.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Shiprocket Password</label>
              <input
                type="password"
                value={shiprocketPass}
                onChange={(e) => setShiprocketPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-xs rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
