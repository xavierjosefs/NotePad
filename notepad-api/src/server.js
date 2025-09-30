import express from "express";
import { createUser, changePassword, login } from "./models/user.models.js";
import { error } from "console";

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const id = await createUser(email, password);
    return res.status(201).json({ id });
  } catch (e) {
    const code = e.message === "EMAIL_TAKEN" ? 409 : 400;
    return res.status(code).json({ error: e.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await login(email, password);
    return res.status(200).json({ user });
  } catch (e) {
    const msg = e?.message ?? "INTERNAL_ERROR";
    const code = msg === "EMAIL_NOT_FOUND" || "PASSWORD_INCORRECT" ? 401 : 500;

    return res.status(code).json({ error: msg });
  }
});

app.post("/changepassword", async (req, res) => {
  const { email, newPassword } = req.body;
  console.log("BODY:", req.body); // debería mostrar { email, newPassword }

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

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
