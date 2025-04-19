import express from "express";
import mysql from "mysql2";
import mysqlPromise from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Connection pool for regular queries
const db = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "dubai",
});

// Separate connection for promise-based rearrangement logic
let asyncDb;
const connectToAsyncDatabase = async () => {
  try {
    asyncDb = await mysqlPromise.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "dubai",
    });
    console.log("Async DB connected for rearrangement!");

    const [tables] = await asyncDb.query("SHOW TABLES");
    console.log("Available tables:", tables.map(t => t.Tables_in_dubai));
  } catch (error) {
    console.error("Async DB connection failed:", error);
    process.exit(1);
  }
};
connectToAsyncDatabase();

// ---------------------- Existing Routes ------------------------
// ... (No changes made to existing routes)

// Fetch all products with full data + days until expiry
app.get("/products", (req, res) => {
  const query = `
    SELECT 
      id,
      name, 
      manufacturing_date, 
      expiry_date, 
      rack_bin, 
      quantity, 
      current_status, 
      suggested_mart, 
      starting_delivery, 
      estimated_delivery, 
      place_of_origin,
      TIMESTAMPDIFF(DAY, NOW(), expiry_date) AS days_until_expiry
    FROM products1
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database Fetch Error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json(results);
  });
});

// Insert new product
app.post("/products", (req, res) => {
  const {
    productId, productName, noOfUnits, placeOfOrigin, expiryDate,
    manufacturedDate, estimatedDelivery, startingDelivery
  } = req.body;

  const query = `
    INSERT INTO products1
    (id, name, manufacturing_date, expiry_date, rack_bin, quantity, 
    current_status, suggested_mart, starting_delivery, estimated_delivery, place_of_origin) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [
    productId, productName, manufacturedDate, expiryDate, "Default Bin",
    noOfUnits, "Available", "Default Mart", startingDelivery, estimatedDelivery, placeOfOrigin
  ], (err, results) => {
    if (err) {
      console.error("Database Insert Error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.status(201).json({ message: "Product added", id: results.insertId });
  });
});

// Recommendations
app.get("/recommendations", (req, res) => {
  const query = `
    SELECT id, name AS product, manufacturing_date, expiry_date, 
           quantity, rack_bin, place_of_origin, 
           TIMESTAMPDIFF(DAY, NOW(), expiry_date) AS remaining_days,
           suggested_mart AS recommended_mart
    FROM products1 
    WHERE expiry_date > NOW() 
    ORDER BY expiry_date ASC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database Recommendation Error:", err);
      return res.status(500).json({ error: "Database query failed", details: err });
    }
    res.json(results);
  });
});

// Alerts
app.get("/alerts", (req, res) => {
  const query = `
    SELECT 
      id, 
      name, 
      expiry_date, 
      rack_bin,
      TIMESTAMPDIFF(DAY, NOW(), expiry_date) AS days_until_expiry
    FROM products1 
    WHERE expiry_date BETWEEN NOW() AND NOW() + INTERVAL 20 DAY
    ORDER BY expiry_date ASC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database Alert Error:", err);
      return res.status(500).json({ error: "Database query failed", details: err });
    }
    res.json(results);
  });
});

// Workers
app.get("/api/workers", (req, res) => {
  const query = "SELECT * FROM workers WHERE assigned_task_count < 5 LIMIT 1";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching workers:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No available workers" });
    }
    res.json(results);
  });
});

