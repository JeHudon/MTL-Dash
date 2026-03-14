import { Routes, Route, Navigate } from "react-router-dom";
import Dash from "./pages/Dash/Dash.jsx";
import Stats from "./pages/Stats/Stats.jsx";
import Roster from "./pages/Roster/Roster.jsx";

const scoreboard = document.getElementById("scoreboard");
if (scoreboard) {
    createRoot(scoreboard).render(<Dash />);
}

function App() {
    return (
        <Routes>
            {/* Dash */}
            <Route path="/" element={<Dash />} />
            {/* Stats avec données prédéfinies ou non */}
            <Route path="/stats" element={<Navigate to="/stats/20252026/2" replace />} />
            <Route path="/stats/:season/:type" element={<Stats />} />
            {/* Roster avec données prédéfinies ou non */}
            <Route path="/roster" element={<Navigate to="/roster/20252026" replace />} />
            <Route path="/roster/:season" element={<Roster />} />
        </Routes>
    );
}

export default App;
