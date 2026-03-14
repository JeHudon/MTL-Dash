import { getStats, getSeasons, getRoster } from "../../api.js";
import React, { useState, useEffect } from "react";
import "./Roster.css";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayersCols } from "../../data/rosterSkaterCols.js";

function Stats() {
    const [roster, setRoster] = useState([]);
    const [allSeasons, setAllSeasons] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [forwardSort, setForwardSort] = useState({ key: null, dir: "desc" });
    const [defenceSort, setDefenceSort] = useState({ key: null, dir: "desc" });
    const [goalieSort, setGoalieSort] = useState({ key: null, dir: "desc" });

    const { season: seasonParam, gameType: gameTypeParam } = useParams();
    const season = seasonParam ?? "20252026";
    const navigate = useNavigate();

    function updateFilters(newSeason) {
        navigate(`/roster/${newSeason}`);
        setForwardSort({ key: null, dir: "desc" });
        setDefenceSort({ key: null, dir: "desc" });
        setGoalieSort({ key: null, dir: "desc" });
    }

    useEffect(() => {
        const fetchSeasons = async () => {
            const data = await getSeasons();
            setAllSeasons(data);
        };
        fetchSeasons();
    }, []);

    useEffect(() => {
        const fetchRoster = async () => {
            const data = await getRoster(season);
            setRoster(data);
        };
        fetchRoster();
    }, [season]);

    function formatSeason(season) {
        const start = season.toString().slice(0, 4);
        const end = season.toString().slice(6);
        return `${start}-${end}`;
    }

    function sortData(data, { key, dir }) {
        if (!data) return [];
        return [...data].sort((a, b) => {
            let aVal, bVal;
            if (key === "lastName") {
                aVal = a.lastName?.default ?? "";
                bVal = b.lastName?.default ?? "";
            } else if (key === "birthCity") {
                aVal = a.birthCity?.default ?? "";
                bVal = b.birthCity?.default ?? "";
            } else if (key === "age") {
                aVal = new Date(a.birthDate).getTime();
                bVal = new Date(b.birthDate).getTime();
                return dir === "desc" ? aVal - bVal : bVal - aVal;
            } else {
                aVal = a[key] ?? "";
                bVal = b[key] ?? "";
            }
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

    const forwardCols = getPlayersCols("skater");
    const defenceCols = getPlayersCols("skater");
    const goalieCols = getPlayersCols("goalie");
    const sortedForwards = sortData(roster?.forwards, forwardSort);
    const sortedDefensemens = sortData(roster?.defensemen, defenceSort);
    const sortedGoalies = sortData(roster?.goalies, goalieSort);

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
                                    onClick={() =>
                                        setOpenDropdown(openDropdown === "season" ? null : "season")
                                    }
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
                                                className="dropdown-item"
                                                onClick={() => {
                                                    updateFilters(s.season, 2);
                                                    setOpenDropdown(null)
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
                    </div>

                    {/* Forwards */}
                    <div className="title" style={{ padding: "30px 0px 20px 20px" }}>
                        Forwards
                    </div>
                    <div className="table-wrapper">
                        <table className="table is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <SortTh
                                        label="Player"
                                        title="Player"
                                        sortKey="lastName"
                                        defaultDir="asc"
                                        sortState={forwardSort}
                                        setSortState={setForwardSort}
                                    />
                                    {forwardCols.map((col) => (
                                        <SortTh
                                            key={col.label}
                                            label={col.label}
                                            title={col.title}
                                            sortKey={col.key}
                                            defaultDir={col.defaultDir}
                                            sortState={forwardSort}
                                            setSortState={setForwardSort}
                                        />
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedForwards.map((player) => (
                                    <tr key={player.id}>
                                        <td
                                            className={
                                                forwardSort.key === "lastName"
                                                    ? "active-sort-col"
                                                    : ""
                                            }
                                        >
                                            <div className="player-cell">
                                                <img src={player.headshot} width="50" />
                                                {player.firstName?.default}{" "}
                                                {player.lastName?.default}
                                            </div>
                                        </td>
                                        {forwardCols.map((col) => (
                                            <td
                                                key={col.label}
                                                className={
                                                    forwardSort.key === col.key
                                                        ? "active-sort-col"
                                                        : ""
                                                }
                                            >
                                                {col.render(player)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* DMens */}
                    <div className="title" style={{ padding: "30px 0px 20px 20px" }}>
                        Defensmen
                    </div>
                    <div className="table-wrapper">
                        <table className="table is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <SortTh
                                        label="Player"
                                        title="Player"
                                        sortKey="lastName"
                                        defaultDir="asc"
                                        sortState={defenceSort}
                                        setSortState={setForwardSort}
                                    />
                                    {defenceCols.map((col) => (
                                        <SortTh
                                            key={col.label}
                                            label={col.label}
                                            title={col.title}
                                            sortKey={col.key}
                                            defaultDir={col.defaultDir}
                                            sortState={defenceSort}
                                            setSortState={setDefenceSort}
                                        />
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedDefensemens.map((player) => (
                                    <tr key={player.id}>
                                        <td
                                            className={
                                                defenceSort.key === "lastName"
                                                    ? "active-sort-col"
                                                    : ""
                                            }
                                        >
                                            <div className="player-cell">
                                                <img src={player.headshot} width="50" />
                                                {player.firstName?.default}{" "}
                                                {player.lastName?.default}
                                            </div>
                                        </td>
                                        {defenceCols.map((col) => (
                                            <td
                                                key={col.label}
                                                className={
                                                    defenceSort.key === col.key
                                                        ? "active-sort-col"
                                                        : ""
                                                }
                                            >
                                                {col.render(player)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Goalies */}
                    <div className="title" style={{ padding: "30px 0px 20px 20px" }}>
                        Goalies
                    </div>
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
                                    <tr key={goalie.id}>
                                        <td
                                            className={
                                                goalieSort.key === "lastName"
                                                    ? "active-sort-col"
                                                    : ""
                                            }
                                        >
                                            <div className="player-cell">
                                                <img src={goalie.headshot} width="50" />
                                                {goalie.firstName?.default}{" "}
                                                {goalie.lastName?.default}
                                            </div>
                                        </td>
                                        {goalieCols.map((col) => (
                                            <td
                                                key={col.label}
                                                className={
                                                    goalieSort.key === col.key
                                                        ? "active-sort-col"
                                                        : ""
                                                }
                                            >
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
