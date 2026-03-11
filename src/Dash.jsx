import { getRoster, getSchedule, getScoreboard, getStats } from "./api.js";
import { useState, useEffect } from "react";
import "./Dash.css";
import Icon from "@mdi/react";
import { mdiWhistle } from "@mdi/js";

function Dash() {
    const [roster, setRoster] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [scoreboard, setScoreboard] = useState(null);

    useEffect(() => {
        // const fetchRoster = async () => {
        //     const data = await getRoster();
        //     setRoster(data);
        // };

        // const fetchSchedule = async () => {
        //     const data = await getSchedule();
        //     setSchedule(data);
        // };

        const fetchScoreboard = async () => {
            const data = await getScoreboard();
            setScoreboard(data);
        };

        // fetchRoster();
        // fetchSchedule();
        fetchScoreboard();

        const interval = setInterval(fetchScoreboard, 20000); // every 30s

        return () => clearInterval(interval); // cleanup
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
                                            const suffix =
                                                game.period === 1
                                                    ? "ST"
                                                    : game.period === 2
                                                      ? "ND"
                                                      : game.period === 3
                                                        ? "RD"
                                                        : "TH";

                                            if (game.clock.inIntermission) {
                                                return (
                                                    <>
                                                        {game.period}
                                                        {suffix} INT
                                                    </>
                                                );
                                            }

                                            return (
                                                <>
                                                    {game.period}
                                                    {suffix}
                                                </>
                                            );
                                        }

                                        if (
                                            game.gameState === "OFF" ||
                                            game.gameState === "FINAL"
                                        ) {
                                            return (
                                                "FINAL" +
                                                (game.periodDescriptor.periodType !== "REG"
                                                    ? `/${game.periodDescriptor.periodType}`
                                                    : "")
                                            );
                                        }

                                        return "";
                                    };
                                    const getGameStatusClass = () => {
                                        if (
                                            game.gameState === "LIVE" &&
                                            !game.clock?.inIntermission
                                        ) {
                                            return "game-status-live";
                                        }
                                        if (game.gameState === "CRIT") {
                                            return "game-status-crit";
                                        }

                                        return "game-status";
                                    };

                                    const teams = ["homeTeam", "awayTeam"];

                                    return (
                                        <div className="column is-3" key={game.id}>
                                            <div className="box game-card">
                                                <div className="game-date">{gameDate}</div>

                                                <div className="game-info">
                                                    <div className="game-status-wrapper">
                                                        <div className={getGameStatusClass()}>
                                                            {getGameStatus()}
                                                        </div>

                                                        {game.gameState === "LIVE" ? (
                                                            <span className="time">
                                                                <span className="live-indicator"></span>
                                                                {game.clock.timeRemaining}
                                                                {!game.clock.running &&
                                                                game.clock.inIntermission ? (
                                                                    // <Icon
                                                                    //     path={mdiWhistle}
                                                                    //     size={0.7}
                                                                    // />
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
                                                        ) : null}
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
