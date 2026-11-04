import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Package, ShoppingBag, DollarSign, Users, AlertTriangle,
  Plus, Edit, Trash2, Eye, CheckCircle2, ArrowRight, RefreshCw, X
} from 'lucide-react';
import { productApi, orderApi } from '../services/api.js';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders'
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Oriental Woody',
    price: 4999,
    size: '100ml',
    bottle_color: 'Amber Gold',
    character: 'Rich, luxurious and warm',
    description: '',
    top_notes: '',
    heart_notes: '',
    base_notes: '',
    image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop',
    stock: 20
  });

  const [orderFilter, setOrderFilter] = useState('all');
  const [actionSuccess, setActionSuccess] = useState(null);

  const showNotification = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordRes] = await Promise.all([
        orderApi.getStats(),
        productApi.getAll(),
        orderApi.getAll(orderFilter === 'all' ? '' : orderFilter)
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (prodRes.success) setProducts(prodRes.products);
      if (ordRes.success) setOrders(ordRes.orders);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [orderFilter]);

  // Product CRUD Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Oriental Woody',
      price: 4999,
      size: '100ml',
      bottle_color: 'Amber Gold',
      character: 'Rich, luxurious and warm',
      description: '',
      top_notes: 'Saffron, Cardamom, Bergamot',
      heart_notes: 'Rose, Oud, Incense',
      base_notes: 'Amber, Sandalwood, Musk',
      image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop',
      stock: 20
    });
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      size: prod.size,
      bottle_color: prod.bottle_color,
      character: prod.character,
      description: prod.description,
      top_notes: prod.top_notes,
      heart_notes: prod.heart_notes,
      base_notes: prod.base_notes,
      image_url: prod.image_url,
      stock: prod.stock
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, productForm);
        showNotification(`"${productForm.name}" updated successfully.`);
      } else {
        await productApi.create(productForm);
        showNotification(`New perfume "${productForm.name}" added to collection.`);
      }
      setShowProductModal(false);
      loadData();
    } catch (err) {
      alert(err.data?.message || err.message || 'Operation failed');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the catalogue?`)) {
      try {
        await productApi.delete(id);
        showNotification(`"${name}" removed from catalogue.`);
        loadData();
      } catch (err) {
        alert(err.data?.message || err.message || 'Delete failed');
      }
    }
  };

  const handleQuickStockUpdate = async (prod, delta) => {
    const newStock = Math.max(0, prod.stock + delta);
    try {
      await productApi.update(prod.id, { stock: newStock });
      setProducts(products.map(p => p.id === prod.id ? { ...p, stock: newStock } : p));
      showNotification(`Updated ${prod.name} stock to ${newStock}`);
    } catch (err) {
      alert('Failed to update inventory.');
    }
  };

  // Order Status Handler
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showNotification(`Order #${orderId} marked as ${newStatus}.`);
    } catch (err) {
      alert(err.data?.message || err.message || 'Status update failed.');
    }
  };

  return (
    <div className="bg-[#24150F] min-h-screen text-[#F3E5D2] pb-24">
      {/* Top Banner */}
      <div className="bg-[#24150F] border-b border-[#B58A4F]/30 px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#B58A4F]" />
              <span className="text-xs uppercase font-mono tracking-widest text-[#B58A4F]">
                Executive Control Suite
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-[#F3E5D2]">
              OUDÉ Administrative Portal
            </h1>
            <p className="text-xs text-[#D8B995]/70">
              Role-based JWT enforcement • Real-time database management • Stock control
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadData}
              className="p-2 bg-[#352014] hover:bg-[#B58A4F] hover:text-[#24150F] text-[#D8B995] rounded border border-[#B58A4F]/30 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              to="/shop"
              className="px-4 py-2 bg-[#352014] hover:bg-[#24150F] text-xs font-serif text-[#D8B995] border border-[#B58A4F]/30 rounded transition-colors"
            >
              View Public Storefront
            </Link>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
          <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs rounded-lg flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="flex space-x-2 border-b border-[#B58A4F]/25 pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-lg text-xs font-serif tracking-wider uppercase font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-[#B58A4F] text-[#24150F] shadow-gold-glow'
                : 'bg-[#24150F] text-[#D8B995] hover:bg-[#352014]'
            }`}
          >
            Analytics & Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-lg text-xs font-serif tracking-wider uppercase font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-[#B58A4F] text-[#24150F] shadow-gold-glow'
                : 'bg-[#24150F] text-[#D8B995] hover:bg-[#352014]'
            }`}
          >
            Manage Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-lg text-xs font-serif tracking-wider uppercase font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#B58A4F] text-[#24150F] shadow-gold-glow'
                : 'bg-[#24150F] text-[#D8B995] hover:bg-[#352014]'
            }`}
          >
            Customer Orders ({orders.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="pt-8 space-y-8">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#24150F] p-6 rounded-2xl border border-[#B58A4F]/30 shadow-xl space-y-2">
                <div className="flex justify-between items-center text-[#B58A4F]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D8B995]/70">Gross Revenue</span>
                  <DollarSign className="w-5 h-5" />
                </div>
                <p className="font-serif text-3xl font-bold text-[#D4AF37]">
                  ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-[#D8B995]/60">Excludes cancelled orders</p>
              </div>

              <div className="bg-[#24150F] p-6 rounded-2xl border border-[#B58A4F]/30 shadow-xl space-y-2">
                <div className="flex justify-between items-center text-[#B58A4F]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D8B995]/70">Total Orders</span>
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="font-serif text-3xl font-bold text-[#F3E5D2]">
                  {stats?.totalOrders || 0}
                </p>
                <p className="text-[11px] text-[#D8B995]/60">Across all customer accounts</p>
              </div>

              <div className="bg-[#24150F] p-6 rounded-2xl border border-[#B58A4F]/30 shadow-xl space-y-2">
                <div className="flex justify-between items-center text-[#B58A4F]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D8B995]/70">Inventory Units</span>
                  <Package className="w-5 h-5" />
                </div>
                <p className="font-serif text-3xl font-bold text-[#F3E5D2]">
                  {stats?.totalInventory || 0}
                </p>
                <p className="text-[11px] text-[#D8B995]/60">Across {stats?.totalProducts || 7} catalogued scents</p>
              </div>

              <div className="bg-[#24150F] p-6 rounded-2xl border border-[#B58A4F]/30 shadow-xl space-y-2">
                <div className="flex justify-between items-center text-amber-400">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D8B995]/70">Stock Alerts</span>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <p className="font-serif text-3xl font-bold text-amber-400">
                  {stats?.lowStockCount || 0}
                </p>
                <p className="text-[11px] text-[#D8B995]/60">Products with stock ≤ 15 units</p>
              </div>
            </div>

            {/* Quick Actions & Recent Orders preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Inventory Highlights */}
              <div className="bg-[#24150F] p-6 rounded-2xl border border-[#B58A4F]/30 shadow-xl space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[#B58A4F]/20">
                  <h3 className="font-serif text-lg font-bold">Catalogue Inventory Status</h3>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-xs text-[#B58A4F] hover:underline"
                  >
                    Manage Catalogue →
                  </button>
                </div>
                <div className="divide-y divide-[#B58A4F]/15">
                  {products.slice(0, 5).map(prod => (
                    <div key={prod.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-3">
                        <img src={prod.image_url} alt={prod.name} className="w-8 h-10 object-cover rounded border border-[#B58A4F]/20" />
                        <div>
                          <p className="font-serif font-bold text-sm text-[#F3E5D2]">{prod.name}</p>
                          <p className="text-[11px] text-[#D8B995]/70">{prod.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold ${prod.stock <= 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {prod.stock} in stock
                        </span>
                        <p className="text-[10px] text-[#D8B995]/60">₹{Number(prod.price).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Recent Orders */}
              <div className="bg-[#24150F] p-6 rounded-2xl border border-[#B58A4F]/30 shadow-xl space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[#B58A4F]/20">
                  <h3 className="font-serif text-lg font-bold">Latest Order Inflows</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#B58A4F] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>
                <div className="divide-y divide-[#B58A4F]/15">
                  {orders.slice(0, 5).map(ord => (
                    <div key={ord.id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-serif font-bold text-sm text-[#F3E5D2]">Order #{ord.id} • {ord.customer_name}</p>
                        <p className="text-[11px] text-[#D8B995]/70">{ord.city} • {ord.payment_method}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[#B58A4F] font-bold">₹{Number(ord.total).toLocaleString('en-IN')}</span>
                        <span className="block text-[10px] uppercase font-mono text-[#D8B995]/60 capitalize">{ord.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="pt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold">Fragrance Catalogue Management</h2>
                <p className="text-xs text-[#D8B995]/70">Add new creations, adjust real-time stock levels, and update descriptions.</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 bg-[#B58A4F] hover:bg-[#D4AF37] text-[#24150F] rounded text-xs uppercase tracking-wider font-bold transition-all shadow flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Fragrance</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#24150F] rounded-2xl border border-[#B58A4F]/30 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#F3E5D2]">
                  <thead className="bg-[#352014] text-[#D8B995] font-serif uppercase tracking-wider text-[11px] border-b border-[#B58A4F]/20">
                    <tr>
                      <th className="py-4 px-4">Fragrance</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Price (INR)</th>
                      <th className="py-4 px-4">Stock Adjustment</th>
                      <th className="py-4 px-4">Notes Preview</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B58A4F]/15">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-[#352014]/50 transition-colors">
                        <td className="py-3 px-4 flex items-center space-x-3">
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="w-12 h-14 object-cover rounded border border-[#B58A4F]/20"
                          />
                          <div>
                            <p className="font-serif font-bold text-sm text-[#F3E5D2]">{prod.name}</p>
                            <p className="text-[10px] text-[#D8B995]/70">{prod.size || '100ml'} EDP • {prod.bottle_color}</p>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-[#D8B995]">
                          {prod.category}
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-[#B58A4F]">
                          ₹{Number(prod.price).toLocaleString('en-IN')}
                        </td>

                        {/* Stock +/- Buttons */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuickStockUpdate(prod, -1)}
                              disabled={prod.stock <= 0}
                              className="w-6 h-6 rounded bg-[#352014] text-[#D8B995] hover:bg-[#B58A4F] hover:text-[#24150F] flex items-center justify-center font-bold disabled:opacity-30"
                              title="Decrease stock by 1"
                            >
                              -
                            </button>
                            <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                              prod.stock <= 0 ? 'bg-red-950 text-red-300' : prod.stock <= 15 ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                            }`}>
                              {prod.stock}
                            </span>
                            <button
                              onClick={() => handleQuickStockUpdate(prod, 1)}
                              className="w-6 h-6 rounded bg-[#352014] text-[#D8B995] hover:bg-[#B58A4F] hover:text-[#24150F] flex items-center justify-center font-bold"
                              title="Increase stock by 1"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-[11px] text-[#D8B995]/80 max-w-xs truncate">
                          {prod.top_notes?.split(',')[0]} / {prod.heart_notes?.split(',')[0]} / {prod.base_notes?.split(',')[0]}
                        </td>

                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(prod)}
                            className="p-1.5 text-[#B58A4F] hover:bg-[#352014] rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 text-red-400 hover:bg-[#352014] rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="pt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold">Client Orders & Fulfilment</h2>
                <p className="text-xs text-[#D8B995]/70">Track customer purchases, update logistics statuses, and manage dispatch.</p>
              </div>

              {/* Status Filter Dropdown */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[#D8B995]">Status Filter:</span>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="bg-[#24150F] text-[#F3E5D2] px-3 py-2 rounded border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
                >
                  <option value="all">All Orders</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#24150F] rounded-2xl border border-[#B58A4F]/30 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#F3E5D2]">
                  <thead className="bg-[#352014] text-[#D8B995] font-serif uppercase tracking-wider text-[11px] border-b border-[#B58A4F]/20">
                    <tr>
                      <th className="py-4 px-4">Order ID & Date</th>
                      <th className="py-4 px-4">Client Details</th>
                      <th className="py-4 px-4">Shipping Destination</th>
                      <th className="py-4 px-4">Acquired Items</th>
                      <th className="py-4 px-4">Total (INR)</th>
                      <th className="py-4 px-4">Live Status Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B58A4F]/15">
                    {orders.map(ord => (
                      <tr key={ord.id} className="hover:bg-[#352014]/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-sm text-[#D4AF37]">#{ord.id}</span>
                          <span className="block text-[10px] text-[#D8B995]/60">
                            {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-serif font-bold text-sm text-[#F3E5D2]">{ord.customer_name}</p>
                          <p className="text-[11px] text-[#D8B995]/70">{ord.customer_email}</p>
                          <p className="text-[10px] text-[#D8B995]/50">{ord.phone}</p>
                        </td>

                        <td className="py-3 px-4 text-[#D8B995] max-w-xs">
                          <p className="truncate">{ord.shipping_address}</p>
                          <p className="text-[10px] text-[#D8B995]/70">{ord.city}, {ord.postal_code}</p>
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {ord.items?.map((it, idx) => (
                              <div key={idx} className="text-[11px] flex items-center space-x-1">
                                <span className="font-mono text-[#B58A4F]">{it.quantity}x</span>
                                <span className="text-[#F3E5D2] truncate">{it.product_name}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-[#B58A4F]">
                          ₹{Number(ord.total).toLocaleString('en-IN')}
                        </td>

                        {/* Order Status Select */}
                        <td className="py-3 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-[#352014] text-[#F3E5D2] px-2.5 py-1.5 rounded border border-[#B58A4F]/40 text-xs focus:outline-none focus:border-[#B58A4F] capitalize font-serif"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowProductModal(false)} />

          <div className="relative bg-[#24150F] border border-[#B58A4F]/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 text-[#F3E5D2] space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-[#B58A4F]/20">
              <h3 className="font-serif text-xl font-bold">
                {editingProduct ? `Edit "${editingProduct.name}"` : 'Add New Fragrance Flacon'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-[#D8B995]/70 hover:text-[#B58A4F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#D8B995] block mb-1">Fragrance Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Royal Oud"
                    className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded border border-[#B58A4F]/30"
                  />
                </div>

                <div>
                  <label className="text-[#D8B995] block mb-1">Olfactory Category *</label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    placeholder="e.g. Oriental Woody"
                    className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded border border-[#B58A4F]/30"
                  />
                </div>

                <div>
                  <label className="text-[#D8B995] block mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded border border-[#B58A4F]/30"
                  />
                </div>

                <div>
                  <label className="text-[#D8B995] block mb-1">Initial Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded border border-[#B58A4F]/30"
                  />
                </div>

                <div>
                  <label className="text-[#D8B995] block mb-1">Bottle Colour / Identity</label>
                  <input
                    type="text"
                    value={productForm.bottle_color}
                    onChange={(e) => setProductForm({ ...productForm, bottle_color: e.target.value })}
                    placeholder="e.g. Amber Gold"
                    className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded border border-[#B58A4F]/30"
                  />
                </div>

                <div>
                  <label className="text-[#D8B995] block mb-1">Fragrance Character Subtitle</label>
                  <input
                    type="text"
                    value={productForm.character}
                    onChange={(e) => setProductForm({ ...productForm, character: e.target.value })}
                    placeholder="e.g. Rich, luxurious and warm"
                    className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded border border-[#B58A4F]/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#D8B995] block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded border border-[#B58A4F]/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#D8B995] block mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded border border-[#B58A4F]/30"
                  />
                </div>

                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[#D8B995] block mb-1">Top Notes *</label>
                    <input
                      type="text"
                      required
                      value={productForm.top_notes}
                      onChange={(e) => setProductForm({ ...productForm, top_notes: e.target.value })}
                      placeholder="Saffron, Bergamot"
                      className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded border border-[#B58A4F]/30"
                    />
                  </div>
                  <div>
                    <label className="text-[#D8B995] block mb-1">Heart Notes *</label>
                    <input
                      type="text"
                      required
                      value={productForm.heart_notes}
                      onChange={(e) => setProductForm({ ...productForm, heart_notes: e.target.value })}
                      placeholder="Rose, Oud, Incense"
                      className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded border border-[#B58A4F]/30"
                    />
                  </div>
                  <div>
                    <label className="text-[#D8B995] block mb-1">Base Notes *</label>
                    <input
                      type="text"
                      required
                      value={productForm.base_notes}
                      onChange={(e) => setProductForm({ ...productForm, base_notes: e.target.value })}
                      placeholder="Amber, Sandalwood, Musk"
                      className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded border border-[#B58A4F]/30"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#B58A4F]/20 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-[#352014] text-[#D8B995] rounded hover:bg-[#24150F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B58A4F] hover:bg-[#D4AF37] text-[#24150F] font-bold uppercase tracking-wider rounded"
                >
                  Save Fragrance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
