import { getScoreboard, getLocation } from "../../api.js";
import { useState, useEffect } from "react";
import "./Dash.css";
import Icon from "@mdi/react";
import { mdiWhistle } from "@mdi/js";

function Dash() {
    const [scoreboard, setScoreboard] = useState(null);
    const [location, setLocation] = useState(null);

    // Fetch scoreboard, poll every 20s si live sinon 60s
    useEffect(() => {
        let timeout;

        const fetchScoreboard = async () => {
            const data = await getScoreboard();
            setScoreboard(data);

            const isLive = data?.gamesByDate?.some((day) =>
                day.games.some((g) => g.gameState === "LIVE" || g.gameState === "CRIT"),
            );

            timeout = setTimeout(fetchScoreboard, isLive ? 20000 : 60000);
        };

        // Ne pas fetcher si l'onglet est caché
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

    // Fetch la location pour filtrer les broadcasts
    useEffect(() => {
        const fetchLocation = async () => {
            const data = await getLocation();
            setLocation(data);
        };
        fetchLocation();
    }, []);

    // Formatte le statut du match selon le gameState
    function getGameStatus(game) {
        if (game.gameState === "FUT" || game.gameState === "PRE") {
            return new Date(game.startTimeUTC).toLocaleTimeString("en-CA", {
                timeZone: "America/New_York",
                hour: "numeric",
                minute: "2-digit",
            });
        }

        if (game.gameState === "LIVE") {
            const suffixes = ["", "ST", "ND", "RD"];
            const suffix = suffixes[game.period] ?? "TH";

            if (game.clock.inIntermission)
                return (
                    <>
                        {game.period}
                        {suffix} INT
                    </>
                );
            return (
                <>
                    {game.period}
                    {suffix}
                </>
            );
        }

        if (game.gameState === "OFF" || game.gameState === "FINAL") {
            return (
                "FINAL" +
                (game.periodDescriptor.periodType !== "REG"
                    ? `/${game.periodDescriptor.periodType}`
                    : "")
            );
        }

        return "";
    }

    // Retourne la classe CSS selon le gameState
    function getGameStatusClass(game) {
        if (game.gameState === "LIVE" && !game.clock?.inIntermission) return "game-status-live";
        if (game.gameState === "CRIT") return "game-status-crit";
        return "game-status";
    }

    return (
        <>
            <div className="is-fullwidth backsplash">
                <img src="/Images/more1.PNG" alt="" />

                <div className="container scoreboard">
                    <div className="section">
                        <div className="columns is-multiline is-centered is-variable is-8">
                            {scoreboard?.gamesByDate ? (
                                scoreboard.gamesByDate
                                    .flatMap((day) => day.games)
                                    .slice(0, 10)
                                    .map((game) => {
                                        const isFuture =
                                            game.gameState === "FUT" || game.gameState === "PRE";

                                        const gameDate = new Date(
                                            game.startTimeUTC,
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        });

                                        return (
                                            <div className="column is-one-fifth" key={game.id}>
                                                <div className="box game-card">
                                                    <div className="game-date">{gameDate}</div>

                                                    <div className="game-info">
                                                        {/* Statut du match et horloge */}
                                                        <div className="game-status-wrapper">
                                                            <div
                                                                className={getGameStatusClass(game)}
                                                            >
                                                                {getGameStatus(game)}
                                                            </div>

                                                            {game.gameState === "LIVE" && (
                                                                <span className="time">
                                                                    <span className="live-indicator"></span>
                                                                    {game.clock.timeRemaining}
                                                                    {!game.clock.running &&
                                                                    game.clock.inIntermission ? (
                                                                        " Zamboni"
                                                                    ) : !game.clock.running ? (
                                                                        <Icon
                                                                            path={mdiWhistle}
                                                                            size={0.7}
                                                                        />
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Équipes et scores */}
                                                        {["homeTeam", "awayTeam"].map((side) => {
                                                            const team = game[side];
                                                            return (
                                                                <p className="team-row" key={side}>
                                                                    <img
                                                                        src={team.logo}
                                                                        alt={
                                                                            team.commonName.default
                                                                        }
                                                                        width={50}
                                                                    />
                                                                    {team.abbrev}
                                                                    <span
                                                                        className={
                                                                            isFuture
                                                                                ? "record"
                                                                                : "score"
                                                                        }
                                                                    >
                                                                        {isFuture
                                                                            ? team.record
                                                                            : team.score}
                                                                    </span>
                                                                </p>
                                                            );
                                                        })}

                                                        {/* Broadcasts filtrés par pays */}
                                                        <p className="tv-broadcast">
                                                            {isFuture &&
                                                                game.tvBroadcasts
                                                                    .filter(
                                                                        (tv) =>
                                                                            !location ||
                                                                            tv.countryCode ===
                                                                                location.country,
                                                                    )
                                                                    .map((tv) => tv.network)
                                                                    .join(", ")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dash;
