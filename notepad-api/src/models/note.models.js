import { error } from "console";
import { pool } from "../config/db.js";
import crypto from "crypto";

const validateTitle = async(user_id) => {
    const query = await pool.query(`select title from notes where user_id = $1`, [user_id]);
    if(query.rowCount !== 0){
        throw new Error("You need to use a unique title for any each note")
    }
}

const validateUser = async(user_id) => {
    const query = await pool.query(`select * from users where id = $1`, [user_id])
    if(query.rowCount === 0){
        throw new Error("Invalid_Id")
    }
}

//Crear una nota
export const createNote = async (user_id, title, content) => {
    try {
        await validateTitle(user_id)
        await validateUser(user_id);
        const id = crypto.randomUUID()
        const result = await pool.query(`insert into notes (id ,user_id, title, content_md) values ($1, $2, $3, $4)`, [id, user_id, title, content]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

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

