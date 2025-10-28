// server.js
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import {
  createUser,
  changePassword,
  login,
  loadProfile,
} from "./models/user.models.js";

import {
  getNotes,
  createNote,
  toggleFavorite,
  getNotesFavorites,
  getNotesArchived,
  softDeleteNote,
  restoreDeletedNote,
  getDeletedNotes,
  archiveNote,
  changeNoteTitle,
  permanentDeleteNote,
} from "./models/note.models.js";

import { verifyToken } from "./middleware/verifyToken.js";
import { verifyUser } from "./middleware/verifyUser.js";

const app = express();

// 1) Proxy para cookies secure detrás de Render/Heroku/Nginx
app.set("trust proxy", 1);

// 2) Body parser (SOLO express.json). Sube el límite para avatar base64.
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// 3) CORS con lista blanca dinámica
const isProd = process.env.NODE_ENV === "production";

// Configuración CORS completa
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const allowedOrigins = [
  "http://localhost:5173",
  "https://fast-notes.vercel.app",
  "https://fast-notes-git-main-xaviers-projects-89dc2232.vercel.app"
];

app.use(
  cors({
    origin(origin, callback) {
      // Permitir sin origin (por ejemplo, Postman o SSR interno)
      if (!origin) return callback(null, true);

      // Permitir todos los subdominios de Vercel
      const isVercelSubdomain = /\.vercel\.app$/.test(new URL(origin).hostname);

      if (allowedOrigins.includes(origin) || isVercelSubdomain) {
        callback(null, true);
      } else {
        console.warn("🚫 CORS bloqueado para:", origin);
        callback(new Error("CORS_NOT_ALLOWED"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ Manejo de preflight universal (Express 5 safe)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});


app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ---------- Rutas ----------

app.get("/healthz", (req, res) => res.status(200).send("ok"));

app.post("/register", async (req, res) => {
  try {
    const { email, password, name, avatar } = req.body;
    const userId = await createUser(email, password, name, avatar);
    return res.status(201).json({ id: userId });
  } catch (err) {
    console.error("❌ Register error:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

app.get("/", verifyUser, (req, res) => {
  return res.sendStatus(200);
});

app.get("/logout", (req, res) => {
  // Usa los mismos flags que en /login
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  });
  return res.status(200).json({ message: "Logout successful" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  console.log("🧩 LOGIN attempt:", { email });

  if (!email || !password) {
    console.log("⚠️ Missing fields in login");
    return res.status(400).json({ error: "INVALID_INPUT" });
  }

  try {
    const user = await login(email, password);
    console.log("✅ User found:", user?.user?.email);

    if (!process.env.SECRET_KEY) {
      console.error("❌ SECRET_KEY not defined in environment!");
      return res.status(500).json({ error: "SERVER_CONFIG_ERROR" });
    }

    const token = jwt.sign(
      { id: user.user.id, email: user.user.email, name: user.user.name },
      process.env.SECRET_KEY.toString(),
      { expiresIn: "15m" }
    );

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      maxAge: 900 * 1000,
    });

    return res.sendStatus(200);
  } catch (e) {
    console.error("❌ LOGIN error:", e.message);
    return res.status(500).json({ error: e.message || "INTERNAL_ERROR" });
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

app.post("/createnote", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { title, content } = req.body;
    const note = await createNote(id, title, content);
    return res
      .status(201)
      .json({ message: "Note created successfully", note });
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    const code = msg === "INVALID_ID" ? 404 : msg === "INVALID_TITLE" ? 406 : 500;
    return res.status(code).json({ error: msg });
  }
});

app.get("/api/user/notes", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const notes = await getNotes(id);
    return res.status(200).json({ notes });
  } catch {
    return res.status(500).json({ error: "PROBLEM_LOADING_NOTES" });
  }
});

app.put("/api/user/notes/favorite", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { noteId } = req.body ?? {};
    await toggleFavorite(id, noteId);
    return res.sendStatus(200);
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    return res.status(msg === "NOTE_NOT_FOUND" ? 404 : 500).json({ error: msg });
  }
});

app.get("/api/archived/notes", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const archiNotes = await getNotesArchived(id);
    return res.status(200).json({ archiNotes });
  } catch {
    return res.status(500).json({ error: "PROBLEM_LOADING_NOTES" });
  }
});

app.get("/api/favorite/notes", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const favNotes = await getNotesFavorites(id);
    return res.status(200).json({ favNotes });
  } catch {
    return res.status(500).json({ error: "PROBLEM_LOADING_NOTES" });
  }
});

app.get("/api/user/profile", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const profile = await loadProfile(id);
    return res.status(200).json(profile); // 200, no 201
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    return res.status(msg === "USER_NOT_FOUND" ? 404 : 500).json({ error: msg });
  }
});

app.put("/api/user/notes/archived", verifyToken, async (req, res) => {
  try {
    const { noteId } = req.body ?? {};
    await archiveNote(noteId);
    return res.sendStatus(200);
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    return res.status(msg === "NOTE_NOT_FOUND" ? 404 : 500).json({ error: msg });
  }
});

app.put("/api/note/change-title", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user || {};
    const { noteId, newTitle } = req.body || {};
    if (!userId) return res.status(401).json({ error: "NO_AUTH" });
    if (!noteId || !newTitle || !newTitle.trim())
      return res.status(400).json({ error: "INVALID_INPUT" });

    const updated = await changeNoteTitle(userId, noteId, newTitle.trim());
    if (!updated) return res.status(404).json({ error: "NOTE_NOT_FOUND" });
    return res.status(200).json({ note: updated });
  } catch (err) {
    console.error("❌ /api/note/change-title error:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

// Deleted
app.get("/api/deleted/notes", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user || {};
    const deletedNotes = await getDeletedNotes(userId);
    return res.status(200).json({ deletedNotes });
  } catch (err) {
    console.error("Error getting deleted notes:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

app.put("/api/user/note/delete", verifyToken, async (req, res) => {
  try {
    const { id } = req.user || {};
    const { noteId } = req.body || {};
    if (!noteId) return res.status(400).json({ error: "MISSING_NOTE_ID" });

    const deleted = await softDeleteNote(id, noteId);
    if (!deleted) return res.status(404).json({ error: "NOTE_NOT_FOUND" });
    return res.status(200).json({ deleted });
  } catch (err) {
    console.error("Error soft-deleting note:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

app.put("/api/note/restore", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user || {};
    const { noteId } = req.body || {};
    const restored = await restoreDeletedNote(userId, noteId);
    if (!restored) return res.status(404).json({ error: "NOTE_NOT_FOUND" });
    return res.status(200).json({ restored });
  } catch (err) {
    console.error("Error restoring note:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

app.delete("/api/note/permanent-delete", verifyToken, async (req, res) => {
  try {
    const { noteId } = req.body ?? {};
    if (!noteId) return res.status(400).json({ error: "INVALID_INPUT" });

    const result = await permanentDeleteNote(noteId); // devuelve result
    if (!result || result.rowCount === 0)
      return res.status(404).json({ error: "NOTE_NOT_FOUND" });

    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error deleting permanently:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
