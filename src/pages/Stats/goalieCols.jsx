// Retourne liste des colonnes nécessaire pour les statistiques d'un goalie
export function getGoalieCols(formatTime, t) {
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
                    <img src={p.headshot} style={{ width: "50px" }} />
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
            render: (g) => g.gamesPlayed ?? "--",
        },
        {
            label: t("lbl_gamesStarted"),
            title: t("gamesStarted"),
            key: "gamesStarted",
            render: (g) => g.gamesStarted ?? "--",
        },
        {
            label: t("lbl_wins"),
            title: t("wins"),
            key: "wins",
            render: (g) => g.wins ?? "--",
        },
        {
            label: t("lbl_losses"),
            title: t("losses"),
            key: "losses",
            render: (g) => g.losses ?? "--",
        },
        {
            label: t("lbl_overtimeLosses"),
            title: t("overtimeLosses"),
            key: "overtimeLosses",
            render: (g) => g.overtimeLosses ?? "--",
        },
        {
            label: t("lbl_gaa"),
            title: t("gaa"),
            key: "goalsAgainstAverage",
            render: (g) => g.goalsAgainstAverage?.toFixed(2) ?? "--",
        },
        {
            label: t("lbl_savePctg"),
            title: t("savePctg"),
            key: "savePercentage",
            render: (g) => g.savePercentage?.toFixed(3) ?? "--",
        },
        {
            label: t("lbl_shotsAgainst"),
            title: t("shotsAgainst"),
            key: "shotsAgainst",
            render: (g) => g.shotsAgainst ?? "--",
        },
        {
            label: t("lbl_saves"),
            title: t("saves"),
            key: "saves",
            render: (g) => g.saves ?? "--",
        },
        {
            label: t("lbl_goalsAgainst"),
            title: t("goalsAgainst"),
            key: "goalsAgainst",
            render: (g) => g.goalsAgainst ?? "--",
        },
        {
            label: t("lbl_shutouts"),
            title: t("shutouts"),
            key: "shutouts",
            render: (g) => g.shutouts ?? "--",
        },
        {
            label: t("lbl_goals"),
            title: t("goals"),
            key: "goals",
            render: (g) => g.goals ?? "--",
        },
        {
            label: t("lbl_assists"),
            title: t("assists"),
            key: "assists",
            render: (g) => g.assists ?? "--",
        },
        {
            label: t("lbl_points"),
            title: t("points"),
            key: "points",
            render: (g) => g.points ?? "--",
        },
        {
            label: t("lbl_penaltyMinutes"),
            title: t("penaltyMinutes"),
            key: "penaltyMinutes",
            render: (g) => g.penaltyMinutes ?? "--",
        },
        {
            label: t("lbl_toi"),
            title: t("toi"),
            key: "timeOnIce",
            className: "col-wide",
            render: (g) => (g.timeOnIce ? formatTime(g.timeOnIce) : "--"),
        },
    ];
}
