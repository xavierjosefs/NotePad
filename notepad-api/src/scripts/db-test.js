import { pool } from "../config/db.js";

try {
  const { rows } = await pool.query("select now()");
  console.log("DB OK:", rows[0].now);
  process.exit(0);
} catch (e) {
  console.error("DB ERROR:", e);
  process.exit(1);
}
