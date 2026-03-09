import { getRoster, getSchedule, getScoreboard, getStats, getSeasons } from "./api.js";
import React, { useState, useEffect } from "react";
import "./Stats.css";

function Stats() {
    const [stats, setStats] = useState([]);
    const [season, setSeason] = useState("20252026");
    const [allSeasons, setAllSeasons] = useState([]);
    const [gameType, setGameType] = useState(2);

    const [seasonOpen, setSeasonOpen] = useState(false);
    const [gameTypeOpen, setGameTypeOpen] = useState(false);

    const [openDropdown, setOpenDropdown] = useState(null)

    // load seasons once
    useEffect(() => {
        const fetchSeasons = async () => {
            const data = await getSeasons();
            setAllSeasons(data);
        };

        fetchSeasons();
    }, []);

    // reload stats when filters change
    useEffect(() => {
        const fetchStats = async () => {
            const data = await getStats(season, gameType);
            setStats(data);
        };

        fetchStats();
    }, [season, gameType]);

    function formatSeason(season) {
        const start = season.toString().slice(0, 4);
        const end = season.toString().slice(6);
        return `${start}-${end}`;
    }

    function formatGameType(gameType) {
        if (gameType === 2) return "Régulière";
        if (gameType === 3) return "Séries éliminatoires";
    }

    function formatTime(seconds) {
        const totalSeconds = Math.floor(seconds);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    return (
        <>
            <div className="container">
                <div className="section">
                    <div className="columns is-left">
                        {/* Season Selector */}
                        <div className={`dropdown ${openDropdown === "season" ? "is-active" : ""}`}>
                            <div className="dropdown-trigger">
                                <button
                                    className="button custom-select-button"
                                    onClick={() => setOpenDropdown(openDropdown === "season" ? null : "season")}
                                >
                                    <span>{formatSeason(season)}</span>
                                    <i
                                        className={`fa-solid fa-chevron-down ${openDropdown === "season" ? "rotate" : ""}`}
                                    ></i>
                                </button>
                            </div>

                            <div className="dropdown-menu">
                                <div className="dropdown-content">
                                    {allSeasons.map((s) => (
                                        <React.Fragment key={s.season}>
                                            <a
                                                key={s.season}
                                                className="dropdown-item"
                                                onClick={() => {
                                                    setSeason(s.season);
                                                    setGameType(2);
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                {formatSeason(s.season)}
                                            </a>
                                            <hr />
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Drowdown de gameType */}
                        <div className={`dropdown ${openDropdown === "gameType" ? "is-active" : ""}`}>
                            <div className="dropdown-trigger">
                                <button
                                    className="button custom-select-button"
                                    onClick={() => setOpenDropdown(openDropdown === "gameType" ? null : "gameType")}
                                >
                                    <span>{formatGameType(gameType)}</span>
                                    <i
                                        className={`fa-solid fa-chevron-down ${openDropdown === "gameType" ? "rotate" : ""}`}
                                    ></i>
                                </button>
                            </div>
                            <div className="dropdown-menu">
                                <div className="dropdown-content">
                                    {allSeasons
                                        .filter((s) => s.season === Number(season))
                                        .flatMap((s) =>
                                            s.gameTypes.map((type) => (
                                                <React.Fragment key={type}>
                                                    <a
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            setGameType(type);
                                                            setOpenDropdown(null)
                                                        }}
                                                    >
                                                        {formatGameType(type)}
                                                    </a>
                                                    <hr />
                                                </React.Fragment>
                                            ))
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns is-centered">
                        <div className="column is-12">
                            <table className="table is-striped is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Player</th>
                                        <th>Pos</th>
                                        <th>GP</th>
                                        <th>G</th>
                                        <th>A</th>
                                        <th>Pts</th>
                                        <th>+/-</th>
                                        <th>PIM</th>
                                        <th>PPG</th>
                                        <th>SHG</th>
                                        <th>GWG</th>
                                        <th>OTG</th>
                                        <th>S</th>
                                        <th>S%</th>
                                        <th>TOI/G</th>
                                        <th>SFT/G</th>
                                        <th>FO%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.skaters?.map((player) => (
                                        <tr key={player.playerId}>
                                            <td className="player-cell">
                                                <img src={player.headshot} width="50" />
                                                {player.firstName?.default}{" "}
                                                {player.lastName?.default}
                                            </td>
                                            <td>{player.positionCode}</td>
                                            <td>{player.gamesPlayed}</td>
                                            <td>{player.goals}</td>
                                            <td>{player.assists}</td>
                                            <td>{player.points}</td>
                                            <td>{player.plusMinus}</td>
                                            <td>{player.penaltyMinutes}</td>
                                            <td>{player.powerPlayGoals}</td>
                                            <td>{player.shorthandedGoals}</td>
                                            <td>{player.gameWinningGoals}</td>
                                            <td>{player.overtimeGoals}</td>
                                            <td>{player.shots}</td>
                                            <td>{player.shootingPctg.toFixed(1)}</td>
                                            <td>{formatTime(player.avgTimeOnIcePerGame)}</td>
                                            <td>{player.avgShiftsPerGame.toFixed(1)}</td>
                                            <td>{player.faceoffWinPctg.toFixed(1)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Stats;
