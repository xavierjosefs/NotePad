import express from "express";
import cors from "cors"
import jwt from "jsonwebtoken"
import { createUser, changePassword, login, loadProfile } from "./models/user.models.js";
import { getNotes, createNote, toggleFavorite,getNotesFavorites, getNotesArchived,softDeleteNote, restoreDeletedNote, getDeletedNotes, archiveNote, changeNoteTitle, permanentDeleteNote } from "./models/note.models.js";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/verifyToken.js";
import { verifyUser } from "./middleware/verifyUser.js";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(cookieParser());

app.post("/register", async (req, res) => {
  try {
    const { email, password, name, avatar } = req.body;
    const userId = await createUser(email, password, name, avatar);
    res.status(201).json({ id: userId });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});


app.get("/", verifyUser, (req, res) => {
  return res.sendStatus(200)
})

app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res.status(200).json({ message: "Logout successful" });
});


app.post("/login", async (req, res) => {
  
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "INVALID_INPUT" });

  try {
    const user = await login(email, password);
    const token = jwt.sign({ id: user.user.id, email: user.user.email, name: user.user.name },process.env.SECRET_KEY.toString(),{ expiresIn: "15m" });
    
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 900 * 1000,
    });

    return res.sendStatus(200);
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    const code =
      msg === "EMAIL_NOT_FOUND" || msg === "PASSWORD_INCORRECT" ? 401 : 500; 
    return res.status(code).json({ error: msg });
  }
});


app.post("/changepassword", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const id = await changePassword(email, newPassword);
    return res.status(200).json({ id });
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    const code =
      msg === "USER_NOT_FOUND"
        ? 404
        : msg === "SAME_PASSWORD"
        ? 409
        : msg === "INVALID_INPUT"
        ? 400
        : 500;
    return res.status(code).json({ error: msg });
  }
});

app.post("/createnote", verifyToken, async (req,res) => {
  try {
    const  { id } = req.user;
    const { title, content } = req.body;
    const note = await createNote(id, title, content);
    return res.status(201).json({ message: "Note created successfully", note });
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    const code =
      msg === "INVALID_ID"
        ? 404
        : msg === "INVALID_TITLE"
        ? 406

        : 500;
    return res.status(code).json({ error: msg });
  }
  

});

app.get("/api/user/notes", verifyToken, async (req, res) => {
  try {

    const { id } = req.user;
    const notes = await getNotes(id);

    return res.status(200).json({ notes });
  } catch (e) {
    return res.status(500).json({ error: "PROBLEM_LOADING_NOTES" });
  }
});

app.put("/api/user/notes/favorite", verifyToken, async(req, res) => {
  try {
    const { id } = req.user;
    const { noteId } = req.body ?? {};

    await toggleFavorite(id, noteId)
    return res.sendStatus(200);
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    const code =
      msg === "NOTE_NOT_FOUND"
        ? 404
        : 500;
    return res.status(code).json({ error: msg });
  }
})

app.get("/api/archived/notes", verifyToken, async (req,res) => {
  try {

    const { id } = req.user;
    const archiNotes = await getNotesArchived(id);

    return res.status(200).json({ archiNotes });
  } catch (e) {
    return res.status(500).json({ error: "PROBLEM_LOADING_NOTES" });
  }
})

app.get("/api/favorite/notes", verifyToken, async (req,res) => {
  try {

    const { id } = req.user;
    const favNotes = await getNotesFavorites(id);

    return res.status(200).json({ favNotes });
  } catch (e) {
    return res.status(500).json({ error: "PROBLEM_LOADING_NOTES" });
  }
})

app.get("/api/user/profile", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const profile = await loadProfile(id);
    return res.status(201).json(profile)
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    const code =
      msg === "USER_NOT_FOUND"
        ? 404
        : 500;
    return res.status(code).json({ error: msg });
  }
})


app.put("/api/user/notes/archived", verifyToken, async(req, res) => {
  try {
    const { noteId } = req.body ?? {};

    console.log("📝 NoteID:", noteId);

    await archiveNote(noteId)
    return res.sendStatus(200);
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    const code =
      msg === "NOTE_NOT_FOUND"
        ? 404
        : 500;
    return res.status(code).json({ error: msg });
  }
})

app.put("/api/note/change-title", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user || {};
    const { noteId, newTitle } = req.body || {};

    if (!userId) return res.status(401).json({ error: "NO_AUTH" });
    if (!noteId || !newTitle || !newTitle.trim()) {
      return res.status(400).json({ error: "INVALID_INPUT" });
    }

    const updated = await changeNoteTitle(userId, noteId, newTitle.trim());
    if (!updated) return res.status(404).json({ error: "NOTE_NOT_FOUND" });

    return res.status(200).json({ note: updated });
  } catch (err) {
    console.error("❌ /api/note/change-title error:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

//notas eliminadas
app.get("/api/deleted/notes", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user || {};
    const deletedNotes = await getDeletedNotes(userId);
    res.status(200).json({ deletedNotes });
  } catch (err) {
    console.error("Error getting deleted notes:", err);
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

// Soft delete
app.put("/api/user/note/delete", verifyToken, async (req, res) => {
  try {
    const { id } = req.user || {};
    const { noteId } = req.body || {};

    if (!noteId) return res.status(400).json({ error: "MISSING_NOTE_ID" });

    const deleted = await softDeleteNote(id, noteId);
    if (!deleted) return res.status(404).json({ error: "NOTE_NOT_FOUND" });

    res.status(200).json({ deleted });
  } catch (err) {
    console.error("Error soft-deleting note:", err);
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

//Restaurar una nota eliminada
app.put("/api/note/restore", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user || {};
    const { noteId } = req.body || {};

    const restored = await restoreDeletedNote(userId, noteId);
    if (!restored) return res.status(404).json({ error: "NOTE_NOT_FOUND" });

    res.status(200).json({ restored });
  } catch (err) {
    console.error("Error restoring note:", err);
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

// Eliminar definitivamente
app.delete("/api/note/permanent-delete", verifyToken, async (req, res) => {
  try {
    const { noteId } = req.body ?? {};

    if (!noteId) {
      return res.status(400).json({ error: "INVALID_INPUT" });
    }

    const deleted = await permanentDeleteNote(noteId);

    if (deleted.rowCount === 0) {
      return res.status(404).json({ error: "NOTE_NOT_FOUND" });
    }

    console.log("🗑️ Permanently deleted:", deleted.rows[0]);
    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error deleting permanently:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});


app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
