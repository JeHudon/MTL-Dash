import { Routes, Route, Navigate } from "react-router-dom";
import Dash from "./pages/Dash/Dash.jsx";
import Stats from "./pages/Stats/Stats.jsx";

const scoreboard = document.getElementById("scoreboard");
if (scoreboard) {
    createRoot(scoreboard).render(<Dash />);
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Dash />} />
            {/* ONLY stats gets these params */}
            <Route path="/stats" element={<Navigate to="/stats/20252026/2" replace />} />
            <Route path="/stats/:season/:type" element={<Stats />} />
        </Routes>
    );
}

export default App;