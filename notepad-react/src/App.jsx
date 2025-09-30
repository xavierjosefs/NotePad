import React from "react";
import Home from "./organism/Home"
import Register from "./organism/Register";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./organism/Login";

export default function App() {
    return (
        <BrowserRouter >
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}