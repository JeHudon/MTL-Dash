import { Routes, Route, Navigate } from "react-router-dom";
import Dash from "./pages/Dash/Dash.jsx";
import Stats from "./pages/Stats/Stats.jsx";
import Roster from "./pages/Roster/Roster.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* EN routes (default) */}
                {/* Dash */}
                <Route path="/" element={<Dash />} />
                {/* Stats avec données prédéfinies ou non */}
                <Route path="/stats" element={<Navigate to="/stats/20252026/2" replace />} />
                <Route path="/stats/:season/:gameType" element={<Stats />} />
                {/* Roster avec données prédéfinies ou non */}
                <Route path="/roster" element={<Navigate to="/roster/20252026" replace />} />
                <Route path="/roster/:season" element={<Roster />} />

                {/* FR routes */}
                {/* Dash */}
                <Route path="/fr" element={<Dash />} />
                {/* Stats */}
                <Route path="/fr/stats" element={<Navigate to="/fr/stats/20252026/2" replace />} />
                <Route path="/fr/stats/:season/:gameType" element={<Stats />} />
                {/* Roster */}
                <Route path="/fr/roster" element={<Navigate to="/fr/roster/20252026" replace />} />
                <Route path="/fr/roster/:season" element={<Roster />} />

                <Route path="*" element={<Navigate to="/" replace />} />

                {/* Profile du joueur */}
                {/* <Route path="/player/:lastname-:name-:playerId" element={<Player />} /> */}
                {/* <Link to={`/player/${player.lastName.default.toLowerCase()}-${player.firstName.default.toLowerCase()}-${player.playerId}`}>
                    {player.firstName.default} {player.lastName.default}
                </Link> */}
            </Routes>
        </>
    );
}

export default App;
