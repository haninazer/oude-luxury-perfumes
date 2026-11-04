import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import ScentQuizModal from './components/ScentQuizModal.jsx';
import ToastNotification from './components/ToastNotification.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export default function App() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[#24150F] text-[#F3E5D2]">
            {/* Global Navbar */}
            <Navbar onOpenQuiz={() => setIsQuizOpen(true)} />

            {/* Slide-out Persistent Cart Drawer */}
            <CartDrawer />

            {/* Interactive Scent Profiler Modal */}
            <ScentQuizModal
              isOpen={isQuizOpen}
              onClose={() => setIsQuizOpen(false)}
            />

            {/* Global Toast Notification */}
            <ToastNotification />

            {/* Page Routes */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home onOpenQuiz={() => setIsQuizOpen(true)} />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Customer Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Global Luxury Footer */}
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
