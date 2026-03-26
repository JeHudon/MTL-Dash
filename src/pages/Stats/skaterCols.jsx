// Retourne liste des colonnes nécessaire pour les statistiques d'un patineur
export function getSkaterCols(formatTime, t) {
    return [
                {
            label: t("player"),
            title: "",
            key: "player",
            defaultDir: "asc",
            render: (p) => (
                <div
                    className="player-cell"
                >
                    <img
                        src={p.headshot}
                        style={{ width: "50px" }}
                    />
                    <span>
                        {p.firstName?.default} {p.lastName?.default}
                    </span>
                </div>
            ),
        },
        {
            label: t("lbl_gamesPlayed"),
            title: t("gamesPlayed"),
            key: "gamesPlayed",
            render: (p) => p.gamesPlayed ?? "--",
        },
        {
            label: t("lbl_goals"),
            title: t("goals"),
            key: "goals",
            render: (p) => p.goals ?? "--",
        },
        {
            label: t("lbl_assists"),
            title: t("assists"),
            key: "assists",
            render: (p) => p.assists ?? "--",
        },
        {
            label: t("lbl_points"),
            title: t("points"),
            key: "points",
            render: (p) => p.points ?? "--",
        },
        {
            label: t("lbl_plusMinus"),
            title: t("plusMinus"),
            key: "plusMinus",
            render: (p) => p.plusMinus ?? "--",
        },
        {
            label: t("lbl_penaltyMinutes"),
            title: t("penaltyMinutes"),
            key: "penaltyMinutes",
            render: (p) => p.penaltyMinutes ?? "--",
        },
        {
            label: t("lbl_powerPlayGoals"),
            title: t("powerPlayGoals"),
            key: "powerPlayGoals",
            render: (p) => p.powerPlayGoals ?? "--",
        },
        {
            label: t("lbl_shorthandedGoals"),
            title: t("shorthandedGoals"),
            key: "shorthandedGoals",
            render: (p) => p.shorthandedGoals ?? "--",
        },
        {
            label: t("lbl_gameWinningGoals"),
            title: t("gameWinningGoals"),
            key: "gameWinningGoals",
            render: (p) => p.gameWinningGoals ?? "--",
        },
        {
            label: t("lbl_overtimeGoals"),
            title: t("overtimeGoals"),
            key: "overtimeGoals",
            render: (p) => p.overtimeGoals ?? "--",
        },
        {
            label: t("lbl_shots"),
            title: t("shots"),
            key: "shots",
            render: (p) => p.shots ?? "--",
        },
        {
            label: t("lbl_shootingPctg"),
            title: t("shootingPctg"),
            key: "shootingPctg",
            render: (p) => p.shootingPctg?.toFixed(1) ?? "--",
        },
        {
            label: t("lbl_toiPerGame"),
            title: t("toiPerGame"),
            key: "avgTimeOnIcePerGame",
            render: (p) => (p.avgTimeOnIcePerGame ? formatTime(p.avgTimeOnIcePerGame) : "--"),
        },
        {
            label: t("lbl_shiftsPerGame"),
            title: t("shiftsPerGame"),
            key: "avgShiftsPerGame",
            render: (p) => p.avgShiftsPerGame?.toFixed(1) ?? "--",
        },
        {
            label: t("lbl_faceoffPctg"),
            title: t("faceoffPctg"),
            key: "faceoffWinPctg",
            render: (p) => p.faceoffWinPctg?.toFixed(1) ?? "--",
        },
    ];
}
