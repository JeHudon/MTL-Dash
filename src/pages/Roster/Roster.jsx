// Imporation des apis, commandes, components et data
import { getSeasons, getRoster } from "../../api.js";
import React, { useState, useEffect } from "react";
import "./Roster.css";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayersCols } from "../../data/rosterSkaterCols.js";
import { SortableTable } from "../../components/SortableTable.jsx";
import Dropdown from "../../components/Dropdown.jsx";

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

    // Update l'url quand change de saison
    function updateFilters(newSeason) {
        navigate(`/roster/${newSeason}`);
        setForwardSort({ key: null, dir: "desc" });
        setDefenceSort({ key: null, dir: "desc" });
        setGoalieSort({ key: null, dir: "desc" });
    }

    // Récuperer toutes les saisons pour dropdown
    useEffect(() => {
        const fetchSeasons = async () => {
            const data = await getSeasons();
            setAllSeasons(data);
        };
        fetchSeasons();
    }, []);

    // Récuperer le roster au lancement et aussi quand season change
    useEffect(() => {
        const fetchRoster = async () => {
            const data = await getRoster(season);
            setRoster(data);
        };
        fetchRoster();
    }, [season]);

    // Formatte la saison de 20252026 -> 2025-26
    function formatSeason(season) {
        const start = season.toString().slice(0, 4);
        const end = season.toString().slice(6);
        return `${start}-${end}`;
    }

    // Fonction premet sort dans bon sens
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

    // Variables contenant les Colonnes pour la table
    const forwardCols = getPlayersCols("skater");
    const defenceCols = getPlayersCols("skater");
    const goalieCols = getPlayersCols("goalie");
    // Variables contient joueurs sorted selon le sort
    const sortedForwards = sortData(roster?.forwards, forwardSort);
    const sortedDefensemens = sortData(roster?.defensemen, defenceSort);
    const sortedGoalies = sortData(roster?.goalies, goalieSort);

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
                            onSelect={(value) => updateFilters(value)}
                        />
                    </div>

                    {/* Forwards table */}
                    <div className="title" style={{ padding: "30px 0px 20px 20px" }}>
                        Forwards
                    </div>
                    {/* Appel component SortableTable qui me donne le layout préfait */}
                    <SortableTable
                        cols={forwardCols}
                        rows={sortedForwards}
                        sortState={forwardSort}
                        setSortState={setForwardSort}
                        rowKey="id"
                        playerKey="lastName"
                    />
                    {/* DMens table*/}
                    <div className="title" style={{ padding: "30px 0px 20px 20px" }}>
                        Defensmen
                    </div>
                    {/* Appel component SortableTable qui me donne le layout préfait */}
                    <SortableTable
                        cols={defenceCols}
                        rows={sortedDefensemens}
                        sortState={defenceSort}
                        setSortState={setDefenceSort}
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
