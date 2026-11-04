import db from '../config/db.js';
import { calculateTotals } from './cartController.js';

export async function createOrder(req, res) {
  try {
    const userId = req.user ? req.user.id : null;
    const {
      customer_name,
      customer_email,
      shipping_address,
      city,
      postal_code,
      phone,
      payment_method = 'Credit Card (Simulated)',
      items = [],
      promoCode = ''
    } = req.body;

    // Validate customer and address fields
    if (!customer_name || !customer_email || !shipping_address || !city || !postal_code || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All shipping details (name, email, address, city, postal code, phone) are required.'
      });
    }

    // Determine cart items: either provided in body or fetched from database for logged in user
    let rawItems = items;
    if ((!rawItems || rawItems.length === 0) && userId) {
      const userCart = await db.query(
        'SELECT product_id as "productId", quantity FROM cart_items WHERE user_id = $1',
        [userId]
      );
      rawItems = userCart.rows;
    }

    if (!rawItems || rawItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items before checking out.'
      });
    }

    // Validate products and stock from database
    const productIds = rawItems.map(i => i.productId || i.product_id).filter(Boolean);
    const placeholders = productIds.map((_, idx) => `$${idx + 1}`).join(', ');
    const productsRes = await db.query(
      `SELECT id, name, category, price, size, bottle_color, image_url, stock
       FROM products
       WHERE id IN (${placeholders})`,
      productIds
    );

    const productMap = new Map();
    productsRes.rows.forEach(p => productMap.set(Number(p.id), p));

    const enrichedItems = [];
    const stockErrors = [];

    for (const item of rawItems) {
      const pid = Number(item.productId || item.product_id);
      const prod = productMap.get(pid);
      const qty = parseInt(item.quantity, 10);

      if (!prod) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${pid} was not found.`
        });
      }

      if (prod.stock < qty) {
        stockErrors.push(`"${prod.name}" has only ${prod.stock} unit(s) remaining (you requested ${qty}).`);
      }

      enrichedItems.push({
        product_id: prod.id,
        name: prod.name,
        category: prod.category,
        price: prod.price,
        size: prod.size,
        bottle_color: prod.bottle_color,
        image_url: prod.image_url,
        stock: prod.stock,
        quantity: qty
      });
    }

    if (stockErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock validation failed.',
        errors: stockErrors
      });
    }

    // Server-side financial calculation
    const calculated = calculateTotals(enrichedItems, promoCode);

    // Insert Order
    const orderRes = await db.query(
      `INSERT INTO orders (
        user_id, customer_name, customer_email, shipping_address,
        city, postal_code, phone, payment_method,
        subtotal, shipping_fee, discount, total, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'processing')
      RETURNING *`,
      [
        userId,
        customer_name.trim(),
        customer_email.trim().toLowerCase(),
        shipping_address.trim(),
        city.trim(),
        postal_code.trim(),
        phone.trim(),
        payment_method,
        calculated.subtotal,
        calculated.shippingFee,
        calculated.discount,
        calculated.grandTotal
      ]
    );

    const createdOrder = orderRes.rows[0];
    const orderId = createdOrder.id;

    // Insert order items and deduct inventory
    for (const item of enrichedItems) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.product_id, item.name, item.price, item.quantity, item.image_url]
      );

      // Deduct stock
      await db.query(
        'UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Clear user cart if authenticated
    if (userId) {
      await db.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    }

    // Tracking code generation for realistic luxury experience
    const trackingCode = `OUDE-${new Date().getFullYear()}-${String(orderId).padStart(5, '0')}`;

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! Thank you for choosing OUDÉ.',
      order: {
        ...createdOrder,
        tracking_code: trackingCode,
        items: enrichedItems,
        summary: calculated
      }
    });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process order. Please try again.' });
  }
}

export async function getUserOrders(req, res) {
  try {
    const userId = req.user.id;

    const ordersRes = await db.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const orders = [];
    for (const ord of ordersRes.rows) {
      const itemsRes = await db.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [ord.id]
      );
      orders.push({
        ...ord,
        items: itemsRes.rows
      });
    }

    return res.json({
      success: true,
      orders
    });
  } catch (err) {
    console.error('Get user orders error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [id]);

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orderRes.rows[0];

    // Authorization check: either admin or owner
    if (req.user.role !== 'admin' && req.user.id !== order.user_id) {
      return res.status(403).json({ success: false, message: 'Access denied to this order.' });
    }

    const itemsRes = await db.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);

    return res.json({
      success: true,
      order: {
        ...order,
        items: itemsRes.rows
      }
    });
  } catch (err) {
    console.error('Get order by ID error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve order details.' });
  }
}

export async function getAllOrders(req, res) {
  try {
    const { status } = req.query;
    let queryText = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      queryText += ' AND status = $1';
      params.push(status);
    }

    queryText += ' ORDER BY created_at DESC';

    const ordersRes = await db.query(queryText, params);

    const orders = [];
    for (const ord of ordersRes.rows) {
      const itemsRes = await db.query('SELECT * FROM order_items WHERE order_id = $1', [ord.id]);
      orders.push({
        ...ord,
        items: itemsRes.rows
      });
    }

    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error('Get all orders error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin orders.' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updateRes = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.json({
      success: true,
      message: `Order #${id} status updated to ${status}.`,
      order: updateRes.rows[0]
    });
  } catch (err) {
    console.error('Update order status error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
}

export async function getAdminStats(req, res) {
  try {
    const revenueRes = await db.query("SELECT COALESCE(SUM(total), 0) as total_revenue, COUNT(*) as total_orders FROM orders WHERE status != 'cancelled'");
    const totalUsersRes = await db.query("SELECT COUNT(*) as total_customers FROM users WHERE role = 'customer'");
    const totalProductsRes = await db.query("SELECT COUNT(*) as total_products, COALESCE(SUM(stock), 0) as total_inventory FROM products");
    const lowStockRes = await db.query("SELECT COUNT(*) as low_stock_count FROM products WHERE stock <= 15");
    const recentOrdersRes = await db.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5");

    return res.json({
      success: true,
      stats: {
        totalRevenue: Number(revenueRes.rows[0].total_revenue),
        totalOrders: Number(revenueRes.rows[0].total_orders),
        totalCustomers: Number(totalUsersRes.rows[0].total_customers),
        totalProducts: Number(totalProductsRes.rows[0].total_products),
        totalInventory: Number(totalProductsRes.rows[0].total_inventory),
        lowStockCount: Number(lowStockRes.rows[0].low_stock_count),
        recentOrders: recentOrdersRes.rows
      }
    });
  } catch (err) {
    console.error('Get admin stats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
  }
}

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
};
