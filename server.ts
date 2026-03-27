import express from 'express';
import Database from 'better-sqlite3';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('jjjalebi.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image_path TEXT,
    calories INTEGER
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    order_details TEXT NOT NULL,
    total_amount REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial items if empty
  const count = db.prepare('SELECT COUNT(*) as count FROM items').get() as { count: number };
if (count.count === 0) {
  const insertItem = db.prepare('INSERT INTO items (name, category, price, description, image_path, calories) VALUES (?, ?, ?, ?, ?, ?)');
  const seedItems = [
    { name: 'Classic Saffron Jalebi', category: 'Jalebi', price: 250, description: 'Our signature crispy jalebis infused with pure saffron and fried in pure desi ghee.', image_path: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&q=80&w=800', calories: 850 },
    { name: 'Rabdi Jalebi Combo', category: 'Combo', price: 350, description: 'Hot crispy jalebis served with rich, creamy, cardamom-infused rabdi.', image_path: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&q=80&w=800', calories: 1200 },
    { name: 'Mawa Jalebi', category: 'Jalebi', price: 300, description: 'Thick, dark, and rich mawa jalebis, a specialty of JJ Jalebi.', image_path: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800', calories: 950 },
    { name: 'Malpua with Rabdi', category: 'Sweets', price: 280, description: 'Traditional Indian pancakes fried in ghee, soaked in syrup, and served with rabdi.', image_path: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80&w=800', calories: 1100 },
    { name: 'Gulab Jamun', category: 'Sweets', price: 200, description: 'Soft, melt-in-your-mouth khoya balls soaked in rose-flavored sugar syrup.', image_path: 'https://images.unsplash.com/photo-1484723091791-00d759ce4340?auto=format&fit=crop&q=80&w=800', calories: 750 },
    { name: 'Special Fafda', category: 'Savory', price: 180, description: 'Crispy gram flour snack, perfectly paired with our sweet jalebis.', image_path: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=800', calories: 600 }
  ];
  
  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insertItem.run(item.name, item.category, item.price, item.description, item.image_path, item.calories);
    }
  });
  insertMany(seedItems);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/items', (req, res) => {
    try {
      const items = db.prepare('SELECT * FROM items').all();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  });

  app.post('/api/orders', (req, res) => {
    const { customer_name, phone, address, order_details, total_amount } = req.body;
    
    if (!customer_name || !phone || !address || !order_details || !total_amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const insertOrder = db.prepare('INSERT INTO orders (customer_name, phone, address, order_details, total_amount) VALUES (?, ?, ?, ?, ?)');
      const result = insertOrder.run(customer_name, phone, address, JSON.stringify(order_details), total_amount);
      
      res.status(201).json({ 
        success: true, 
        message: 'Order placed successfully!',
        orderId: result.lastInsertRowid 
      });
    } catch (error) {
      console.error('Order error:', error);
      res.status(500).json({ error: 'Failed to place order' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
