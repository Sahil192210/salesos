'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Package, Plus, UploadCloud, Tag, Layers, RefreshCw, Check } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [gstPercent, setGstPercent] = useState('18');
  const [stock, setStock] = useState('50');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const companyId = localStorage.getItem('companyId') || '';
      const res = await api.get(`/products/list${companyId ? `?companyId=${companyId}` : ''}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files).slice(0, 5));
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      // Form Title, SKU, Price, GST %, Stock, File multiple, Upload -> FormData POST /products/create
      const formData = new FormData();
      formData.append('title', title);
      formData.append('sku', sku);
      formData.append('price', price);
      formData.append('gstPercent', gstPercent);
      formData.append('stock', stock);

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      await api.post('/products/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Product catalog item uploaded successfully!');
      setTitle('');
      setSku('');
      setPrice('');
      setSelectedFiles([]);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to upload product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Catalog & Inventory Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Add SKU items with GST calculation, multi-image upload, and automatic stock monitoring.
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Refresh Catalog</span>
        </button>
      </div>

      {/* Product Upload Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Plus className="h-5 w-5 text-indigo-400" />
          <h2 className="text-base font-semibold text-white">Create New Product (POST /api/products/create)</h2>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Artisanal Single-Origin Coffee Beans 500g"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">SKU (Unique)</label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              placeholder="COF-500-ORG"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Base Price (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="799"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">GST %</label>
            <select
              value={gstPercent}
              onChange={(e) => setGstPercent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="0">0% (Nil)</option>
              <option value="5">5% (Essential)</option>
              <option value="12">12% (Standard)</option>
              <option value="18">18% (General / Most D2C)</option>
              <option value="28">28% (Luxury)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Initial Stock Quantity</label>
            <input
              type="number"
              required
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="50"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-300 mb-1">Product Images (Up to 5 files)</label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/30 file:cursor-pointer cursor-pointer"
              />
              <span className="text-xs text-slate-500">
                {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Max 5 images allowed'}
              </span>
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-xs rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <UploadCloud className="h-4 w-4" />
              <span>{submitting ? 'Uploading to Catalog...' : 'Upload Product & Calculate GST'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Products Table with Image Thumbnail */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Active Product Catalog ({products.length})</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Filtered by Company Tenant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Thumbnail</th>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Price (Base)</th>
                <th className="py-3 px-4">GST %</th>
                <th className="py-3 px-4">Price (w/ GST)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    No products found. Add your first item using the upload form above!
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const priceWithGst = p.price * (1 + (p.gstPercent || 18) / 100);
                  const firstImg = p.images && p.images.length > 0 ? p.images[0] : null;
                  const displayImg = firstImg 
                    ? (firstImg.startsWith('http') ? firstImg : `http://localhost:5000${firstImg}`)
                    : null;

                  return (
                    <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="h-12 w-12 rounded-lg bg-slate-800 border border-slate-700/60 overflow-hidden flex items-center justify-center">
                          {displayImg ? (
                            <img
                              src={displayImg}
                              alt={p.title}
                              className="h-full w-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <Package className="h-5 w-5 text-slate-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-100 max-w-xs truncate">
                        {p.title}
                        {p.tallyItemId && (
                          <div className="text-[10px] text-slate-500 font-mono">Tally: {p.tallyItemId}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-indigo-300 font-semibold">{p.sku}</td>
                      <td className="py-3 px-4 font-mono text-slate-200">₹{p.price?.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                          {p.gstPercent || 18}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400 font-medium">
                        ₹{priceWithGst.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-medium ${p.stock < 10 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          p.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
