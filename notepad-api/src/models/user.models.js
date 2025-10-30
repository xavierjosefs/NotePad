import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import { error, log } from "console";
import crypto from "crypto";
import passwordGenerator from "secure-random-password";

// Obtener todos los usuarios
export const getUsers = async () => {
  try {
    const result = await pool.query(
      "select id , email, role, created_at from users"
    );
    return result.rows;
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
    return result.rows[0];
  } catch (err) {
    console.error(err);
  }
};

export const getUsersByEmail = async (email) => {
  try {
    const result = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    //si no hay resultados, devuelve null
    if (result.rows.length === 0) {
      return null;
    }

    // devuelve el objeto completo
    return result.rows[0];
  } catch (err) {
    console.error("❌ Error in getUsersByEmail:", err);
    throw err;
  }
};


// Obtener crear usuario
export const createUser = async (email, password, name, avatar = null) => {
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
  const params = [id, normalizedEmail, passwordHash, normalizedName, avatar];

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

// Cambiar la contraseña de un usuario
export async function setNewPasswordForUser(userId, newPassword) {
  if (!userId || !newPassword) throw new Error("INVALID_INPUT");
  const hash = await bcrypt.hash(newPassword, 10);
  const res = await pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [hash, userId]);
  console.log("Password update result:", res);
  return true;
}

// Insertar OTP en la base de datos
export async function upsertPasswordResetCodeByEmail(email, ttlMinutes = 5) {
  try {
    const user= await getUsersByEmail(email);
    const userId = user.id;
    if (!userId) {
      throw new Error("EMAIL_NOT_FOUND")
    }
    const code = passwordGenerator.randomPassword({
      length: 6,
      characters: passwordGenerator.digits,
    });
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    const resetId = crypto.randomUUID();

    await pool.query(
      `INSERT INTO password_reset_codes (id, user_id, code, expires_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id)
      DO UPDATE
        SET id = EXCLUDED.id,
            code = EXCLUDED.code,
            expires_at = EXCLUDED.expires_at,
            attempts = 0,
            consumed_at = NULL;`,
        [resetId, userId, code, expiresAt]
        );

    return { resetId, userId, code, expiresAt };
  } catch (err) {
    throw err;
  }
  
}

export async function verifyPasswordResetCodeByEmail(email, codeInput) {
  const user = await getUsersByEmail(email);
  const userId = user?.id;
  if (!userId) throw new Error("EMAIL_NOT_FOUND");

  // Trae el OTP activo más reciente
  const r = await pool.query(
    `
    SELECT id, code, expires_at, attempts
    FROM password_reset_codes
    WHERE user_id = $1 AND consumed_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [userId]
  );
  if (r.rowCount === 0) throw new Error("CODE_NOT_FOUND");

  const row = r.rows[0];

  // Expirado
  if (new Date(row.expires_at) < new Date()) {
    // Puedes marcarlo consumido al expirar si quieres
    await pool.query(`UPDATE password_reset_codes SET consumed_at = now() WHERE id = $1`, [row.id]);
    throw new Error("CODE_EXPIRED");
  }

  // No coincide → incrementa attempts
  if (row.code !== String(codeInput).trim()) {
    await pool.query(`UPDATE password_reset_codes SET attempts = attempts + 1 WHERE id = $1`, [row.id]);
    throw new Error("INVALID_CODE");
  }

  // OK → consumir
  await pool.query(`UPDATE password_reset_codes SET consumed_at = now() WHERE id = $1`, [row.id]);

  return { userId };
}



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
