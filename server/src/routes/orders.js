import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
} from '../controllers/orderController.js';
import { authenticateToken, optionalAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Order creation - supports both guest and registered customers
router.post('/', optionalAuth, createOrder);

// Customer personal orders
router.get('/my-orders', authenticateToken, getUserOrders);

// Admin endpoints
router.get('/admin/stats', authenticateToken, requireAdmin, getAdminStats);
router.get('/admin/all', authenticateToken, requireAdmin, getAllOrders);
router.put('/admin/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

// Single order details
router.get('/:id', authenticateToken, getOrderById);

export default router;
