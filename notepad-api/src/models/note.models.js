import { error } from "console";
import { pool } from "../config/db.js";
import crypto from "crypto";
import { title } from "process";

const validateTitle = async(user_id, title) => {
    const query = await pool.query(`select title from notes where user_id = $1 and title = $2` , [user_id, title]);
    if(query.rowCount !== 0){
        throw new Error("INVALID_TITLE")
    }
}

const validateUser = async(user_id) => {
    const query = await pool.query(`select * from users where id = $1`, [user_id])
    if(query.rowCount === 0){
        throw new Error("INVALID_ID")
    }
}

//Crear una nota
export const createNote = async (user_id, title, content) => {
    try {
        await validateTitle(user_id, title)
        await validateUser(user_id);
        const id = crypto.randomUUID()
        const result = await pool.query(`insert into notes (id ,user_id, title, content_md) values ($1, $2, $3, $4)`, [id, user_id, title, content]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

//Listar notas por id
export const getNotes = async (user_id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

//cambiar a favoritos
export const toggleFavorite = async (userId, noteId) => {
  try {
    const { rows } = await pool.query(
      `UPDATE notes
         SET favorite = NOT COALESCE(favorite, false)
       WHERE id = $1 AND user_id = $2
       RETURNING id, title, favorite`,
      [noteId, userId]
    );

    if (rows.length === 0) throw new Error("NOTE_NOT_FOUND");
    return rows[0];
  } catch (err) {
    throw err;
  }
};


