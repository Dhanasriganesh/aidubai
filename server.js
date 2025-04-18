import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const db = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "dubai", // Ensure this is the correct DB name
});

// ---------------------- Existing Routes ------------------------

// Fetch all products
app.get("/products", (req, res) => {
  const query = "SELECT * FROM products1";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database Fetch Error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json(results);
  });
});

// ------------------------ New Routes for Replenishment ------------------------

// Get available workers (worker pool for task assignment)
app.get("/api/workers", (req, res) => {
  const query = "SELECT * FROM workers WHERE assigned_task_count < 5 LIMIT 1"; // Fetch workers with less than 5 tasks assigned
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching workers:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No available workers" });
    }
    res.json(results); // Returns available workers
  });
});

// Assign replenishment task to worker
app.post("/api/replenish", (req, res) => {
  const { productId, productName } = req.body;

  // Step 1: Find an available worker
  db.query("SELECT * FROM workers WHERE assigned_task_count < 5 LIMIT 1", (err, workers) => {
    if (err) {
      console.error("Error finding worker:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (workers.length === 0) {
      return res.status(404).json({ message: "No available workers" });
    }

    const worker = workers[0];
    console.log("Assigned worker:", worker.worker_name); // Debug log to see which worker is being assigned

    // Step 2: Create the replenishment task
    const taskQuery =
      "INSERT INTO tasks (product_id, product_name, assigned_worker_id) VALUES (?, ?, ?)";
    db.query(taskQuery, [productId, productName, worker.worker_id], (err, result) => {
      if (err) {
        console.error("Error inserting task:", err);
        return res.status(500).json({ error: "Failed to create task", details: err });
      }

      // Step 3: Update the worker's task count
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

// ------------------------ Other Routes (Existing) ------------------------

// Fetch all products (from the second code)
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Other existing routes...

// Start the server on port 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
