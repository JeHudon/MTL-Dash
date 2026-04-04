import { getScoreboard, getLocation } from "../../api.js";
import { useState, useEffect } from "react";
import "./Dash.css";
import Scoreboard from "../../components/Scoreboard.jsx";

function Dash() {
    const [scoreboard, setScoreboard] = useState(null);
    const [location, setLocation] = useState(null);

    // Récupère scoreboard, et si une game est live, refresh toute les 20 secondes
    useEffect(() => {
        let timeout;

        const fetchScoreboard = async () => {
            const data = await getScoreboard();
            setScoreboard(data);

            const isLive = data?.gamesByDate?.some((day) =>
                day.games.some((g) => g.gameState === "LIVE" || g.gameState === "CRIT"),
            );

            if (isLive) {
                timeout = setTimeout(fetchScoreboard, 20000);
            }
        };

        if (!document.hidden) fetchScoreboard();

        const onVisibilityChange = () => {
            if (!document.hidden) {
                clearTimeout(timeout);
                fetchScoreboard();
            } else {
                clearTimeout(timeout);
            }
        };

        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => {
            clearTimeout(timeout);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, []);

    // Récupère localisation (pays) du user
    useEffect(() => {
        const fetchLocation = async () => {
            const data = await getLocation();
            setLocation(data);
        };
        fetchLocation();
    }, []);

    const allGames = scoreboard?.gamesByDate?.flatMap((day) => day.games) ?? [];

    return (
        <div className="backsplash">
            <img src="/Images/more1.PNG" alt="" className="back" />
            <div className="scoreboard">
                <div className="scoreboard-content">
                    <div className="section">
                        {scoreboard?.gamesByDate ? (
                            <Scoreboard games={allGames} location={location} />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dash;
