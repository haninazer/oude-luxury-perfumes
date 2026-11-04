import db from '../config/db.js';

export async function getAllProducts(req, res) {
  try {
    const { q, category, minPrice, maxPrice, sortBy, featured } = req.query;

    let queryText = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    // Search filter (name, character, description, fragrance notes)
    if (q && q.trim()) {
      const searchTerm = `%${q.trim()}%`;
      queryText += ` AND (LOWER(name) LIKE LOWER($${paramIndex}) OR LOWER(description) LIKE LOWER($${paramIndex}) OR LOWER(character) LIKE LOWER($${paramIndex}) OR LOWER(category) LIKE LOWER($${paramIndex}) OR LOWER(top_notes) LIKE LOWER($${paramIndex}) OR LOWER(heart_notes) LIKE LOWER($${paramIndex}) OR LOWER(base_notes) LIKE LOWER($${paramIndex}))`;
      params.push(searchTerm);
      paramIndex++;
    }

    // Category filter
    if (category && category.trim() && category !== 'All') {
      queryText += ` AND LOWER(category) = LOWER($${paramIndex})`;
      params.push(category.trim());
      paramIndex++;
    }

    // Price range filters
    if (minPrice) {
      queryText += ` AND price >= $${paramIndex}`;
      params.push(Number(minPrice));
      paramIndex++;
    }
    if (maxPrice) {
      queryText += ` AND price <= $${paramIndex}`;
      params.push(Number(maxPrice));
      paramIndex++;
    }

    // Featured filter
    if (featured === 'true') {
      queryText += ` AND featured = true`;
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        queryText += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        queryText += ' ORDER BY price DESC';
        break;
      case 'name':
        queryText += ' ORDER BY name ASC';
        break;
      case 'rating':
        queryText += ' ORDER BY rating DESC';
        break;
      case 'stock':
        queryText += ' ORDER BY stock DESC';
        break;
      default:
        queryText += ' ORDER BY id ASC';
        break;
    }

    const result = await db.query(queryText, params);

    return res.json({
      success: true,
      count: result.rows.length,
      products: result.rows
    });
  } catch (err) {
    console.error('Fetch products error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = result.rows[0];

    // Get related products from same or complementary category
    const relatedResult = await db.query(
      'SELECT id, name, category, price, size, bottle_color, image_url, rating FROM products WHERE id != $1 LIMIT 3',
      [id]
    );

    return res.json({
      success: true,
      product,
      related: relatedResult.rows
    });
  } catch (err) {
    console.error('Get product by ID error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve product details.' });
  }
}

export async function getCategories(req, res) {
  try {
    const result = await db.query(`
      SELECT category, COUNT(*) as count, MIN(price) as min_price, MAX(price) as max_price
      FROM products
      GROUP BY category
      ORDER BY category ASC
    `);

    return res.json({
      success: true,
      categories: result.rows
    });
  } catch (err) {
    console.error('Get categories error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve categories.' });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      name,
      category,
      price,
      size = '100ml',
      bottle_color,
      character,
      description,
      top_notes,
      heart_notes,
      base_notes,
      image_url,
      stock = 20,
      featured = true
    } = req.body;

    if (!name || !category || !price || !description || !top_notes || !heart_notes || !base_notes) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, price, description, and notes (top, heart, base) are required.'
      });
    }

    const insertRes = await db.query(
      `INSERT INTO products (name, category, price, size, bottle_color, character, description, top_notes, heart_notes, base_notes, image_url, stock, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        name.trim(),
        category.trim(),
        Number(price),
        size,
        bottle_color || 'Amber Gold',
        character || '',
        description.trim(),
        top_notes.trim(),
        heart_notes.trim(),
        base_notes.trim(),
        image_url || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop',
        Number(stock) || 0,
        Boolean(featured)
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Product added successfully.',
      product: insertRes.rows[0]
    });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      price,
      size,
      bottle_color,
      character,
      description,
      top_notes,
      heart_notes,
      base_notes,
      image_url,
      stock,
      featured
    } = req.body;

    const existing = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const current = existing.rows[0];

    const updateRes = await db.query(
      `UPDATE products
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           price = COALESCE($3, price),
           size = COALESCE($4, size),
           bottle_color = COALESCE($5, bottle_color),
           character = COALESCE($6, character),
           description = COALESCE($7, description),
           top_notes = COALESCE($8, top_notes),
           heart_notes = COALESCE($9, heart_notes),
           base_notes = COALESCE($10, base_notes),
           image_url = COALESCE($11, image_url),
           stock = COALESCE($12, stock),
           featured = COALESCE($13, featured)
       WHERE id = $14
       RETURNING *`,
      [
        name,
        category,
        price !== undefined ? Number(price) : null,
        size,
        bottle_color,
        character,
        description,
        top_notes,
        heart_notes,
        base_notes,
        image_url,
        stock !== undefined ? Number(stock) : null,
        featured !== undefined ? Boolean(featured) : null,
        id
      ]
    );

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updateRes.rows[0]
    });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
}

export default {
  getAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
