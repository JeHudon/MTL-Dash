import { getStats, getSeasons } from "./api.js";
import { useState, useEffect } from "react";
import "./Stats.css";

// ------------------ Dropdown Component ------------------
function Dropdown({ value, options, onSelect, labelFormatter }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`dropdown ${open ? "is-active" : ""}`}>
            <div className="dropdown-trigger">
                <button className="button custom-select-button" onClick={() => setOpen(!open)}>
                    <span>{labelFormatter(value)}</span>
                    <i className={`fa-solid fa-chevron-down ${open ? "rotate" : ""}`}></i>
                </button>
            </div>

            <div className="dropdown-menu">
                <div className="dropdown-content">
                    {options.map((opt) => (
                        <a
                            key={opt.value}
                            className="dropdown-item"
                            onClick={() => {
                                onSelect(opt.value);
                                setOpen(false);
                            }}
                        >
                            {labelFormatter(opt.value)}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ------------------ Stats Table Component ------------------
function StatsTable({ skaters }) {
    function formatTime(seconds) {
        const totalSeconds = Math.floor(seconds);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    return (
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
                {skaters.map((player) => (
                    <tr key={player.playerId}>
                        <td className="player-cell">
                            <img src={player.headshot} width="50" alt="headshot" />
                            {player.firstName?.default} {player.lastName?.default}
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
                        <td>{player.faceoffWinPctg.toFixed(1)}</td>z    
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

// ------------------ Main Stats Component ------------------
function Stats() {
    const [stats, setStats] = useState([]);
    const [season, setSeason] = useState("20252026");
    const [allSeasons, setAllSeasons] = useState([]);
    const [gameType, setGameType] = useState(2);

    // Load seasons once
    useEffect(() => {
        const fetchSeasons = async () => {
            const data = await getSeasons();
            setAllSeasons(data);
        };
        fetchSeasons();
    }, []);

    // Reload stats when filters change
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
        return gameType;
    }

    return (
        <div className="container">
            <div className="section">
                <div className="columns is-left">
                    {/* Season Dropdown */}
                    <Dropdown
                        value={season}
                        options={allSeasons.map((s) => ({
                            value: s.season,
                            gameTypes: s.gameTypes,
                        }))}
                        onSelect={(val) => {
                            setSeason(val);
                            setGameType(2);
                            
                        }}
                        labelFormatter={formatSeason}
                    />

                    {/* GameType Dropdown */}
                    <Dropdown
                        value={gameType}
                        options={allSeasons
                            .filter((s) => s.season === Number(season))
                            .flatMap((s) => s.gameTypes.map((type) => ({ value: type })))}
                        onSelect={setGameType}
                        labelFormatter={formatGameType}
                    />
                </div>

                {/* Stats Table */}
                <div className="columns is-centered">
                    <div className="column is-12">
                        <StatsTable skaters={stats?.skaters || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stats;
