import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, Phone, Mail, Shield, CheckCircle, Clock, Truck, AlertCircle, Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { authApi, orderApi } from '../services/api.js';

export default function Profile() {
  const { user, isAdmin, updateProfile, logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await orderApi.getMyOrders();
        if (res.success) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, phone, address });
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'shipped':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'processing':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'cancelled':
        return 'bg-red-950 text-red-400 border-red-800';
      default:
        return 'bg-[#352014] text-[#D8B995] border-[#B58A4F]/40';
    }
  };

  return (
    <div className="luxury-canvas-bg min-h-screen text-[#F3E5D2] py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-56 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        
        {/* User Card */}
        <div className="luxury-glass-panel text-[#F3E5D2] rounded-3xl border border-[#D4AF37]/35 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#180C07] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-serif text-2xl font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold gold-foil-text">{user?.name}</h1>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-black/60 text-[#D4AF37] border border-[#D4AF37]/40 shadow">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-[#D8B995]/80 mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex-1 md:flex-none px-5 py-2.5 btn-gold-embossed rounded-xl text-xs font-serif font-bold uppercase tracking-wider text-center shadow-lg"
              >
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={logout}
              className="flex-1 md:flex-none px-4 py-2.5 bg-[#140A06] text-red-300 hover:text-red-200 border border-red-800/40 rounded-xl text-xs font-serif uppercase tracking-wider transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Details & Order History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-4">
            <div className="bg-[#24150F] text-[#F3E5D2] rounded-2xl border border-[#B58A4F]/30 p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-[#B58A4F]/20">
                <h3 className="font-serif text-lg font-bold">Personal Profile</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-[#D4AF37] hover:underline"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {updateSuccess && (
                <div className="p-2.5 bg-emerald-950 text-emerald-300 text-xs rounded-lg border border-emerald-800">
                  Profile updated successfully.
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#D8B995] block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded-lg border border-[#B58A4F]/30 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[#D8B995] block mb-1">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded-lg border border-[#B58A4F]/30 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[#D8B995] block mb-1">Default Address</label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded-lg border border-[#B58A4F]/30 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#B58A4F] text-[#24150F] font-bold text-xs uppercase rounded-lg"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-3 text-xs text-[#D8B995]/80">
                  <div className="flex items-start space-x-2">
                    <Mail className="w-4 h-4 text-[#B58A4F] flex-shrink-0 mt-0.5" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="w-4 h-4 text-[#B58A4F] flex-shrink-0 mt-0.5" />
                    <span>{user?.phone || 'No phone recorded'}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-[#B58A4F] flex-shrink-0 mt-0.5" />
                    <span>{user?.address || 'No default shipping address'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order History */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#F3E5D2] flex items-center space-x-2">
              <Package className="w-5 h-5 text-[#B58A4F]" />
              <span>Your Luxury Acquisition History</span>
            </h3>

            {loadingOrders ? (
              <div className="py-12 text-center text-xs text-[#D8B995]">
                Loading your orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[#24150F] text-[#F3E5D2] rounded-2xl p-8 border border-[#B58A4F]/30 text-center space-y-3 shadow-xl">
                <p className="font-serif text-lg">No orders placed yet</p>
                <p className="text-xs text-[#D8B995]/70 max-w-sm mx-auto">
                  Begin your olfactory journey by exploring our seven signature Arabian perfumes.
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-6 py-2.5 bg-[#B58A4F] text-[#24150F] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-gold-glow"
                >
                  Explore The Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#24150F] text-[#F3E5D2] rounded-2xl border border-[#B58A4F]/30 p-6 shadow-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#B58A4F]/20 gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm font-bold text-[#D4AF37]">
                            Order #{ord.id}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-[#D4AF37] border border-[#D4AF37]/30">
                            Tracking: OUDE-2026-{String(ord.id).padStart(5, '0')}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#D8B995]/70 block mt-1">
                          Placed on {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => window.print()}
                          className="px-3 py-1.5 bg-[#140A06] hover:bg-[#1E0F09] text-[#F3E5D2] border border-[#D4AF37]/40 rounded-lg text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center space-x-1.5 shadow"
                          title="Print official tax invoice for this order"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Print Invoice</span>
                        </button>
                        <span className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded-lg border capitalize ${getStatusColor(ord.status)}`}>
                          ● {ord.status}
                        </span>
                        <span className="font-serif text-lg font-bold text-[#D4AF37]">
                          ₹{Number(ord.total).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="divide-y divide-[#B58A4F]/10 text-xs">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.product_name}
                                className="w-10 h-12 object-cover rounded-lg border border-[#B58A4F]/20"
                              />
                            )}
                            <div>
                              <p className="font-serif font-bold text-sm text-[#F3E5D2]">{item.product_name}</p>
                              <p className="text-[11px] text-[#D8B995]/70">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-mono text-[#D8B995]">
                            ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-between items-center text-[11px] text-[#D8B995]/60 border-t border-[#B58A4F]/15">
                      <span>Shipped to: {ord.city}, {ord.postal_code}</span>
                      <span>Payment: {ord.payment_method}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
