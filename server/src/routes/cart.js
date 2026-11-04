import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  calculateCart,
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Server-side calculation endpoint for guest or instant calculation
router.post('/calculate', calculateCart);

// User-specific persistent cart endpoints (protected)
router.get('/', authenticateToken, getCart);
router.post('/add', authenticateToken, addToCart);
router.put('/update', authenticateToken, updateCartItem);
router.delete('/remove/:productId', authenticateToken, removeFromCart);
router.delete('/clear', authenticateToken, clearCart);

export default router;
