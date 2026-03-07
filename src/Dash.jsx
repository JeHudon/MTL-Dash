import { getRoster, getSchedule, getScoreboard, getStats } from "./api.js";
import { useState, useEffect } from "react";
import "./Dash.css";

function Dash() {
    const [roster, setRoster] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [scoreboard, setScoreboard] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // const fetchRoster = async () => {
        //     const data = await getRoster();
        //     setRoster(data);
        // };

        // const fetchSchedule = async () => {
        //     const data = await getSchedule();
        //     setSchedule(data);
        // };

        // const fetchStats = async () => {
        //     const data = await getStats();
        //     setStats(data);
        // }

        const fetchScoreboard = async () => {
            const data = await getScoreboard();
            setScoreboard(data);
        };

        // fetchRoster();
        // fetchSchedule();
        // fetchStats();
        fetchScoreboard();
    }, []);

    return (
        <>
            <div className="container">
                <div className="section">
                    <div className="columns is-multiline is-centered is-variable is-8">
                        {scoreboard && scoreboard.gamesByDate ? (
                            scoreboard.gamesByDate.flatMap((day) =>
                                day.games.map((game) => {
                                    const gameDate = new Date(game.startTimeUTC).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                        },
                                    );
                                    const getGameStatus = () => {
                                        if (game.gameState === "FUT" || game.gameState === "PRE") {
                                            return new Date(game.startTimeUTC).toLocaleTimeString(
                                                "en-CA",
                                                {
                                                    timeZone: "America/New_York",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                },
                                            );
                                        }
                                        if (game.gameState === "LIVE") {
                                            return `${game.period} ${game.clock.timeRemaining}`;
                                        }
                                        if (game.gameState === "OFF" || game.gameState === "FINAL")
                                            return (
                                                "Final" +
                                                (game.periodDescriptor.periodType != "REG"
                                                    ? `/${game.periodDescriptor.periodType}`
                                                    : "")
                                            );
                                        return "";
                                    };

                                    const teams = ["homeTeam", "awayTeam"];

                                    return (
                                        <div className="column is-3" key={game.id}>
                                            <div className="box game-card">
                                                <div className="game-date">{gameDate}</div>

                                                <div className="game-info">
                                                    <div className="game-status">
                                                        {getGameStatus()}
                                                    </div>

                                                    {teams.map((side) => {
                                                        const team = game[side];

                                                        const isFuture =
                                                            game.gameState === "FUT" ||
                                                            game.gameState === "PRE";

                                                        const scoreOrRecord = isFuture
                                                            ? team.record
                                                            : team.score;
                                                        const scoreClass = isFuture
                                                            ? "record"
                                                            : "score";

                                                        return (
                                                            <p className="team-row" key={side}>
                                                                <img
                                                                    src={team.logo}
                                                                    alt={team.commonName.default}
                                                                    width={50}
                                                                />
                                                                {team.abbrev}
                                                                <span className={scoreClass}>
                                                                    {scoreOrRecord}
                                                                </span>
                                                            </p>
                                                        );
                                                    })}

                                                    <p className="tv-broadcast">
                                                        {(game.gameState === "FUT" ||
                                                            game.gameState === "PRE") &&
                                                            game.tvBroadcasts
                                                                .filter(
                                                                    (tv) => tv.countryCode === "CA",
                                                                )
                                                                .map((tv) => tv.network)
                                                                .join(", ")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }),
                            )
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dash;
