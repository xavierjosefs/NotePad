import React from "react";
import Home from "./organism/Home"
import Register from "./organism/Register";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./organism/Login";

export default function App() {
    return (
        <BrowserRouter >
            <Routes>
                <Route path="/" element={<Home />} />?
                {/* <Route path="*" element={<Navigate to="/login" replace />} />? */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}