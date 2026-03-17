// Titres en anglais et français
const titles = {
    "en-US": {
        gamesPlayed: "Games Played",
        gamesStarted: "Games Started",
        wins: "Wins",
        losses: "Losses",
        overtimeLosses: "Overtime Losses",
        gaa: "Goals Against Average",
        savePctg: "Save Percentage",
        shotsAgainst: "Shots Against",
        saves: "Saves",
        goalsAgainst: "Goals Against",
        shutouts: "Shutouts",
        goals: "Goals",
        assists: "Assists",
        points: "Points",
        penaltyMinutes: "Penalty Minutes",
        toi: "Time On Ice",
    },
    "fr-FR": {
        gamesPlayed: "Matchs joués",
        gamesStarted: "Matchs commencés",
        wins: "Victoires",
        losses: "Défaites",
        overtimeLosses: "Défaites en prolongation",
        gaa: "Moyenne de buts alloués",
        savePctg: "Pourcentage d'arrêts",
        shotsAgainst: "Tirs contre",
        saves: "Arrêts",
        goalsAgainst: "Buts alloués",
        shutouts: "Jeux blancs",
        goals: "Buts",
        assists: "Passes",
        points: "Points",
        penaltyMinutes: "Minutes de pénalité",
        toi: "Temps de glace",
    },
};

// Retourne liste des colonnes nécessaire pour les statistiques d'un goalie
export function getGoalieCols(formatTime, locale = "fr-FR") {
    const t = titles[locale] ?? titles["fr-FR"];
    return [
        {
            label: locale === "fr-FR" ? "PJ" : "GP",
            title: t.gamesPlayed,
            key: "gamesPlayed",
            render: (g) => g.gamesPlayed ?? "--",
        },
        {
            label: locale === "fr-FR" ? "MC" : "GS",
            title: t.gamesStarted,
            key: "gamesStarted",
            render: (g) => g.gamesStarted ?? "--",
        },
        {
            label: locale === "fr-FR" ? "V" : "W",
            title: t.wins,
            key: "wins",
            render: (g) => g.wins ?? "--",
        },
        {
            label: locale === "fr-FR" ? "D" : "L",
            title: t.losses,
            key: "losses",
            render: (g) => g.losses ?? "--",
        },
        {
            label: locale === "fr-FR" ? "N" : "T",
            title: t.overtimeLosses,
            key: "overtimeLosses",
            render: (g) => g.overtimeLosses ?? "--",
        },
        {
            label: locale === "fr-FR" ? "MBA" : "GAA",
            title: t.gaa,
            key: "goalsAgainstAverage",
            render: (g) => g.goalsAgainstAverage?.toFixed(2) ?? "--",
        },
        {
            label: locale === "fr-FR" ? "AR%" : "SV%",
            title: t.savePctg,
            key: "savePercentage",
            render: (g) => g.savePercentage?.toFixed(3) ?? "--",
        },
        {
            label: locale === "fr-FR" ? "TC" : "SA",
            title: t.shotsAgainst,
            key: "shotsAgainst",
            render: (g) => g.shotsAgainst ?? "--",
        },
        {
            label: locale === "fr-FR" ? "AR" : "SV",
            title: t.saves,
            key: "saves",
            render: (g) => g.saves ?? "--",
        },
        {
            label: locale === "fr-FR" ? "BA" : "GA",
            title: t.goalsAgainst,
            key: "goalsAgainst",
            render: (g) => g.goalsAgainst ?? "--",
        },
        {
            label: locale === "fr-FR" ? "JB" : "SO",
            title: t.shutouts,
            key: "shutouts",
            render: (g) => g.shutouts ?? "--",
        },
        {
            label: locale === "fr-FR" ? "B" : "G",
            title: t.goals,
            key: "goals",
            render: (g) => g.goals ?? "--",
        },
        { label: "A", title: t.assists, key: "assists", render: (g) => g.assists ?? "--" },
        { label: "Pts", title: t.points, key: "points", render: (g) => g.points ?? "--" },
        {
            label: locale === "fr-FR" ? "PUN" : "PIM",
            title: t.penaltyMinutes,
            key: "penaltyMinutes",
            render: (g) => g.penaltyMinutes ?? "--",
        },
        {
            label: locale === "fr-FR" ? "TG" : "TOI",
            title: t.toi,
            key: "timeOnIce",
            render: (g) => (g.timeOnIce ? formatTime(g.timeOnIce) : "--"),
        },
    ];
}
