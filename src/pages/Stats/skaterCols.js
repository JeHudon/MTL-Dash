// Titres en anglais et français
const titles = {
    "en-US": {
        position: "Position",
        gamesPlayed: "Games Played",
        goals: "Goals",
        assists: "Assists",
        points: "Points",
        plusMinus: "Plus/Minus",
        penaltyMinutes: "Penalty Minutes",
        powerPlayGoals: "Power Play Goals",
        shorthandedGoals: "Shorthanded Goals",
        gameWinningGoals: "Game Winning Goals",
        overtimeGoals: "Overtime Goals",
        shots: "Shots",
        shootingPctg: "Shooting Percentage",
        toiPerGame: "Time On Ice Per Game",
        shiftsPerGame: "Shifts Per Game",
        faceoffPctg: "Faceoff Win Percentage",
    },
    "fr-FR": {
        position: "Position",
        gamesPlayed: "Matchs joués",
        goals: "Buts",
        assists: "Passes",
        points: "Points",
        plusMinus: "Plus/Moins",
        penaltyMinutes: "Minutes de pénalité",
        powerPlayGoals: "Buts en avantage numérique",
        shorthandedGoals: "Buts en désavantage numérique",
        gameWinningGoals: "Buts gagnants",
        overtimeGoals: "Buts en prolongation",
        shots: "Tirs",
        shootingPctg: "Pourcentage de tirs",
        toiPerGame: "Temps de glace par match",
        shiftsPerGame: "Présences par match",
        faceoffPctg: "Pourcentage de mises en jeu",
    },
};


// Retourne liste des colonnes nécessaire pour les statistiques d'un patineur
export function getSkaterCols(formatTime, locale = "fr-FR") {
    const t = titles[locale] ?? titles["fr-FR"];
    return [
        {
            label: "Pos",
            title: t.position,
            key: "positionCode",
            defaultDir: "asc",
            render: (p) =>
                p.positionCode === "R" || p.positionCode === "L"
                    ? p.positionCode + "W"
                    : p.positionCode,
        },
        { label: "PJ", title: t.gamesPlayed, key: "gamesPlayed", render: (p) => p.gamesPlayed },
        { label: "B", title: t.goals, key: "goals", render: (p) => p.goals },
        { label: "A", title: t.assists, key: "assists", render: (p) => p.assists },
        { label: "Pts", title: t.points, key: "points", render: (p) => p.points },
        { label: "+/-", title: t.plusMinus, key: "plusMinus", render: (p) => p.plusMinus },
        { label: "PUN", title: t.penaltyMinutes, key: "penaltyMinutes", render: (p) => p.penaltyMinutes },
        { label: "BAN", title: t.powerPlayGoals, key: "powerPlayGoals", render: (p) => p.powerPlayGoals },
        { label: "BDN", title: t.shorthandedGoals, key: "shorthandedGoals", render: (p) => p.shorthandedGoals },
        { label: "BG", title: t.gameWinningGoals, key: "gameWinningGoals", render: (p) => p.gameWinningGoals },
        { label: "BP", title: t.overtimeGoals, key: "overtimeGoals", render: (p) => p.overtimeGoals },
        { label: "T", title: t.shots, key: "shots", render: (p) => p.shots },
        { label: "T%", title: t.shootingPctg, key: "shootingPctg", render: (p) => p.shootingPctg.toFixed(1) },
        { label: "TG/M", title: t.toiPerGame, key: "avgTimeOnIcePerGame", render: (p) => formatTime(p.avgTimeOnIcePerGame) },
        { label: "PR/M", title: t.shiftsPerGame, key: "avgShiftsPerGame", render: (p) => p.avgShiftsPerGame.toFixed(1) },
        { label: "MJ%", title: t.faceoffPctg, key: "faceoffWinPctg", render: (p) => p.faceoffWinPctg.toFixed(1) },
    ];
}