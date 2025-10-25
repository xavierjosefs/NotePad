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
        const result = await pool.query(`insert into notes (id ,user_id, title, content_md) values ($1, $2, $3, $4) RETURNING id ,user_id, title, content_md`, [id, user_id, title, content]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

//Listar notas por id
export const getNotes = async (user_id) => {
  try {
    const result = await pool.query(
      `SELECT * 
       FROM notes 
       WHERE user_id = $1 
       AND (archived IS NULL OR archived = false) AND deleted = false
       ORDER BY created_at DESC`,
      [user_id]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};


//Listar notas por favoritas
export const getNotesFavorites = async (user_id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notes WHERE user_id = $1 and favorite = true and archived = false AND deleted = false ORDER BY created_at DESC`,
      [user_id]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

//Listar notas archivadas
export const getNotesArchived = async (user_id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notes WHERE user_id = $1 and archived = true AND deleted = false ORDER BY created_at DESC`,
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



export const archiveNote = async (noteId) => {
  try {
    const result = await pool.query(
      `UPDATE notes
         SET archived = NOT COALESCE(archived, false)
       WHERE id = $1
       RETURNING id, title, archived`,
      [noteId]
    );

    if (result.rowCount === 0) throw new Error("NOTE_NOT_FOUND");
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export async function changeNoteTitle(userId, noteId, newTitle) {
  console.log("🧩 changeNoteTitle inputs:", { userId, noteId, newTitle });

  try {
    const result = await pool.query(
      `UPDATE notes
         SET title = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING id, title`,
      [newTitle, noteId, userId]
    );

    console.log("✅ rowCount:", result.rowCount);
    if (result.rowCount === 0) return null;
    return result.rows[0];
  } catch (err) {
    console.error("❌ SQL error:", err);
    throw err;
  }
}

// (soft delete)
export async function softDeleteNote(userId, noteId) {
  const result = await pool.query(
    `UPDATE notes
       SET deleted = TRUE, updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING id, title, deleted`,
    [noteId, userId]
  );
  return result.rows[0] || null;
}

//Restaurar una nota eliminada
export async function restoreDeletedNote(userId, noteId) {
  const result = await pool.query(
    `UPDATE notes
       SET deleted = FALSE, updated_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING id, title, deleted`,
    [noteId, userId]
  );
  return result.rows[0] || null;
}

//Obtener todas las notas eliminadas
export async function getDeletedNotes(userId) {
  const result = await pool.query(
    `SELECT * FROM notes
     WHERE user_id = $1 AND deleted = TRUE
     ORDER BY updated_at DESC`,
    [userId]
  );
  return result.rows;
}






