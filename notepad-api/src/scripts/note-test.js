import "dotenv/config";
import { createNote } from "../models/note.models.js";

async function main() {
  try {
    const userId = "1a5d6a2e-c815-4753-aad3-11f0c91c774b"; // <-- pon un user_id real que exista
    const title = "Mi día Favorito";
    const content = "El día en que la conocí a ella, definitivamente.";

    const note = await createNote(userId, title, content);
    console.log("✅ Nota creada:", note);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}

main();
