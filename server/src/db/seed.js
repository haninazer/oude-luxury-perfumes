import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { initDatabase } from './init.js';

export async function seedDatabase() {
  await initDatabase();

  console.log('🌱 Seeding OUDÉ – Arabian Luxury Perfumes database...');

  // 1. Seed Users
  const adminPasswordHash = await bcrypt.hash('Admin@Oude2026!', 10);
  const customerPasswordHash = await bcrypt.hash('Customer@123!', 10);

  // Check if users exist
  const existingUsers = await db.query('SELECT COUNT(*) as count FROM users');
  const userCount = parseInt(existingUsers.rows[0].count, 10);

  let adminId, customerId;

  if (userCount === 0) {
    const adminRes = await db.query(
      `INSERT INTO users (name, email, password_hash, role, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        'OUDÉ Administrator',
        'admin@oude.com',
        adminPasswordHash,
        'admin',
        '+971 4 800 6833',
        'OUDÉ Luxury Flagship, Downtown Boulevard, Dubai, UAE'
      ]
    );
    adminId = adminRes.rows[0].id;

    const customerRes = await db.query(
      `INSERT INTO users (name, email, password_hash, role, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        'Hani Nazer Mutheri',
        'hani@oude.com',
        customerPasswordHash,
        'customer',
        '+91 98765 43210',
        'Penthouse 14B, Palm Avenue, Mumbai, India'
      ]
    );
    customerId = customerRes.rows[0].id;
    console.log('👤 Users seeded: Admin (admin@oude.com) and Customer (hani@oude.com)');
  } else {
    const adminUser = await db.query("SELECT id FROM users WHERE email = 'admin@oude.com'");
    const custUser = await db.query("SELECT id FROM users WHERE email = 'hani@oude.com'");
    adminId = adminUser.rows[0]?.id || 1;
    customerId = custUser.rows[0]?.id || 2;
  }

  // 2. Seed The Seven OUDÉ Products
  const existingProducts = await db.query('SELECT COUNT(*) as count FROM products');
  const productCount = parseInt(existingProducts.rows[0].count, 10);

  if (productCount === 0) {
    const productsData = [
      {
        id: 1,
        name: 'Oud Royal',
        category: 'Oriental Woody',
        price: 4999.00,
        size: '100ml',
        bottle_color: 'Amber Gold',
        character: 'Rich, luxurious and warm',
        description: 'A majestic Arabian fragrance combining precious oud with warm amber and luxurious woods. Designed to create a sophisticated and long-lasting impression.',
        top_notes: 'Saffron, Cardamom, Bergamot',
        heart_notes: 'Rose, Oud, Incense',
        base_notes: 'Amber, Sandalwood, Musk',
        image_url: '/products/oud-royal.jpg',
        stock: 25,
        featured: true,
        rating: 4.95,
        reviews_count: 34
      },
      {
        id: 2,
        name: 'Desert Bloom',
        category: 'Floral Oriental',
        price: 3499.00,
        size: '100ml',
        bottle_color: 'Rose Pink',
        character: 'Floral, elegant and feminine',
        description: 'A graceful floral fragrance inspired by the beauty of flowers blooming across the desert. A delicate combination of floral sweetness and oriental warmth.',
        top_notes: 'Bergamot, Pink Pepper, Mandarin',
        heart_notes: 'Damask Rose, Jasmine, Peony',
        base_notes: 'White Musk, Vanilla, Cedarwood',
        image_url: '/products/desert-bloom.jpg',
        stock: 18,
        featured: true,
        rating: 4.88,
        reviews_count: 27
      },
      {
        id: 3,
        name: 'Amber Noir',
        category: 'Amber Woody',
        price: 4299.00,
        size: '100ml',
        bottle_color: 'Smoky Dark Brown',
        character: 'Deep, mysterious and smoky',
        description: 'A deep and mysterious fragrance with smoky woods, rich amber and captivating warmth. Created for those who appreciate bold and distinctive scents.',
        top_notes: 'Black Pepper, Cinnamon',
        heart_notes: 'Labdanum, Amber, Patchouli',
        base_notes: 'Vanilla, Smoky Woods, Musk',
        image_url: '/products/amber-noir.jpg',
        stock: 30,
        featured: true,
        rating: 4.92,
        reviews_count: 41
      },
      {
        id: 4,
        name: 'Sahara Oud',
        category: 'Woody Oriental',
        price: 5499.00,
        size: '100ml',
        bottle_color: 'Deep Amber Bronze',
        character: 'Intense, woody and luxurious',
        description: 'An intense expression of Arabian heritage, featuring precious oud and rich leather accords. Inspired by the depth and mystery of the Arabian desert.',
        top_notes: 'Saffron, Bergamot, Spices',
        heart_notes: 'Cambodian Oud, Leather, Incense',
        base_notes: 'Vetiver, Cedarwood, Amber',
        image_url: '/products/sahara-oud.jpg',
        stock: 15,
        featured: true,
        rating: 4.97,
        reviews_count: 52
      },
      {
        id: 5,
        name: 'Royal Musk',
        category: 'Musky Floral',
        price: 3799.00,
        size: '100ml',
        bottle_color: 'Ivory Champagne Gold',
        character: 'Soft, elegant and sophisticated',
        description: 'A sophisticated blend of soft florals and sensual musk with a beautifully smooth finish. Created for those who appreciate subtle luxury.',
        top_notes: 'White Florals, Bergamot',
        heart_notes: 'White Musk, Iris',
        base_notes: 'Cashmere Woods, Sandalwood, Vanilla',
        image_url: '/products/royal-musk.jpg',
        stock: 20,
        featured: true,
        rating: 4.85,
        reviews_count: 22
      },
      {
        id: 6,
        name: 'Golden Majesty',
        category: 'Oriental Amber',
        price: 4799.00,
        size: '100ml',
        bottle_color: 'Radiant Gold',
        character: 'Warm, radiant and luxurious',
        description: 'A radiant oriental fragrance combining golden spices, elegant florals and creamy woods. A fragrance that represents richness and timeless sophistication.',
        top_notes: 'Mandarin, Saffron, Cinnamon',
        heart_notes: 'Orange Blossom, Jasmine, Amber',
        base_notes: 'Tonka, Vanilla, Sandalwood',
        image_url: '/products/golden-majesty.jpg',
        stock: 22,
        featured: true,
        rating: 4.91,
        reviews_count: 29
      },
      {
        id: 7,
        name: 'Midnight Oasis',
        category: 'Fresh Woody',
        price: 3999.00,
        size: '100ml',
        bottle_color: 'Midnight Blue and Gold',
        character: 'Fresh, aromatic and woody',
        description: 'A refreshing yet sophisticated fragrance inspired by the calm mystery of an Arabian night. Combines fresh citrus notes with aromatic herbs and warm woods.',
        top_notes: 'Bergamot, Lemon, Marine Accords',
        heart_notes: 'Lavender, Geranium, Aromatic Spices',
        base_notes: 'Cedarwood, Musk, Vetiver',
        image_url: '/products/midnight-oasis.jpg',
        stock: 14,
        featured: true,
        rating: 4.89,
        reviews_count: 19
      }
    ];

    for (const p of productsData) {
      await db.query(
        `INSERT INTO products (name, category, price, size, bottle_color, character, description, top_notes, heart_notes, base_notes, image_url, stock, featured, rating, reviews_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          p.name,
          p.category,
          p.price,
          p.size,
          p.bottle_color,
          p.character,
          p.description,
          p.top_notes,
          p.heart_notes,
          p.base_notes,
          p.image_url,
          p.stock,
          p.featured,
          p.rating,
          p.reviews_count
        ]
      );
    }
    console.log('🌹 7 OUDÉ original luxury perfumes seeded successfully.');
  }

  // 3. Seed sample orders if none exist
  const existingOrders = await db.query('SELECT COUNT(*) as count FROM orders');
  if (parseInt(existingOrders.rows[0].count, 10) === 0 && customerId) {
    const orderRes = await db.query(
      `INSERT INTO orders (user_id, customer_name, customer_email, shipping_address, city, postal_code, phone, payment_method, subtotal, shipping_fee, discount, total, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [
        customerId,
        'Hani Nazer Mutheri',
        'hani@oude.com',
        'Penthouse 14B, Palm Avenue',
        'Mumbai',
        '400050',
        '+91 98765 43210',
        'Credit Card (Simulated)',
        4999.00,
        0.00,
        0.00,
        4999.00,
        'processing'
      ]
    );

    const orderId = orderRes.rows[0].id;
    await db.query(
      `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        orderId,
        1,
        'Oud Royal',
        4999.00,
        1,
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop'
      ]
    );
    console.log('📦 Sample order seeded successfully.');
  }

  console.log('✨ OUDÉ database ready to use!');
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}

export default seedDatabase;
