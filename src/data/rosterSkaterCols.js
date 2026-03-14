export function getPlayersCols(type) {
    return [
        {
            label: "#",
            title: "Sweater Number",
            key: "sweaterNumber",
            render: (p) => p.sweaterNumber,
        },
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
        {
            label: type === "goalie" ? "Ca" : "Sh",
            title: type === "goalie" ? "Catches" : "Shoots",
            key: "shootsCatches",
            defaultDir: "asc",
            render: (p) => p.shootsCatches,
        },
        {
            label: "Ht",
            title: "Height",
            key: "heightInInches",
            render: (p) => {
                const totalInches = p.heightInInches;
                const feet = Math.floor(totalInches / 12);
                const inches = totalInches % 12;
                return `${feet}'${inches}"`;
            },
        },
        {
            label: "Wt",
            title: "Weight",
            key: "weightInPounds",
            render: (p) => `${p.weightInPounds} kg`,
        },
        {
            label: "Age",
            title: "Age",
            key: "age",
            render: (p) => {
                const birth = new Date(p.birthDate);
                const today = new Date();
                let age = today.getFullYear() - birth.getFullYear();
                const m = today.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
                return age;
            },
        },
        {
            label: "Born",
            title: "Birth Date",
            key: "birthDate",
            defaultDir: "asc",
            render: (p) => p.birthDate,
        },
        {
            label: "Birthplace",
            title: "Birthplace",
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
