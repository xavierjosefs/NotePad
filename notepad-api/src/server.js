import express from "express";
import cors from "cors"
import jwt from "jsonwebtoken"
import { createUser, changePassword, login } from "./models/user.models.js";
import { getNotes } from "./models/note.models.js";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/verifyToken.js";

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(cookieParser());

app.post("/register", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "INVALID_INPUT" });

  try {
    const user = await createUser(email, password);
    return res.status(201).json({user});
  } catch (e) {
    const code = e.message === "EMAIL_TAKEN" ? 409 : 400;
    return res.status(code).json({ error: e.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "INVALID_INPUT" });

  try {
    const user = await login(email, password);
    const token = jwt.sign({ id: user.user.id, email: user.user.email },process.env.SECRET_KEY.toString(),{ expiresIn: "1d" });
    console.log(jwt.verify(token, process.env.SECRET_KEY.toString()));
    res.cookie('token', token)
    return res.status(200).json({user });
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    const code =
      msg === "EMAIL_NOT_FOUND" || msg === "PASSWORD_INCORRECT" ? 401 : 500; 
    return res.status(code).json({ error: msg });
  }
});


app.post("/changepassword", async (req, res) => {
  const { email, newPassword } = req.body;
  console.log("BODY:", req.body);

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

app.get("/api/user/notes", verifyToken, async (req, res) => {
  try {
    console.log("Usuario autenticado:", req.user);

    const { id } = req.user;
    console.log(req.user)
    const notes = await getNotes(id);
    console.log("Notas encontradas:", notes);

    return res.status(200).json({ notes });
  } catch (e) {
    console.error(e);
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
