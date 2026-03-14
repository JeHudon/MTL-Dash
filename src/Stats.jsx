import { getStats, getSeasons } from "./api.js";
import React, { useState, useEffect } from "react";
import "./Stats.css";
import { useParams, useNavigate } from "react-router-dom";

function Stats() {
    const [stats, setStats] = useState([]);
    const [allSeasons, setAllSeasons] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [skaterSort, setSkaterSort] = useState({ key: "points", dir: "desc" });
    const [goalieSort, setGoalieSort] = useState({ key: "wins", dir: "desc" });

    const { season: seasonParam, gameType: gameTypeParam } = useParams();
    const season = seasonParam ?? "20252026";
    const gameType = Number(gameTypeParam ?? 2);
    const navigate = useNavigate();

    function updateFilters(newSeason, newGameType) {
        navigate(`/stats/${newSeason}/${newGameType}`);
        setSkaterSort({ key: "points", dir: "desc" });
        setGoalieSort({ key: "wins", dir: "desc" });
    }

    useEffect(() => {
        const fetchSeasons = async () => {
            const data = await getSeasons();
            setAllSeasons(data);
        };
        fetchSeasons();
    }, []);

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

    function sortData(data, { key, dir }) {
        if (!data) return [];
        return [...data].sort((a, b) => {
            const aVal = key === "lastName" ? (a.lastName?.default ?? "") : (a[key] ?? "");
            const bVal = key === "lastName" ? (b.lastName?.default ?? "") : (b[key] ?? "");
            if (typeof aVal === "string") {
                return dir === "desc" ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
            }
            return dir === "desc" ? bVal - aVal : aVal - bVal;
        });
    }

    function SortTh({ label, title, sortKey, defaultDir, sortState, setSortState }) {
        const isActive = sortState.key === sortKey;
        const isDesc = sortState.dir === "desc";

        function handleClick() {
            if (!sortKey) return;
            if (isActive) {
                setSortState({ key: sortKey, dir: isDesc ? "asc" : "desc" });
            } else {
                setSortState({ key: sortKey, dir: defaultDir ?? "desc" });
            }
        }

        return (
            <th
                onClick={handleClick}
                className={`${sortKey ? "sortable-th" : ""} ${isActive ? "active-sort" : ""}`}
            >
                <abbr title={title}>{label}</abbr>
                {sortKey && (
                    <span className="sort-icon">{isActive ? (isDesc ? " ↓" : " ↑") : " ↕"}</span>
                )}
            </th>
        );
    }

    const skaterCols = [
        {
            label: "Pos",
            title: "Position",
            key: "positionCode",
            defaultDir: "asc",
            render: (p) =>
                p.positionCode === "R" || p.positionCode === "L"
                    ? p.positionCode + "W"
                    : p.positionCode,
        },
        { label: "GP", title: "Games Played", key: "gamesPlayed", render: (p) => p.gamesPlayed },
        { label: "G", title: "Goals", key: "goals", render: (p) => p.goals },
        { label: "A", title: "Assists", key: "assists", render: (p) => p.assists },
        { label: "Pts", title: "Points", key: "points", render: (p) => p.points },
        { label: "+/-", title: "Plus/Minus", key: "plusMinus", render: (p) => p.plusMinus },
        { label: "PIM", title: "Penalty Minutes", key: "penaltyMinutes", render: (p) => p.penaltyMinutes },
        { label: "PPG", title: "Power Play Goals", key: "powerPlayGoals", render: (p) => p.powerPlayGoals },
        { label: "SHG", title: "Shorthanded Goals", key: "shorthandedGoals", render: (p) => p.shorthandedGoals },
        { label: "GWG", title: "Game Winning Goals", key: "gameWinningGoals", render: (p) => p.gameWinningGoals },
        { label: "OTG", title: "Overtime Goals", key: "overtimeGoals", render: (p) => p.overtimeGoals },
        { label: "S", title: "Shots", key: "shots", render: (p) => p.shots },
        { label: "S%", title: "Shooting Percentage", key: "shootingPctg", render: (p) => p.shootingPctg.toFixed(1) },
        { label: "TOI/G", title: "Time On Ice Per Game", key: "avgTimeOnIcePerGame", render: (p) => formatTime(p.avgTimeOnIcePerGame) },
        { label: "SFT/G", title: "Shifts Per Game", key: "avgShiftsPerGame", render: (p) => p.avgShiftsPerGame.toFixed(1) },
        { label: "FO%", title: "Faceoff Win Percentage", key: "faceoffWinPctg", render: (p) => p.faceoffWinPctg.toFixed(1) },
    ];

    const goalieCols = [
        { label: "GP", title: "Games Played", key: "gamesPlayed", render: (g) => g.gamesPlayed },
        { label: "GS", title: "Games Started", key: "gamesStarted", render: (g) => g.gamesStarted },
        { label: "W", title: "Wins", key: "wins", render: (g) => g.wins },
        { label: "L", title: "Losses", key: "losses", render: (g) => g.losses },
        { label: "OT", title: "Overtime Losses", key: "overtimeLosses", render: (g) => g.overtimeLosses },
        { label: "GAA", title: "Goals Against Average", key: "goalsAgainstAverage", render: (g) => g.goalsAgainstAverage.toFixed(2) },
        { label: "SV%", title: "Save Percentage", key: "savePercentage", render: (g) => g.savePercentage.toFixed(3) },
        { label: "SA", title: "Shots Against", key: "shotsAgainst", render: (g) => g.shotsAgainst },
        { label: "SV", title: "Saves", key: "saves", render: (g) => g.saves },
        { label: "GA", title: "Goals Against", key: "goalsAgainst", render: (g) => g.goalsAgainst },
        { label: "SO", title: "Shutouts", key: "shutouts", render: (g) => g.shutouts },
        { label: "G", title: "Goals", key: "goals", render: (g) => g.goals },
        { label: "A", title: "Assists", key: "assists", render: (g) => g.assists },
        { label: "P", title: "Points", key: "points", render: (g) => g.points },
        { label: "PIM", title: "Penalty Minutes", key: "penaltyMinutes", render: (g) => g.penaltyMinutes },
        { label: "TOI", title: "Time On Ice", key: "timeOnIce", render: (g) => formatTime(g.timeOnIce) },
    ];

    const sortedSkaters = sortData(stats?.skaters, skaterSort);
    const sortedGoalies = sortData(stats?.goalies, goalieSort);

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
                                    <i className={`fa-solid fa-chevron-down ${openDropdown === "season" ? "rotate" : ""}`}></i>
                                </button>
                            </div>
                            <div className="dropdown-menu">
                                <div className="dropdown-content">
                                    {allSeasons.map((s) => (
                                        <React.Fragment key={s.season}>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => {
                                                    updateFilters(s.season, 2);
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

                        {/* Game Type Selector */}
                        <div className={`dropdown ${openDropdown === "gameType" ? "is-active" : ""}`}>
                            <div className="dropdown-trigger">
                                <button
                                    className="button custom-select-button"
                                    onClick={() => setOpenDropdown(openDropdown === "gameType" ? null : "gameType")}
                                >
                                    <span>{formatGameType(gameType)}</span>
                                    <i className={`fa-solid fa-chevron-down ${openDropdown === "gameType" ? "rotate" : ""}`}></i>
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
                                                            updateFilters(season, type);
                                                            setOpenDropdown(null);
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

                    {/* Skaters */}
                    <div className="title" style={{ padding: "30px 0px 20px 20px" }}>Skaters</div>
                    <div className="table-wrapper">
                        <table className="table is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <SortTh
                                        label="Player"
                                        title="Player"
                                        sortKey="lastName"
                                        defaultDir="asc"
                                        sortState={skaterSort}
                                        setSortState={setSkaterSort}
                                    />
                                    {skaterCols.map((col) => (
                                        <SortTh
                                            key={col.label}
                                            label={col.label}
                                            title={col.title}
                                            sortKey={col.key}
                                            defaultDir={col.defaultDir}
                                            sortState={skaterSort}
                                            setSortState={setSkaterSort}
                                        />
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedSkaters.map((player) => (
                                    <tr key={player.playerId}>
                                        <td className={skaterSort.key === "lastName" ? "active-sort-col" : ""}>
                                            <div className="player-cell">
                                                <img src={player.headshot} width="50" />
                                                {player.firstName?.default}{" "}
                                                {player.lastName?.default}
                                            </div>
                                        </td>
                                        {skaterCols.map((col) => (
                                            <td key={col.label} className={skaterSort.key === col.key ? "active-sort-col" : ""}>
                                                {col.render(player)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Goalies */}
                    <div className="title" style={{ padding: "30px 0px 20px 20px" }}>Goalies</div>
                    <div className="table-wrapper">
                        <table className="table is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <SortTh
                                        label="Player"
                                        title="Player"
                                        sortKey="lastName"
                                        defaultDir="asc"
                                        sortState={goalieSort}
                                        setSortState={setGoalieSort}
                                    />
                                    {goalieCols.map((col) => (
                                        <SortTh
                                            key={col.label}
                                            label={col.label}
                                            title={col.title}
                                            sortKey={col.key}
                                            defaultDir={col.defaultDir}
                                            sortState={goalieSort}
                                            setSortState={setGoalieSort}
                                        />
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedGoalies.map((goalie) => (
                                    <tr key={goalie.playerId}>
                                        <td className={goalieSort.key === "lastName" ? "active-sort-col" : ""}>
                                            <div className="player-cell">
                                                <img src={goalie.headshot} width="50" />
                                                {goalie.firstName?.default}{" "}
                                                {goalie.lastName?.default}
                                            </div>
                                        </td>
                                        {goalieCols.map((col) => (
                                            <td key={col.label} className={goalieSort.key === col.key ? "active-sort-col" : ""}>
                                                {col.render(goalie)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Stats;