// Replenish
app.post("/api/replenish", (req, res) => {
  const { productId, productName } = req.body;
  db.query("SELECT * FROM workers WHERE assigned_task_count < 5 LIMIT 1", (err, workers) => {
    if (err) {
      console.error("Error finding worker:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    if (workers.length === 0) {
      return res.status(404).json({ message: "No available workers" });
    }

    const worker = workers[0];
    const taskQuery = "INSERT INTO tasks (product_id, product_name, assigned_worker_id) VALUES (?, ?, ?)";
    db.query(taskQuery, [productId, productName, worker.worker_id], (err, result) => {
      if (err) {
        console.error("Error inserting task:", err);
        return res.status(500).json({ error: "Failed to create task", details: err });
      }
      const updateWorkerQuery = "UPDATE workers SET assigned_task_count = assigned_task_count + 1 WHERE worker_id = ?";
      db.query(updateWorkerQuery, [worker.worker_id], (err) => {
        if (err) {
          console.error("Error updating worker task count:", err);
          return res.status(500).json({ error: "Failed to update worker task count", details: err });
        }
        res.status(200).json({
          message: `Task successfully assigned to worker: ${worker.worker_name}`,
          taskId: result.insertId,
          worker: worker.worker_name
        });
      });
    });
  });
});

// ---------------------- Rearrangement Routes ------------------------

app.get('/api/productss', async (req, res) => {
  try {
    const [rows] = await asyncDb.query(`
      SELECT
        p.product_name,
        b.bin_name,
        b.x AS rack_x,
        b.y AS rack_y,
        bp.quantity,
        b.max_capacity
      FROM bin_products bp
      JOIN productss p ON bp.product_id = p.id
      JOIN bins b ON bp.bin_id = b.id
      ORDER BY b.bin_name, p.product_name
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Error fetching product details.' });
  }
});

app.post('/api/calculate-rearrangement', async (req, res) => {
  const currentProducts = req.body;
  try {
    const binGroups = currentProducts.reduce((acc, product) => {
      if (!acc[product.bin_name]) acc[product.bin_name] = [];
      acc[product.bin_name].push({ ...product });
      return acc;
    }, {});

    const binTotals = Object.entries(binGroups).reduce((acc, [binName, products]) => {
      acc[binName] = products.reduce((sum, p) => sum + p.quantity, 0);
      return acc;
    }, {});

    const binsNeeding = Object.entries(binTotals).filter(([, total]) => total < 6).map(([bin]) => bin);
    const binsWithExcess = Object.entries(binTotals).filter(([, total]) => total > 6).map(([bin]) => bin);

    for (const needyBin of binsNeeding) {
      const needed = 6 - binTotals[needyBin];
      for (const excessBin of binsWithExcess) {
        if (binTotals[excessBin] <= 6) continue;

        const available = binTotals[excessBin] - 6;
        const transferAmount = Math.min(needed, available);

        const productToMove = binGroups[excessBin].find(p => p.quantity > 0);
        if (productToMove) {
          const moveAmount = Math.min(transferAmount, productToMove.quantity);
          productToMove.quantity -= moveAmount;

          const existing = binGroups[needyBin].find(p => p.product_name === productToMove.product_name);
          if (existing) {
            existing.quantity += moveAmount;
          } else {
            binGroups[needyBin].push({ ...productToMove, bin_name: needyBin, quantity: moveAmount });
          }

          binTotals[needyBin] += moveAmount;
          binTotals[excessBin] -= moveAmount;

          if (binTotals[needyBin] === 6) break;
        }
      }
    }

    const rearranged = Object.values(binGroups).flat();
    res.status(200).json(rearranged);
  } catch (err) {
    console.error('Error calculating rearrangement:', err);
    res.status(500).json({ error: err.message || 'Rearrangement calculation failed.' });
  }
});

app.post('/api/save-rearrangement', async (req, res) => {
  const rearranged = req.body;
  try {
    await asyncDb.beginTransaction();
    await asyncDb.query('DELETE FROM bin_products');

    for (let product of rearranged) {
      const [bin] = await asyncDb.query(`SELECT id FROM bins WHERE bin_name = ?`, [product.bin_name]);
      const [prod] = await asyncDb.query(`SELECT id FROM productss WHERE product_name = ?`, [product.product_name]);
      if (bin.length === 0 || prod.length === 0) throw new Error('Invalid bin or product name.');

      await asyncDb.query(
        `INSERT INTO bin_products (bin_id, product_id, quantity) VALUES (?, ?, ?)`,
        [bin[0].id, prod[0].id, product.quantity]
      );
    }

    await asyncDb.commit();
    const [updated] = await asyncDb.query(`
      SELECT
        p.product_name,
        b.bin_name,
        b.x AS rack_x,
        b.y AS rack_y,
        bp.quantity,
        b.max_capacity
      FROM bin_products bp
      JOIN productss p ON bp.product_id = p.id
      JOIN bins b ON bp.bin_id = b.id
      ORDER BY b.bin_name, p.product_name
    `);
    res.status(200).json(updated);
  } catch (err) {
    await asyncDb.rollback();
    console.error('Error saving rearrangement:', err);
    res.status(500).json({ error: err.message || 'Rearrangement save failed.' });
  }
});

// ------------------------ Misc Routes ------------------------
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
