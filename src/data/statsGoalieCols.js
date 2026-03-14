export function getGoalieCols(formatTime) {
    return [
        { label: "GP", title: "Games Played", key: "gamesPlayed", render: (g) => g.gamesPlayed },
        { label: "GS", title: "Games Started", key: "gamesStarted", render: (g) => g.gamesStarted },
        { label: "W", title: "Wins", key: "wins", render: (g) => g.wins },
        { label: "L", title: "Losses", key: "losses", render: (g) => g.losses },
        {
            label: "OT",
            title: "Overtime Losses",
            key: "overtimeLosses",
            render: (g) => g.overtimeLosses,
        },
        {
            label: "GAA",
            title: "Goals Against Average",
            key: "goalsAgainstAverage",
            render: (g) => g.goalsAgainstAverage.toFixed(2),
        },
        {
            label: "SV%",
            title: "Save Percentage",
            key: "savePercentage",
            render: (g) => g.savePercentage.toFixed(3),
        },
        { label: "SA", title: "Shots Against", key: "shotsAgainst", render: (g) => g.shotsAgainst },
        { label: "SV", title: "Saves", key: "saves", render: (g) => g.saves },
        { label: "GA", title: "Goals Against", key: "goalsAgainst", render: (g) => g.goalsAgainst },
        { label: "SO", title: "Shutouts", key: "shutouts", render: (g) => g.shutouts },
        { label: "G", title: "Goals", key: "goals", render: (g) => g.goals },
        { label: "A", title: "Assists", key: "assists", render: (g) => g.assists },
        { label: "P", title: "Points", key: "points", render: (g) => g.points },
        {
            label: "PIM",
            title: "Penalty Minutes",
            key: "penaltyMinutes",
            render: (g) => g.penaltyMinutes,
        },
        {
            label: "TOI",
            title: "Time On Ice",
            key: "timeOnIce",
            render: (g) => formatTime(g.timeOnIce),
        },
    ];
}
