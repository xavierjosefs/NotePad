import express from "express";
import cors from "cors"
import jwt from "jsonwebtoken"
import { createUser, changePassword, login } from "./models/user.models.js";
import { getNotes, createNote } from "./models/note.models.js";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/verifyToken.js";
import { verifyUser } from "./middleware/verifyUser.js";
import { verify } from "crypto";

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(cookieParser());

app.post("/register", async (req, res) => {
  const { email, password , name} = req.body ?? {};
  if (!email || !password || !name) return res.status(400).json({ error: "INVALID_INPUT" });

  try {
    const user = await createUser(email, password, name);
    return res.status(201).json({user});
  } catch (e) {
    const code = e.message === "EMAIL_TAKEN" ? 409 : 400;
    return res.status(code).json({ error: e.message });
  }
});

app.get("/", verifyUser, (req, res) => {
  return res.sendStatus(200)
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "INVALID_INPUT" });

  try {
    const user = await login(email, password);
    const token = jwt.sign({ id: user.user.id, email: user.user.email },process.env.SECRET_KEY.toString(),{ expiresIn: "1d" });
    res.cookie('token', token)
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
    await createNote(id, title, content);
    return res.sendStatus(200);
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


app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
