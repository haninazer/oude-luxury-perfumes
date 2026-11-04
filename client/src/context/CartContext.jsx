import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, token } = useAuth();

  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [amountToFreeShipping, setAmountToFreeShipping] = useState(3000);
  const [freeShippingQualified, setFreeShippingQualified] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountDescription, setDiscountDescription] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);
  const [promoCode, setPromoCode] = useState(() => localStorage.getItem('oude_promo') || '');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.id === prev?.id ? null : prev));
    }, 4000);
  };

  // Helper to apply server calculation to state
  const applyServerCartResponse = useCallback((res) => {
    if (res && res.success) {
      setItems(res.items || []);
      setItemCount(res.itemCount || 0);
      setSubtotal(res.subtotal || 0);
      setShippingFee(res.shippingFee || 0);
      setAmountToFreeShipping(res.amountToFreeShipping || 0);
      setFreeShippingQualified(res.freeShippingQualified || false);
      setDiscount(res.discount || 0);
      setDiscountDescription(res.discountDescription || '');
      setGrandTotal(res.grandTotal || 0);
    }
  }, []);

  // Fetch or calculate cart
  const refreshCart = useCallback(async (currentPromo = promoCode) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Authenticated: Fetch from database
        const res = await cartApi.getCart(currentPromo);
        applyServerCartResponse(res);
      } else {
        // Guest: Calculate via server using local items
        const localRaw = localStorage.getItem('oude_guest_cart');
        const localItems = localRaw ? JSON.parse(localRaw) : [];
        if (localItems.length === 0) {
          applyServerCartResponse({
            success: true,
            items: [],
            itemCount: 0,
            subtotal: 0,
            shippingFee: 0,
            amountToFreeShipping: 3000,
            freeShippingQualified: false,
            discount: 0,
            grandTotal: 0
          });
        } else {
          const res = await cartApi.calculate(localItems, currentPromo);
          applyServerCartResponse(res);
        }
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, promoCode, applyServerCartResponse]);

  // Sync when auth state changes or on mount
  useEffect(() => {
    // If user just logged in and had guest items, sync them to database!
    async function syncGuestCartOnLogin() {
      if (isAuthenticated) {
        const localRaw = localStorage.getItem('oude_guest_cart');
        if (localRaw) {
          try {
            const localItems = JSON.parse(localRaw);
            for (const item of localItems) {
              await cartApi.add(item.productId, item.quantity);
            }
            localStorage.removeItem('oude_guest_cart');
          } catch (e) {
            console.error('Error syncing guest cart:', e);
          }
        }
      }
      refreshCart();
    }
    syncGuestCartOnLogin();
  }, [isAuthenticated, token, refreshCart]);

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const res = await cartApi.add(productId, quantity);
        applyServerCartResponse(res);
      } else {
        // Guest mode: update local storage and calculate on server
        const localRaw = localStorage.getItem('oude_guest_cart');
        let localItems = localRaw ? JSON.parse(localRaw) : [];
        const existingIdx = localItems.findIndex(i => Number(i.productId) === Number(productId));

        if (existingIdx >= 0) {
          localItems[existingIdx].quantity += quantity;
        } else {
          localItems.push({ productId: Number(productId), quantity });
        }
        localStorage.setItem('oude_guest_cart', JSON.stringify(localItems));

        const res = await cartApi.calculate(localItems, promoCode);
        applyServerCartResponse(res);
      }

      showToast('Fragrance added to your luxury cart.');
      setIsCartOpen(true);
      return { success: true };
    } catch (err) {
      const msg = err.data?.message || err.message || 'Could not add to cart';
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const res = await cartApi.update(productId, quantity);
        applyServerCartResponse(res);
      } else {
        const localRaw = localStorage.getItem('oude_guest_cart');
        let localItems = localRaw ? JSON.parse(localRaw) : [];

        if (quantity <= 0) {
          localItems = localItems.filter(i => Number(i.productId) !== Number(productId));
        } else {
          const item = localItems.find(i => Number(i.productId) === Number(productId));
          if (item) {
            item.quantity = quantity;
          }
        }
        localStorage.setItem('oude_guest_cart', JSON.stringify(localItems));

        const res = await cartApi.calculate(localItems, promoCode);
        applyServerCartResponse(res);
      }
    } catch (err) {
      showToast(err.data?.message || err.message || 'Failed to update quantity', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Remove item
  const removeFromCart = async (productId) => {
    await updateQuantity(productId, 0);
    showToast('Item removed from cart.');
  };

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        await cartApi.clear();
      } else {
        localStorage.removeItem('oude_guest_cart');
      }
      applyServerCartResponse({
        success: true,
        items: [],
        itemCount: 0,
        subtotal: 0,
        shippingFee: 0,
        amountToFreeShipping: 3000,
        freeShippingQualified: false,
        discount: 0,
        grandTotal: 0
      });
    } catch (err) {
      console.error('Clear cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply promo code
  const applyPromo = async (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    localStorage.setItem('oude_promo', cleanCode);
    setPromoCode(cleanCode);

    if (!cleanCode) {
      refreshCart('');
      showToast('Promo code removed.');
      return;
    }

    if (cleanCode === 'OUDE10') {
      await refreshCart(cleanCode);
      showToast('10% Welcome privilege unlocked!');
    } else {
      showToast('Invalid promo code. Try "OUDE10" for 10% off.', 'error');
    }
  };

  const value = {
    items,
    itemCount,
    subtotal,
    shippingFee,
    amountToFreeShipping,
    freeShippingQualified,
    discount,
    discountDescription,
    grandTotal,
    promoCode,
    isCartOpen,
    loading,
    toastMessage,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromo,
    refreshCart,
    showToast
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
