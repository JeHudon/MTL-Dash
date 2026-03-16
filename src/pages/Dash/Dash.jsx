import { getScoreboard, getLocation } from "../../api.js";
import { useState, useEffect } from "react";
import "./Dash.css";
import Icon from "@mdi/react";
import { mdiWhistle } from "@mdi/js";

function Dash() {
    const [scoreboard, setScoreboard] = useState(null);
    const [location, setLocation] = useState(null);
    const [startIndex, setStartIndex] = useState(3);
    const [prevIndex, setPrevIndex] = useState(3);
    const gamesPerPage = 6;
    const cardWidth = 240;
    const gap = 40;

    useEffect(() => {
        let timeout;

        const fetchScoreboard = async () => {
            const data = await getScoreboard();
            setScoreboard(data);

            const games = data?.gamesByDate?.flatMap((day) => day.games) ?? [];
            setStartIndex(Math.min(3, Math.max(0, games.length - gamesPerPage)));

            const isLive = data?.gamesByDate?.some((day) =>
                day.games.some((g) => g.gameState === "LIVE" || g.gameState === "CRIT"),
            );

            timeout = setTimeout(fetchScoreboard, isLive ? 20000 : 60000);
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

    useEffect(() => {
        const fetchLocation = async () => {
            const data = await getLocation();
            setLocation(data);
        };
        fetchLocation();
    }, []);

    function getGameStatus(game) {
        if (game.gameState === "FUT" || game.gameState === "PRE") {
            return new Date(game.startTimeUTC).toLocaleTimeString("en-CA", {
                timeZone: "America/New_York",
                hour: "numeric",
                minute: "2-digit",
            });
        }

        if (game.gameState === "LIVE" || game.gameState === "CRIT") {
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

    function getGameStatusClass(game) {
        if (game.gameState === "LIVE" && !game.clock?.inIntermission) return "game-status-live";
        if (game.gameState === "CRIT") return "game-status-crit";
        return "game-status";
    }

    const allGames = scoreboard?.gamesByDate?.flatMap((day) => day.games) ?? [];
    const maxIndex = Math.max(0, allGames.length - gamesPerPage);
    const distance = Math.abs(startIndex - prevIndex);
    const duration = Math.min(0.3 + distance * 0.1, 1.0);
    console.log("maxIndex:", maxIndex, "startIndex:", startIndex, "distance", distance);

    return (
        <div className="is-fullwidth backsplash">
            <img src="/Images/more1.PNG" alt="" />

            <div className="scoreboard">
                <div className="scoreboard-content has">
                    <div className="section">
                        {scoreboard?.gamesByDate ? (
                            <div className="scoreboard-row">
                                <button
                                    className="button nav-button"
                                    onClick={() => {
                                        setPrevIndex(startIndex);
                                        setStartIndex(0);
                                    }}
                                    disabled={startIndex === 0}
                                >
                                    ‹
                                </button>

                                <div className="cards-overflow">
                                    <div
                                        className="cards-wrapper"
                                        style={{
                                            transform: `translateX(${-startIndex * (cardWidth + gap)}px)`,
                                            transition: `transform ${duration}s ease`,
                                        }}
                                    >
                                        {allGames.map((game, i) => (
                                            <div
                                                className="game-column"
                                                key={game?.id ?? `empty-${i}`}
                                            >
                                                <div className="box game-card">
                                                    <div className="game-date">
                                                        {new Date(
                                                            game.startTimeUTC,
                                                        ).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </div>

                                                    <div className="game-info">
                                                        <div className="game-status-wrapper">
                                                            <div
                                                                className={getGameStatusClass(game)}
                                                            >
                                                                {getGameStatus(game)}
                                                            </div>

                                                            {(game.gameState === "LIVE" ||
                                                                game.gameState === "CRIT") && (
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

                                                        {["homeTeam", "awayTeam"].map((side) => {
                                                            const team = game[side];
                                                            const isFuture =
                                                                game.gameState === "FUT" ||
                                                                game.gameState === "PRE";
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

                                                        <p className="tv-broadcast">
                                                            {(game.gameState === "FUT" ||
                                                                game.gameState === "PRE") &&
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
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className="button nav-button"
                                    onClick={() => {
                                        setPrevIndex(startIndex);
                                        setStartIndex(maxIndex);
                                    }}
                                    disabled={startIndex >= maxIndex}
                                >
                                    ›
                                </button>
                            </div>
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
