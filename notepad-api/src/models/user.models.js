import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import { error, log } from "console";
import crypto from "crypto";

// Obtener todos los usuarios
export const getUsers = async () => {
  try {
    const result = await pool.query(
      "select id , email, role, created_at from users"
    );
    console.log(result.rows);
  } catch (error) {
    console.error(error);
  }
};

// Obtener usuarios por id
export const getUsersById = async (id) => {
  try {
    const result = await pool.query(
      `select id , email, role, created_at from users where id = $1`,
      [id]
    );
    console.log(result.rows);
  } catch (err) {
    console.error(err);
  }
};

// Obtener crear usuario
export const createUser = async (email, password, name, avatarBase64 = null) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();

  const search = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
  if (search.rowCount !== 0) throw new Error("EMAIL_TAKEN");

  const id = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO users (id, email, password_hash, full_name, avatar)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`;
  const params = [id, normalizedEmail, passwordHash, normalizedName, avatarBase64];

  const result = await pool.query(sql, params);
  return result.rows[0].id;
};


export const login = async (email, password) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const { rows } = await pool.query(
      `select * from users where email = $1`,
      [normalizedEmail]
    );
    if (rows.length === 0) throw new Error("EMAIL_NOT_FOUND");
    const user = rows[0];

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) throw new Error("PASSWORD_INCORRECT");

    return { user };
  } catch (err) {
    throw err;
  }
};

// Obtener cambiar contraseña
export const changePassword = async (email, newPassword) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const { rows } = await pool.query(
      "SELECT password_hash FROM users WHERE email = $1",
      [normalizedEmail]
    );
    if (rows.length === 0) throw new Error("USER_NOT_FOUND");

    const isSame = await bcrypt.compare(newPassword, rows[0].password_hash);
    if (isSame) throw new Error("SAME_PASSWORD");

    const newHash = await bcrypt.hash(newPassword, 10);
    const update = await pool.query(
      "UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id",
      [newHash, normalizedEmail]
    );
    if (update.rows.length === 0) throw new Error("USER_NOT_FOUND");
    return update.rows[0].id;
  } catch (err) {
    throw err;
  }
};

export const loadProfile = async (id) => {
  try{
    const result = await pool.query("select * from users where id = $1", [id])
    if(result.rowCount === 0) {
      throw new error("USER_NOT_FOUND");
    }
    return result.rows;
  } catch(err) {
    throw err
  }
}
