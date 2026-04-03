// Retourne liste des colonnes nécessaire pour la liste d'équipe
export function getPlayersCols(type, t, season, allStandingsSeasons) {
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
            label: t("lbl_sweaterNumber"),
            title: t("sweaterNumber"),
            key: "sweaterNumber",
            render: (p) => p.sweaterNumber,
        },
        {
            label: t("lbl_position"),
            title: t("position"),
            key: "positionCode",
            defaultDir: "asc",
            render: (p) =>
                p.positionCode === "R" || p.positionCode === "L"
                    ? p.positionCode + "W"
                    : p.positionCode,
        },
        {
            label: type === "goalie" ? t("lbl_catches") : t("lbl_shoots"),
            title: type === "goalie" ? t("catches") : t("shoots"),
            key: "shootsCatches",
            defaultDir: "asc",
            render: (p) => p.shootsCatches,
        },
        {
            label: t("lbl_height"),
            title: t("height"),
            key: "heightInInches",
            render: (p) => {
                const totalInches = p.heightInInches;
                const feet = Math.floor(totalInches / 12);
                const inches = totalInches % 12;
                return `${feet}'${inches}`;
            },
        },
        {
            label: t("lbl_weight"),
            title: t("weight"),
            key: "weightInPounds",
            className: "col-wide",
            render: (p) => `${p.weightInPounds} lbs`,
        },
        {
            label: t("lbl_age"),
            title: t("age"),
            key: "age",
            render: (p) => {
                const birth = new Date(p.birthDate);
                const seasonYear = allStandingsSeasons.find((s) => s.id === Number(season));
                const seasonEnd = seasonYear ? new Date(seasonYear.standingsEnd) : new Date();
                let age = seasonEnd.getFullYear() - birth.getFullYear();
                const m = seasonEnd.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && seasonEnd.getDate() < birth.getDate())) age--;
                return age;
            },
        },
        {
            label: t("lbl_birthDate"),
            title: t("birthDate"),
            key: "birthDate",
            defaultDir: "asc",
            render: (p) => {
                const date = new Date(p.birthDate);
                return date.toLocaleDateString(t("locale"), {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });
            },
        },
        {
            label: t("lbl_birthplace"),
            title: t("birthplace"),
            key: "birthCity",
            defaultDir: "asc",
            render: (p) => {
                const city = p.birthCity?.default ?? "";
                const province = p.birthStateProvince?.default ?? "";
                const country = p.birthCountry ?? "";
                return [city, province, country].filter(Boolean).join(", ");
            },
        },
    ];
}
