// Importation des apis, commandes, components et data
import { getStandings, getStandingsSeasons } from "../../api.js";
import React, { useState, useEffect, useMemo } from "react";
import "./Standings.css";
import { useParams, useNavigate } from "react-router-dom";
import { SortableTable } from "../../components/SortableTable.jsx";
import Dropdown from "../../components/Dropdown.jsx";
import DateNavigator from "../../components/DateNavigator.jsx";
import { useLocale } from "../../context/LocaleContext.jsx";
import { useTranslation } from "../../i18n.js";
import { getStandingsCols } from "./standingsCols.jsx";

function Standings() {
    const [standings, setStandings] = useState(null);
    const [allStandingsSeasons, setAllStandingsSeasons] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [standingsSort, setStandingsSort] = useState({ key: null, dir: "desc" });
    const [standingFormat, setStandingFormat] = useState(null);

    const { format: formatParam, date: dateParam } = useParams();

    const { locale } = useLocale();
    const t = useTranslation(locale);

    const date = dateParam ?? new Date().toLocaleDateString("fr-CA");
    const navigate = useNavigate();

    const currentSeason = allStandingsSeasons.find(
        (s) => date >= s.standingsStart && date <= s.standingsEnd,
    );

    const teams = standings?.standings.reverse() ?? [];

    const prefix = locale === "fr" ? "/fr" : "";

    function updateFilters(newDate, newFormat) {
        navigate(`${prefix}/standings/${newDate}/${newFormat}`);
        setStandingFormat(newFormat);
        setStandingsSort({ key: null, dir: "desc" });
    }

    // ---------------- FETCH SEASONS ----------------
    useEffect(() => {
        const fetchSeasons = async () => {
            const data = await getStandingsSeasons();
            setAllStandingsSeasons(data.seasons.reverse() ?? []);
        };
        fetchSeasons();
    }, []);

    // ---------------- FETCH STANDINGS ----------------
    useEffect(() => {
        const fetchStandings = async () => {
            const data = await getStandings(date);
            setStandings(data);
        };
        fetchStandings();
    }, [date]);

    useEffect(() => {
        setStandingFormat(formatParam);
    }, [formatParam]);

    useEffect(() => {
        if (!standingFormat) return;
        if (!teams.length) return; // wait for data instead of currentSeason

        if (standingFormat === "wildcard" && !hasWildcard) {
            setStandingFormat("division");
        } else if (standingFormat === "division" && !hasDivisions) {
            setStandingFormat("conference");
        } else if (standingFormat === "conference" && !hasConferences) {
            setStandingFormat("league");
        }
    }, [standingFormat, teams]);

    useEffect(() => {
        if (!allStandingsSeasons.length) return;
        if (!standingFormat) return;

        const today = new Date().toLocaleDateString("fr-CA");

        // Future date or after all seasons — go to latest available
        if (date > today || date > allStandingsSeasons[0].standingsEnd) {
            navigate(
                `${prefix}/standings/${allStandingsSeasons[0].standingsEnd}/${standingFormat}`,
            );
            return;
        }

        // Date is within a known season, but after its standingsEnd — go to next season's start
        if (!currentSeason) {
            const nextSeason = allStandingsSeasons.find((s) => s.standingsStart > date);
            if (nextSeason) {
                navigate(`${prefix}/standings/${nextSeason.standingsStart}/${standingFormat}`);
            }
            return;
        }
    }, [allStandingsSeasons, date, standingFormat]);

    function formatSeason(season) {
        const start = season.toString().slice(0, 4);
        const end = season.toString().slice(6);
        return `${start}-${end}`;
    }

    const hasConferences = currentSeason?.conferencesInUse ?? false;
    const hasDivisions = currentSeason?.divisionsInUse ?? false;
    const hasTies = currentSeason?.tiesInUse ?? false;
    const hasWildcard = currentSeason?.wildcardInUse ?? false;

    const standingFormats = [
        { value: "league", label: t("league") },
        ...(hasConferences ? [{ value: "conference", label: t("conference") }] : []),
        ...(hasDivisions ? [{ value: "division", label: t("division") }] : []),
        ...(hasWildcard ? [{ value: "wildcard", label: t("wildcard") }] : []),
    ];

    const cols = getStandingsCols(t, hasTies);

    const standingsTranslations = {
        // Conferences
        Eastern: "Est",
        Western: "Ouest",
        // Divisions
        Atlantic: "Atlantique",
        Metropolitan: "Métropolitaine",
        Central: "Centrale",
        Pacific: "Pacifique",
    };

    const translate = (title) =>
        locale === "fr" ? (standingsTranslations[title] ?? title) : title;

    // Fonction permet sort dans bon sens
    function sortData(data, { key, dir }) {
        if (!data) return [];
        return [...data].sort((a, b) => {
            let aVal, bVal;
            if (key === "l10Points") {
                aVal = a.lastName?.default ?? "";
                bVal = b.lastName?.default ?? "";
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

    const sortedTeams = sortData(teams ?? [], standingsSort);

    // =====================================================
    // VIEW DATA
    // =====================================================
    const viewData = useMemo(() => {
        if (!teams.length) return null;

        switch (standingFormat) {
            // ---------------- LEAGUE ----------------
            case "league":
                return {
                    sections: [
                        {
                            title: t("league"),
                            rankKey: "leagueSequence",
                            key: "league",
                            rows: [...sortedTeams].sort(
                                (a, b) => a.leagueSequence - b.leagueSequence,
                            ),
                        },
                    ],
                };

            // ---------------- CONFERENCE ----------------
            case "conference": {
                const groups = {};
                sortedTeams.forEach((team) => {
                    (groups[team.conferenceName] ??= []).push(team);
                });

                return {
                    sections: Object.entries(groups).map(([name, rows]) => ({
                        title: name,
                        rankKey: "conferenceSequence",
                        key: `conf-${name}`,
                        rows: rows.sort((a, b) => a.conferenceSequence - b.conferenceSequence),
                    })),
                };
            }

            // DIVISION + WILDCARD WITH CONFERENCE WRAPPER
            case "division":
            case "wildcard": {
                const confGroups = {};

                sortedTeams.forEach((team) => {
                    const key = team.conferenceAbbrev || team.conferenceName || "unknown";
                    (confGroups[key] ??= []).push(team);
                });

                const sections = [];

                Object.entries(confGroups)
                    .sort(([, aTeams], [, bTeams]) => {
                        const aName = aTeams[0]?.conferenceName ?? "";
                        const bName = bTeams[0]?.conferenceName ?? "";
                        return aName.localeCompare(bName);
                    })
                    .forEach(([confAbbrev, confTeams]) => {
                        const confName = confTeams[0]?.conferenceName || confAbbrev;

                        // BIG CONFERENCE TITLE
                        if (hasConferences) {
                            sections.push({
                                isConferenceHeader: true,
                                title: confName,
                                key: `header-${confAbbrev}`,
                            });
                        }

                        // ----- DIVISIONS -----
                        const divGroups = {};
                        confTeams.forEach((team) => {
                            (divGroups[team.divisionName] ??= []).push(team);
                        });

                        Object.entries(divGroups)
                            .sort(([aName], [bName]) => aName.localeCompare(bName))
                            .forEach(([divName, divTeams]) => {
                                sections.push({
                                    title: divName,
                                    rankKey: "divisionSequence",
                                    key: `div-${confAbbrev}-${divName}`,
                                    rows: [...divTeams]
                                        .sort((a, b) => a.divisionSequence - b.divisionSequence)
                                        .slice(
                                            0,
                                            standingFormat === "wildcard" ? 3 : divTeams.length,
                                        ),
                                });
                            });

                        // ----- WILDCARD ONLY IN WILDCARD VIEW -----
                        if (standingFormat === "wildcard") {
                            const wildcardTeams = confTeams
                                .filter((t) => t.wildcardSequence > 0)
                                .sort((a, b) => a.wildcardSequence - b.wildcardSequence);

                            if (wildcardTeams.length) {
                                sections.push({
                                    title: t("wildcard"),
                                    rankKey: "wildcardSequence",
                                    key: `wildcard-${confAbbrev}`,
                                    rows: wildcardTeams,
                                });
                            }
                        }
                    });

                return { sections };
            }

            default:
                return null;
        }
    }, [teams, standingFormat]);

    if (!standings) return <div>{t("loading")}</div>;

    // RENDER
    return (
        <div className="container standings-page">
            <div className="section">
                <div className="columns is-left">
                    <Dropdown
                        id="season"
                        label={formatSeason(currentSeason?.id ?? "20252026")}
                        options={allStandingsSeasons.map((s) => ({
                            value: s.standingsEnd,
                            label: formatSeason(s.id),
                        }))}
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        onSelect={(value) => updateFilters(value, standingFormat)}
                    />

                    {/* <Dropdown
                        id="standingFormat"
                        value={standingFormat}
                        label={standingFormats.find((s) => s.value === standingFormat)?.label}
                        options={standingFormats}
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        onSelect={(value) => updateFilters(date, value)}
                    /> */}
                    <DateNavigator
                        date={date}
                        currentSeason={currentSeason}
                        onDateChange={(newDate) => updateFilters(newDate, standingFormat)}
                        locale={locale}
                    />
                </div>
                <div className="columns is-left" style={{ margin: "1.5em 0 1.5em 0" }}>
                    <div className="format-tabs">
                        {standingFormats.reverse().map(({ value }) => (
                            <button
                                key={value}
                                className={`button format-tab ${standingFormat === value ? "is-active" : ""}`}
                                onClick={() => updateFilters(date, value)}
                            >
                                {t(value)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ================= TABLES ================= */}
                {viewData?.sections.map((section) => {
                    if (section.isConferenceHeader) {
                        return (
                            <div key={section.key} className="big-title">
                                {translate(section.title)}
                            </div>
                        );
                    }

                    const isSubtitle =
                        standingFormat === "conference" || standingFormat === "league";

                    return (
                        <div key={section.key}>
                            <div className={isSubtitle ? "big-title" : "divisions"}>
                                {translate(section.title)}
                            </div>
                            <SortableTable
                                cols={cols}
                                rows={section.rows}
                                rankKey={section.rankKey}
                                sortState={standingsSort}
                                setSortState={setStandingsSort}
                                rowKey="teamName.default"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Standings;
