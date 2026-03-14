export function getSkaterCols(formatTime) {
    return [
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
        {
            label: "PIM",
            title: "Penalty Minutes",
            key: "penaltyMinutes",
            render: (p) => p.penaltyMinutes,
        },
        {
            label: "PPG",
            title: "Power Play Goals",
            key: "powerPlayGoals",
            render: (p) => p.powerPlayGoals,
        },
        {
            label: "SHG",
            title: "Shorthanded Goals",
            key: "shorthandedGoals",
            render: (p) => p.shorthandedGoals,
        },
        {
            label: "GWG",
            title: "Game Winning Goals",
            key: "gameWinningGoals",
            render: (p) => p.gameWinningGoals,
        },
        {
            label: "OTG",
            title: "Overtime Goals",
            key: "overtimeGoals",
            render: (p) => p.overtimeGoals,
        },
        { label: "S", title: "Shots", key: "shots", render: (p) => p.shots },
        {
            label: "S%",
            title: "Shooting Percentage",
            key: "shootingPctg",
            render: (p) => p.shootingPctg.toFixed(1),
        },
        {
            label: "TOI/G",
            title: "Time On Ice Per Game",
            key: "avgTimeOnIcePerGame",
            render: (p) => formatTime(p.avgTimeOnIcePerGame),
        },
        {
            label: "SFT/G",
            title: "Shifts Per Game",
            key: "avgShiftsPerGame",
            render: (p) => p.avgShiftsPerGame.toFixed(1),
        },
        {
            label: "FO%",
            title: "Faceoff Win Percentage",
            key: "faceoffWinPctg",
            render: (p) => p.faceoffWinPctg.toFixed(1),
        },
    ];
}
