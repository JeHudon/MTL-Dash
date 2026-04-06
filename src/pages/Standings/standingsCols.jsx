// Retourne liste des colonnes nécessaire pour le classement
export function getStandingsCols(t, hasTies = false) {
    return [
        {
            label: t("lbl_rank"),
            title: t("rank"),
            key: "leagueSequence",
            render: (row, rankKey) => row[rankKey] ?? "--",
        },
        {
            label: t("lbl_team"),
            title: t("team"),
            key: "teamName",
            render: (team) => {
                const clinch = team.clinchIndicator;
                return (
                    <div className="team-cell">
                        <img
                            src={team.teamLogo}
                            alt={team.teamAbbrev?.default}
                            style={{ width: "50px" }}
                        />
                        <div>
                            {t("locale") === "fr"
                                ? (team.teamName?.fr ?? team.teamName?.default)
                                : team.teamName?.default}
                        </div>
                        {clinch && (
                            <div className={`clinched-${clinch}`}>
                                {clinch === "x" ? "X" : clinch === "e" ? "E" : ""}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            label: t("lbl_gamesPlayed"),
            title: t("gamesPlayed"),
            key: "gamesPlayed",
            render: (team) => team.gamesPlayed ?? "--",
        },
        {
            label: t("lbl_wins"),
            title: t("wins"),
            key: "wins",
            render: (team) => team.wins ?? "--",
        },
        {
            label: t("lbl_losses"),
            title: t("losses"),
            key: "losses",
            defaultDir: "asc",
            render: (team) => team.losses ?? "--",
        },
        // OT losses (modern) ou Ties (saisons anciennes)
        hasTies
            ? {
                  label: t("lbl_ties"),
                  title: t("ties"),
                  key: "ties",
                  render: (team) => team.ties ?? "--",
              }
            : {
                  label: t("lbl_overtimeLosses"),
                  title: t("overtimeLosses"),
                  key: "otLosses",
                  defaultDir: "asc",
                  render: (team) => team.otLosses ?? "--",
              },
        {
            label: t("lbl_points"),
            title: t("points"),
            key: "points",
            render: (team) => team.points ?? "--",
        },
        {
            label: t("lbl_pointPctg"),
            title: t("pointPctg"),
            key: "pointPctg",
            render: (team) => team.pointPctg?.toFixed(3).slice(1) ?? "--",
        },
        {
            label: t("lbl_regulationWins"),
            title: t("regulationWins"),
            key: "regulationWins",
            render: (team) => team.regulationWins ?? "--",
        },
        {
            label: t("lbl_regulationPlusOtWins"),
            title: t("regulationPlusOtWins"),
            key: "regulationPlusOtWins",
            render: (team) => team.regulationPlusOtWins ?? "--",
        },
        {
            label: t("lbl_goalsFor"),
            title: t("goalsFor"),
            key: "goalFor",
            render: (team) => team.goalFor ?? "--",
        },
        {
            label: t("lbl_goalsAgainst"),
            title: t("goalsAgainst"),
            key: "goalAgainst",
            defaultDir: "asc",
            render: (team) => team.goalAgainst ?? "--",
        },
        {
            label: t("lbl_goalDifferential"),
            title: t("goalDifferential"),
            key: "goalDifferential",
            render: (team) => {
                const diff = team.goalDifferential;
                if (diff == null) return "--";
                return diff > 0 ? `+${diff}` : `${diff}`;
            },
        },
        {
            label: t("lbl_homeRecord"),
            title: t("homeRecord"),
            key: "homeWins",
            className: "col-wide",
            sorter: (a, b) => {
                const aW = a.homeWins ?? 0;
                const bW = b.homeWins ?? 0;
                if (bW !== aW) return bW - aW;

                const aTies = a.homeTies ?? 0;
                const bTies = b.homeTies ?? 0;
                if (bTies !== aTies) return bTies - aTies;

                const aL = a.homeLosses ?? 0;
                const bL = b.homeLosses ?? 0;
                return aL - bL;
            },
            render: (team) => {
                const w = team.homeWins ?? 0;
                const l = team.homeLosses ?? 0;
                const ot = team.homeOtLosses ?? 0;
                const ties = team.homeTies ?? 0;
                return hasTies ? `${w}-${l}-${ties}` : `${w}-${l}-${ot}`;
            },
        },
        {
            label: t("lbl_awayRecord"),
            title: t("awayRecord"),
            key: "roadWins",
            className: "col-wide",
            sorter: (a, b) => {
                const aW = a.roadWins ?? 0;
                const bW = b.roadWins ?? 0;
                if (bW !== aW) return bW - aW;

                const aTies = a.roadTies ?? 0;
                const bTies = b.roadTies ?? 0;
                if (bTies !== aTies) return bTies - aTies;

                const aL = a.roadLosses ?? 0;
                const bL = b.roadLosses ?? 0;
                return aL - bL;
            },
            render: (team) => {
                const w = team.roadWins ?? 0;
                const l = team.roadLosses ?? 0;
                const ot = team.roadOtLosses ?? 0;
                const ties = team.roadTies ?? 0;
                return hasTies ? `${w}-${l}-${ties}` : `${w}-${l}-${ot}`;
            },
        },
        {
            label: t("lbl_shootoutRecord"),
            title: t("shootoutRecord"),
            key: "shootoutWins",
            sorter: (a, b) => {
                const aW = a.shootoutWins ?? 0;
                const bW = b.shootoutWins ?? 0;
                if (bW !== aW) return bW - aW;
                return (a.shootoutLosses ?? 0) - (b.shootoutLosses ?? 0);
            },
            render: (team) => {
                const w = team.shootoutWins ?? 0;
                const l = team.shootoutLosses ?? 0;
                return `${w}-${l}`;
            },
        },
        {
            label: t("lbl_l10"),
            title: t("l10"),
            key: "l10Points",
            sorter: (a, b) => {
                const aW = a.l10Wins ?? 0;
                const bW = b.l10Wins ?? 0;
                if (bW !== aW) return bW - aW;

                const aTies = a.l10Ties ?? 0;
                const bTies = b.l10Ties ?? 0;
                if (bTies !== aTies) return bTies - aTies;

                const aL = a.l10Losses ?? 0;
                const bL = b.l10Losses ?? 0;
                return aL - bL;
            },
            render: (team) => {
                const w = team.l10Wins ?? 0;
                const l = team.l10Losses ?? 0;
                const ot = team.l10OtLosses ?? 0;
                const ties = team.l10Ties ?? 0;
                return hasTies ? `${w}-${l}-${ties}` : `${w}-${l}-${ot}`;
            },
        },
        {
            label: t("lbl_streak"),
            title: t("streak"),
            key: "streakCount",
            sorter: (a, b) => {
                const aCode = a.streakCode ?? "";
                const bCode = b.streakCode ?? "";

                const rank = (code) => (code === "W" ? 0 : code === "OT" ? 1 : 2);

                // Sort by code group first
                if (rank(aCode) !== rank(bCode)) return rank(aCode) - rank(bCode);

                const aCount = a.streakCount ?? 0;
                const bCount = b.streakCount ?? 0;

                // W/OT: highest first, L: lowest first
                return rank(aCode) === 2 ? aCount - bCount : bCount - aCount;
            },
            render: (team) => {
                const code = team.streakCode;
                const count = team.streakCount;
                if (!code || count == null) return "--";
                return `${code}${count}`;
            },
        },
    ];
}
