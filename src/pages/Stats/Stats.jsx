// Imporation des apis, commandes, components et data
import { getStats, getSeasons } from "../../api.js";
import React, { useState, useEffect } from "react";
import "./Stats.css";
import { useParams, useNavigate } from "react-router-dom";
import { getSkaterCols } from "../../data/statsSkaterCols.js";
import { getGoalieCols } from "../../data/statsGoalieCols.js";
import { SortableTable } from "../../components/SortableTable.jsx";
import Dropdown from "../../components/Dropdown.jsx";

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

    // Update l'url quand change de saison ou gameType
    function updateFilters(newSeason, newGameType) {
        navigate(`/stats/${newSeason}/${newGameType}`);
        setSkaterSort({ key: "points", dir: "desc" });
        setGoalieSort({ key: "wins", dir: "desc" });
    }

    // Récuperer toutes les saisons pour dropdown
    useEffect(() => {
        const fetchSeasons = async () => {
            const data = await getSeasons();
            setAllSeasons(data);
        };
        fetchSeasons();
    }, []);

    // Récuperer les stats des joueurs au lancement et aussi quand season ou gameType change
    useEffect(() => {
        const fetchStats = async () => {
            const data = await getStats(season, gameType);
            setStats(data);
        };
        fetchStats();
    }, [season, gameType]);

    // Formatte la saison de 20252026 -> 2025-26
    function formatSeason(season) {
        const start = season.toString().slice(0, 4);
        const end = season.toString().slice(6);
        return `${start}-${end}`;
    }

    // Formatte le gameType de 2 -> Régulière
    function formatGameType(gameType) {
        if (gameType === 2) return "Régulière";
        if (gameType === 3) return "Séries éliminatoires";
    }

    // Formatte le temps en secondes en format MM:SS
    function formatTime(seconds) {
        const totalSeconds = Math.floor(seconds);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    // Fonction premet sort dans bon sens
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

    const skaterCols = getSkaterCols(formatTime);
    const goalieCols = getGoalieCols(formatTime);
    const sortedSkaters = sortData(stats?.skaters, skaterSort);
    const sortedGoalies = sortData(stats?.goalies, goalieSort);

    return (
        <>
            <div className="container">
                <div className="section">
                    <div className="columns is-left">
                        {/* Season Selector */}
                        <Dropdown
                            id="season"
                            label={formatSeason(season)}
                            options={allSeasons.map((s) => ({
                                value: s.season,
                                label: formatSeason(s.season),
                            }))}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            onSelect={(value) => updateFilters(value, 2)}
                        />

                        {/* Game Type Selector */}
                        <Dropdown
                            id="gameType"
                            label={formatGameType(gameType)}
                            options={allSeasons
                                .filter((s) => s.season === Number(season))
                                .flatMap((s) =>
                                    s.gameTypes.map((type) => ({
                                        value: type,
                                        label: formatGameType(type),
                                    })),
                                )}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            onSelect={(value) => updateFilters(season, value)}
                        />
                    </div>

                    {/* Skaters table */}
                    <div className="title" style={{ padding: "30px 0px 20px 20px" }}>
                        Skaters
                    </div>
                    {/* Appel component SortableTable qui me donne le layout préfait */}
                    <SortableTable
                        cols={skaterCols}
                        rows={sortedSkaters}
                        sortState={skaterSort}
                        setSortState={setSkaterSort}
                        rowKey="id"
                        playerKey="lastName"
                    />

                    {/* Goalies table */}
                    <div className="title" style={{ padding: "30px 0px 20px 20px" }}>
                        Goalies
                    </div>
                    {/* Appel component SortableTable qui me donne le layout préfait */}
                    <SortableTable
                        cols={goalieCols}
                        rows={sortedGoalies}
                        sortState={goalieSort}
                        setSortState={setGoalieSort}
                        rowKey="id"
                        playerKey="lastName"
                    />
                </div>
            </div>
        </>
    );
}

export default Stats;
