// Importation des apis, commandes, components et data
import { getStandings, getStandingsSeasons } from "../../api.js";
import React, { useState, useEffect, useMemo } from "react";
import "./Standings.css";
import { useParams, useNavigate } from "react-router-dom";
import { SortableTable } from "../../components/SortableTable.jsx";
import Dropdown from "../../components/Dropdown.jsx";
import { useLocale } from "../../context/LocaleContext.jsx";
import { useTranslation } from "../../i18n.js";
import { getStandingsCols } from "./standingsCols.jsx";

function Standings() {
    const [standings, setStandings] = useState(null);
    const [allStandingsSeasons, setAllStandingsSeasons] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [standingsSort, setStandingsSort] = useState({ key: null, dir: "desc" });
    const [standingType, setStandingType] = useState("wildcard");

    const { locale } = useLocale();
    const t = useTranslation(locale);

    const { date: dateParam, standingType: standingTypeParam } = useParams();
    const date = dateParam ?? new Date().toLocaleDateString("fr-CA");
    const navigate = useNavigate();

    const prefix = locale === "fr" ? "/fr" : "";

    function updateFilters(newDate, newType) {
        navigate(`${prefix}/standings/${newDate}/${newType}`);
        setStandingsSort({ key: null, dir: "desc" });
    }

    // Récuperer toutes les saisons disponibles pour le dropdown
    useEffect(() => {
        const fetchSeasons = async () => {
            const data = await getStandingsSeasons();
            setAllStandingsSeasons(data.seasons);
        };
        fetchSeasons();
    }, []);

    // Récuperer les standings quand date change
    useEffect(() => {
        const fetchStandings = async () => {
            const data = await getStandings(date);
            setStandings(data);
        };
        fetchStandings();
    }, [date]);

    // Formatte la saison de 20252026 -> 2025-26
    function formatSeason(season) {
        const start = season.toString().slice(0, 4);
        const end = season.toString().slice(6);
        return `${start}-${end}`;
    }

    const teams = standings?.standings ?? [];

    // --- Détecter quelles vues sont disponibles selon les données ---
    const currentSeason = allStandingsSeasons.find((s) => s.standingsEnd === date);

    const hasConferences = currentSeason?.conferencesInUse ?? false;
    const hasDivisions = currentSeason?.divisionsInUse ?? false;
    const hasTies = currentSeason?.tiesInUse ?? false;
    const hasWildcard = currentSeason?.wildcardInUse ?? false;

    const standingTypes = [
        { value: "league", label: t("league") },
        ...(hasConferences ? [{ value: "conference", label: t("conference") }] : []),
        ...(hasDivisions ? [{ value: "division", label: t("division") }] : []),
        ...(hasWildcard ? [{ value: "wildcard", label: t("wildcard") }] : []),
    ];

    // Si le type dans l'URL n'est pas valide pour cette saison, fallback sur "league"
    // const standingType = standingTypes.find((s) => s.value === standingTypeParam)
    //     ? standingTypeParam
    //     : "league";

    // --- Colonnes pour la table ---
    const cols = getStandingsCols(t, hasTies);

    // --- Dériver les données selon le type de vue ---
    const viewData = useMemo(() => {
        if (!teams.length) return null;

        switch (standingType) {
            case "league":
                return {
                    sections: [
                        {
                            title: t("league"),
                            rows: [...teams].sort((a, b) => a.leagueSequence - b.leagueSequence),
                        },
                    ],
                };

            case "conference": {
                // Grouper dynamiquement par conferenceName (fonctionne pour toutes les ères)
                const groups = {};
                teams.forEach((team) => {
                    const key = team.conferenceName;
                    if (!groups[key]) groups[key] = [];
                    groups[key].push(team);
                });
                return {
                    sections: Object.keys(groups).map((name) => ({
                        title: name,
                        rows: groups[name].sort(
                            (a, b) => a.conferenceSequence - b.conferenceSequence,
                        ),
                    })),
                };
            }

            case "division": {
                // Grouper dynamiquement par divisionName (fonctionne pour toutes les ères)
                const groups = {};
                teams.forEach((team) => {
                    const key = team.divisionName;
                    if (!groups[key]) groups[key] = [];
                    groups[key].push(team);
                });
                return {
                    sections: Object.keys(groups).map((name) => ({
                        title: name,
                        rows: groups[name].sort((a, b) => a.divisionSequence - b.divisionSequence),
                    })),
                };
            }

            case "wildcard": {
                // Grouper par conférence, puis top 3 par division + wildcard restants
                const confGroups = {};
                teams.forEach((team) => {
                    const key = team.conferenceAbbrev;
                    if (!confGroups[key]) confGroups[key] = [];
                    confGroups[key].push(team);
                });

                const sections = [];
                Object.keys(confGroups).forEach((confAbbrev) => {
                    const confTeams = confGroups[confAbbrev];

                    // Grouper par division dans cette conférence
                    const divGroups = {};
                    confTeams.forEach((team) => {
                        const key = team.divisionName;
                        if (!divGroups[key]) divGroups[key] = [];
                        divGroups[key].push(team);
                    });

                    // Top 3 de chaque division
                    Object.keys(divGroups).forEach((divName) => {
                        sections.push({
                            title: divName,
                            rows: divGroups[divName]
                                .sort((a, b) => a.divisionSequence - b.divisionSequence)
                                .slice(0, 3),
                        });
                    });

                    // Wildcard: équipes avec wildcardSequence > 0 dans cette conférence
                    const wildcardTeams = confTeams
                        .filter((team) => team.wildcardSequence > 0)
                        .sort((a, b) => a.wildcardSequence - b.wildcardSequence);

                    const confName = confTeams[0]?.conferenceName ?? confAbbrev;
                    sections.push({
                        title: `${t("wildcard")} — ${confName}`,
                        rows: wildcardTeams,
                    });
                });

                return { sections };
            }

            default:
                return {
                    sections: [
                        {
                            title: t("league"),
                            rows: [...teams].sort((a, b) => a.leagueSequence - b.leagueSequence),
                        },
                    ],
                };
        }
    }, [teams, standingType]);

    if (!standings) return <div>{t("loading")}</div>;

    return (
        <>
            <div className="container standings-page">
                <div className="section">
                    <div className="columns is-left">
                        {/* Season Selector — utilise standingsEnd comme date dans l'URL */}
                        <Dropdown
                            id="season"
                            label={formatSeason(
                                allStandingsSeasons.find((s) => s.standingsEnd === date)?.id ??
                                    "20252026",
                            )}
                            options={allStandingsSeasons.map((s) => ({
                                value: s.standingsEnd,
                                label: formatSeason(s.id),
                            }))}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            onSelect={(value) => updateFilters(value, standingType)}
                        />

                        {/* Standing Type Selector */}
                        <Dropdown
                            id="standingType"
                            label={standingTypes.find((s) => s.value === standingType)?.label}
                            options={standingTypes}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            onSelect={(value) => {
                                updateFilters(date, value);
                                setStandingType(value);
                            }}
                        />
                    </div>

                    {/* Tables par section — chaque section est un groupe (ligue, conférence, division, etc.) */}
                    {viewData?.sections.map((section) => (
                        <div key={section.title}>
                            <div className="title" style={{ padding: "30px 0px 20px 20px" }}>
                                {section.title}
                            </div>
                            {/* PUT TABLE HERE — rows: section.rows, cols: cols */}
                            <SortableTable
                                cols={cols}
                                rows={section.rows}
                                sortState={standingsSort}
                                setSortState={setStandingsSort}
                                rowKey="teamAbbrev.default"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Standings;
