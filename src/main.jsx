import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Dash from "./Dash.jsx";
import Stats from "./Stats.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const scoreboard = document.getElementById("scoreboard");
if (scoreboard) {
    createRoot(scoreboard).render(<Dash />);
}

const stats = document.getElementById("stats");
if (stats) {
    createRoot(stats).render(
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/stats/:season/:gameType" element={<Stats />} />
                <Route path="/stats" element={<Navigate to="/stats/20252026/2" replace />} />
                <Route path="*" element={<Navigate to="/stats/20252026/2" replace />} />
            </Routes>
        </BrowserRouter>,
    );
}
