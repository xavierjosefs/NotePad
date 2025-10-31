// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
// importa tus módulos
import {
  createUser, login, loadProfile,
  setNewPasswordForUser, verifyPasswordResetCodeByEmail,
  upsertPasswordResetCodeByEmail
} from "./models/user.models.js";
import {
  getNotes, createNote, toggleFavorite, getNotesFavorites,
  getNotesArchived, softDeleteNote, restoreDeletedNote,
  getDeletedNotes, archiveNote, changeNoteTitle, permanentDeleteNote,
} from "./models/note.models.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { verifyUser } from "./middleware/verifyUser.js";
import { sendEmail } from "./middleware/emailSend.js";

const app = express();
app.set("trust proxy", 1);

// body parsers (una sola vez)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173"
  ];

  if (origin && (allowed.includes(origin) || origin.endsWith(".vercel.app"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});



// ---------- Rutas ----------
app.get("/healthz", (req, res) => res.status(200).send("ok"));

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

app.get("/", verifyUser, (_req, res) => res.sendStatus(200));

app.get("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  });
  res.status(200).json({ message: "Logout successful" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "INVALID_INPUT" });

  try {
    const user = await login(email, password);
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
      maxAge: 15 * 60 * 1000,
      path: "/",
    });
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ error: e.message ?? "INTERNAL_ERROR" });
  }
});

// Forgot/OTP
app.post("/changepassemail", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "INVALID_INPUT" });

    const { code, expiresAt } = await upsertPasswordResetCodeByEmail(email, 5);
    await sendEmail(email, "Password Reset Code", `Your code is: ${code} (expires at ${expiresAt.toISOString()})`);
    res.status(200).json({ message: "Verification code sent" });
  } catch (err) {
    const msg = err.message || "INTERNAL_ERROR";
    res.status(msg === "EMAIL_NOT_FOUND" ? 404 : 500).json({ error: msg });
  }
});

app.post("/verifyotp", async (req, res) => {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ error: "INVALID_INPUT" });

    const { userId } = await verifyPasswordResetCodeByEmail(email, code);
    const resetToken = jwt.sign({ userId }, process.env.SECRET_KEY.toString(), { expiresIn: "10m" });

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("resetToken", resetToken, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      maxAge: 10 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({ message: "CODE_VERIFIED" });
  } catch (err) {
    const msg = err.message || "INTERNAL_ERROR";
    const map = { EMAIL_NOT_FOUND: 404, CODE_NOT_FOUND: 404, CODE_EXPIRED: 410, INVALID_CODE: 401 };
    res.status(map[msg] ?? 500).json({ error: msg });
  }
});

app.post("/resetpassword", async (req, res) => {
  try {
    const { newPassword } = req.body || {};
    const resetToken = req.cookies.resetToken;
    if (!resetToken || !newPassword) return res.status(400).json({ error: "INVALID_INPUT" });

    let payload;
    try {
      payload = jwt.verify(resetToken, process.env.SECRET_KEY.toString());
    } catch {
      return res.status(401).json({ error: "INVALID_OR_EXPIRED_TOKEN" });
    }
    await setNewPasswordForUser(payload.userId, newPassword);
    res.status(200).json({ message: "PASSWORD_UPDATED" });
  } catch {
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

// Notas
app.post("/createnote", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { title, content } = req.body;
    const note = await createNote(id, title, content);
    res.status(201).json({ message: "Note created successfully", note });
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    res.status(msg === "INVALID_ID" ? 404 : msg === "INVALID_TITLE" ? 406 : 500).json({ error: msg });
  }
});

app.get("/api/user/notes", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const notes = await getNotes(id);
    res.status(200).json({ notes });
  } catch {
    res.status(500).json({ error: "PROBLEM_LOADING_NOTES" });
  }
});

app.put("/api/user/notes/favorite", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { noteId } = req.body ?? {};
    await toggleFavorite(id, noteId);
    res.sendStatus(200);
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    res.status(msg === "NOTE_NOT_FOUND" ? 404 : 500).json({ error: msg });
  }
});

app.get("/api/archived/notes", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const archiNotes = await getNotesArchived(id);
    res.status(200).json({ archiNotes });
  } catch {
    res.status(500).json({ error: "PROBLEM_LOADING_NOTES" });
  }
});

app.get("/api/favorite/notes", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const favNotes = await getNotesFavorites(id);
    res.status(200).json({ favNotes });
  } catch {
    res.status(500).json({ error: "PROBLEM_LOADING_NOTES" });
  }
});

app.get("/api/user/profile", verifyToken, async (req, res) => {
  try {
    const { id } = req.user;
    const profile = await loadProfile(id);
    res.status(200).json(profile);
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    res.status(msg === "USER_NOT_FOUND" ? 404 : 500).json({ error: msg });
  }
});

app.put("/api/user/notes/archived", verifyToken, async (req, res) => {
  try {
    const { noteId } = req.body ?? {};
    await archiveNote(noteId);
    res.sendStatus(200);
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    res.status(msg === "NOTE_NOT_FOUND" ? 404 : 500).json({ error: msg });
  }
});

app.put("/api/note/change-title", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user || {};
    const { noteId, newTitle } = req.body || {};
    if (!userId) return res.status(401).json({ error: "NO_AUTH" });
    if (!noteId || !newTitle?.trim()) return res.status(400).json({ error: "INVALID_INPUT" });

    const updated = await changeNoteTitle(userId, noteId, newTitle.trim());
    if (!updated) return res.status(404).json({ error: "NOTE_NOT_FOUND" });
    res.status(200).json({ note: updated });
  } catch (err) {
    console.error("❌ /api/note/change-title error:", err);
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

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

app.delete("/api/note/permanent-delete", verifyToken, async (req, res) => {
  try {
    const { noteId } = req.body ?? {};
    if (!noteId) return res.status(400).json({ error: "INVALID_INPUT" });

    const result = await permanentDeleteNote(noteId);
    if (!result || result.rowCount === 0) return res.status(404).json({ error: "NOTE_NOT_FOUND" });
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error deleting permanently:", err);
    res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

// 404 final
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

export default app;
