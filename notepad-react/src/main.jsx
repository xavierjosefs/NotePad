// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthLayout from "./organism/AuthLayout";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthLayout />
  </StrictMode>
);
