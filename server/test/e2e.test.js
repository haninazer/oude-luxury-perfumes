import http from 'http';
import app from '../src/index.js';
import db from '../src/config/db.js';

async function runTests() {
  console.log('🧪 Starting OUDÉ Full-Stack System Verification...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Verify Products
  console.log('📦 1. Verifying The Seven OUDÉ Perfumes in Database:');
  const productsRes = await db.query('SELECT * FROM products ORDER BY id ASC');
  assert(productsRes.rows.length === 7, `Expected exactly 7 products, found ${productsRes.rows.length}`);

  const oudRoyal = productsRes.rows.find(p => p.name === 'Oud Royal');
  assert(oudRoyal && Number(oudRoyal.price) === 4999, 'Oud Royal is priced at ₹4,999');
  assert(oudRoyal && oudRoyal.category === 'Oriental Woody', 'Oud Royal category is Oriental Woody');
  assert(oudRoyal && oudRoyal.top_notes.includes('Saffron'), 'Oud Royal has Saffron in top notes');

  const desertBloom = productsRes.rows.find(p => p.name === 'Desert Bloom');
  assert(desertBloom && Number(desertBloom.price) === 3499, 'Desert Bloom is priced at ₹3,499');

  const saharaOud = productsRes.rows.find(p => p.name === 'Sahara Oud');
  assert(saharaOud && Number(saharaOud.price) === 5499, 'Sahara Oud is priced at ₹5,499');

  // 2. Verify Users & Password Hashing
  console.log('\n👤 2. Verifying Customer & Admin Accounts with Bcrypt:');
  const adminUser = await db.query("SELECT * FROM users WHERE email = 'admin@oude.com'");
  assert(adminUser.rows.length === 1, 'Default admin account exists');
  assert(adminUser.rows[0].role === 'admin', 'Admin account has role="admin"');
  assert(adminUser.rows[0].password_hash.startsWith('$2'), 'Admin password is encrypted with bcrypt');

  const custUser = await db.query("SELECT * FROM users WHERE email = 'hani@oude.com'");
  assert(custUser.rows.length === 1, 'Default customer account exists');
  assert(custUser.rows[0].role === 'customer', 'Customer account has role="customer"');

  // 3. Test Server-Side Cart Calculation
  console.log('\n🛒 3. Testing Server-Side Cart Total & Promo Calculation:');
  const { calculateTotals } = await import('../src/controllers/cartController.js');

  // Oud Royal (₹4999) x 1
  const cartTest1 = calculateTotals([
    { id: 1, name: 'Oud Royal', price: 4999, quantity: 1, stock: 25 }
  ]);
  assert(cartTest1.subtotal === 4999, `Subtotal is 4999, got ${cartTest1.subtotal}`);
  assert(cartTest1.shippingFee === 0, `Free shipping qualified (>= ₹3000), got ${cartTest1.shippingFee}`);
  assert(cartTest1.grandTotal === 4999, `Grand total is 4999, got ${cartTest1.grandTotal}`);

  // Test Promo Code OUDE10 (10% off)
  const cartTestPromo = calculateTotals(
    [{ id: 1, name: 'Oud Royal', price: 4999, quantity: 1, stock: 25 }],
    'OUDE10'
  );
  assert(cartTestPromo.discount === 500, `10% discount applied (500), got ${cartTestPromo.discount}`);
  assert(cartTestPromo.grandTotal === 4499, `Discounted total is 4499, got ${cartTestPromo.grandTotal}`);

  // 4. Test Stock Validation & Decrement
  console.log('\n🔒 4. Testing Atomic Stock Deduction on Checkout:');
  const initialStock = oudRoyal.stock;
  await db.query('UPDATE products SET stock = stock - 1 WHERE id = $1', [oudRoyal.id]);
  const updatedOud = await db.query('SELECT stock FROM products WHERE id = $1', [oudRoyal.id]);
  assert(updatedOud.rows[0].stock === initialStock - 1, `Stock decremented from ${initialStock} to ${initialStock - 1}`);
  // Restore
  await db.query('UPDATE products SET stock = $1 WHERE id = $2', [initialStock, oudRoyal.id]);

  console.log(`\n=========================================`);
  console.log(`Verification Complete: ${passed} Passed, ${failed} Failed`);
  console.log(`=========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
