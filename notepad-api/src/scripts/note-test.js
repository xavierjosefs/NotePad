import "dotenv/config";
import { toggleFavorite } from "../models/note.models.js";

async function main() {
  try {
    const userId = "1a5d6a2e-c815-4753-aad3-11f0c91c774b"; // <-- pon un user_id real que exista
    const noteId = "97b1379e-5b73-4848-8837-5e043846eb4e";

    const note = await toggleFavorite(userId, noteId);
    console.log(note);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}

main();
