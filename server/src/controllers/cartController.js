import db from '../config/db.js';

// Calculate server-side totals given item rows
export function calculateTotals(items, promoCode = '') {
  let subtotal = 0;
  let itemCount = 0;
  let hasOutOfStock = false;

  const processedItems = items.map(item => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    const stock = Number(item.stock);
    const isOutOfStock = stock <= 0;
    const isQuantityExceeded = quantity > stock;

    if (isOutOfStock || isQuantityExceeded) {
      hasOutOfStock = true;
    }

    const itemTotal = price * quantity;
    subtotal += itemTotal;
    itemCount += quantity;

    return {
      ...item,
      price,
      quantity,
      stock,
      itemTotal,
      isOutOfStock,
      isQuantityExceeded,
      maxAllowedQuantity: stock
    };
  });

  // Free shipping on orders of ₹3,000 and above; otherwise ₹150 luxury courier fee
  const shippingThreshold = 3000;
  const shippingFee = (subtotal >= shippingThreshold || subtotal === 0) ? 0 : 150;
  const amountToFreeShipping = Math.max(0, shippingThreshold - subtotal);

  // Promo code validation: 'OUDE10' gives 10% discount
  let discount = 0;
  let discountDescription = '';
  if (promoCode && promoCode.trim().toUpperCase() === 'OUDE10') {
    discount = Math.round(subtotal * 0.10);
    discountDescription = '10% OUDÉ Welcome Privilege Applied';
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  return {
    items: processedItems,
    itemCount,
    subtotal,
    shippingFee,
    amountToFreeShipping,
    freeShippingQualified: subtotal >= shippingThreshold,
    discount,
    discountDescription,
    grandTotal,
    hasOutOfStock
  };
}

export async function getCart(req, res) {
  try {
    const userId = req.user.id;
    const { promoCode } = req.query;

    const queryRes = await db.query(
      `SELECT c.id as cart_item_id, c.quantity, c.updated_at,
              p.id as product_id, p.name, p.category, p.price, p.size,
              p.bottle_color, p.character, p.image_url, p.stock
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1
       ORDER BY c.created_at ASC`,
      [userId]
    );

    const summary = calculateTotals(queryRes.rows, promoCode);

    return res.json({
      success: true,
      ...summary
    });
  } catch (err) {
    console.error('Get cart error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve shopping cart.' });
  }
}

export async function addToCart(req, res) {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const qtyToAdd = Math.max(1, parseInt(quantity, 10));

    // Check product existence and real-time stock
    const productRes = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (productRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = productRes.rows[0];

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: `Sorry, "${product.name}" is currently out of stock.`
      });
    }

    // Check if item already in user's cart
    const existingItemRes = await db.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    let newQuantity = qtyToAdd;
    if (existingItemRes.rows.length > 0) {
      newQuantity = existingItemRes.rows[0].quantity + qtyToAdd;
    }

    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot add more. Only ${product.stock} bottles of "${product.name}" available in stock.`
      });
    }

    if (existingItemRes.rows.length > 0) {
      await db.query(
        'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newQuantity, existingItemRes.rows[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [userId, productId, newQuantity]
      );
    }

    // Return updated cart
    return getCart(req, res);
  } catch (err) {
    console.error('Add to cart error:', err);
    return res.status(500).json({ success: false, message: 'Failed to add item to cart.' });
  }
}

export async function updateCartItem(req, res) {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Product ID and quantity are required.' });
    }

    const targetQty = parseInt(quantity, 10);

    if (targetQty <= 0) {
      // Remove item
      await db.query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2', [userId, productId]);
      return getCart(req, res);
    }

    // Check product stock
    const prodRes = await db.query('SELECT stock, name FROM products WHERE id = $1', [productId]);
    if (prodRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const availableStock = prodRes.rows[0].stock;
    if (targetQty > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} units of "${prodRes.rows[0].name}" available in stock.`
      });
    }

    await db.query(
      'UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3',
      [targetQty, userId, productId]
    );

    return getCart(req, res);
  } catch (err) {
    console.error('Update cart error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update cart.' });
  }
}

export async function removeFromCart(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await db.query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2', [userId, productId]);

    return getCart(req, res);
  } catch (err) {
    console.error('Remove from cart error:', err);
    return res.status(500).json({ success: false, message: 'Failed to remove item from cart.' });
  }
}

export async function clearCart(req, res) {
  try {
    const userId = req.user.id;
    await db.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    return res.json({
      success: true,
      message: 'Shopping cart cleared.'
    });
  } catch (err) {
    console.error('Clear cart error:', err);
    return res.status(500).json({ success: false, message: 'Failed to clear cart.' });
  }
}

/**
 * Server-Side Price & Stock Calculator
 * Accepts an array of { productId, quantity } and promoCode,
 * fetches live prices and stocks from database, and computes verified totals.
 */
export async function calculateCart(req, res) {
  try {
    const { items = [], promoCode = '' } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.json({
        success: true,
        items: [],
        itemCount: 0,
        subtotal: 0,
        shippingFee: 0,
        amountToFreeShipping: 3000,
        freeShippingQualified: false,
        discount: 0,
        discountDescription: '',
        grandTotal: 0,
        hasOutOfStock: false
      });
    }

    const productIds = items.map(i => i.productId).filter(Boolean);
    if (productIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid products provided.' });
    }

    // Fetch product details for all requested IDs
    const placeholders = productIds.map((_, idx) => `$${idx + 1}`).join(', ');
    const productsRes = await db.query(
      `SELECT id, name, category, price, size, bottle_color, character, image_url, stock
       FROM products
       WHERE id IN (${placeholders})`,
      productIds
    );

    const productMap = new Map();
    for (const prod of productsRes.rows) {
      productMap.set(Number(prod.id), prod);
    }

    const enrichedItems = [];
    for (const item of items) {
      const prod = productMap.get(Number(item.productId));
      if (prod) {
        enrichedItems.push({
          product_id: prod.id,
          name: prod.name,
          category: prod.category,
          price: prod.price,
          size: prod.size,
          bottle_color: prod.bottle_color,
          character: prod.character,
          image_url: prod.image_url,
          stock: prod.stock,
          quantity: Math.max(1, parseInt(item.quantity, 10) || 1)
        });
      }
    }

    const summary = calculateTotals(enrichedItems, promoCode);

    return res.json({
      success: true,
      ...summary
    });
  } catch (err) {
    console.error('Calculate cart error:', err);
    return res.status(500).json({ success: false, message: 'Failed to calculate cart totals.' });
  }
}

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  calculateCart,
};
