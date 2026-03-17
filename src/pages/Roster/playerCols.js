// Titres en anglais et français
const titles = {
    "en-US": {
        sweaterNumber: "Sweater Number",
        position: "Position",
        catches: "Catches",
        shoots: "Shoots",
        height: "Height",
        weight: "Weight",
        age: "Age",
        birthDate: "Birth Date",
        birthplace: "Birthplace",
    },
    "fr-FR": {
        sweaterNumber: "Numéro",
        position: "Position",
        catches: "Attrape",
        shoots: "Lance de la",
        height: "Taille",
        weight: "Poids",
        age: "Âge",
        birthDate: "Date de naissance",
        birthplace: "Lieu de naissance",
    },
};

// Retourne liste des colonnes nécessaire pour la liste d'équipe
export function getPlayersCols(type, locale = "fr-FR") {
    const t = titles[locale] ?? titles["fr-FR"];

    return [
        {
            label: "#",
            title: t.sweaterNumber,
            key: "sweaterNumber",
            render: (p) => p.sweaterNumber,
        },
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
        {
            label: type === "goalie" ? (locale === "fr-FR" ? "Attr" : "Ca") : (locale === "fr-FR" ? "L" : "Sh"),
            title: type === "goalie" ? t.catches : t.shoots,
            key: "shootsCatches",
            defaultDir: "asc",
            render: (p) => p.shootsCatches,
        },
        {
            label: locale === "fr-FR" ? "Ta" : "Ht",
            title: t.height,
            key: "heightInInches",
            render: (p) => {
                const totalInches = p.heightInInches;
                const feet = Math.floor(totalInches / 12);
                const inches = totalInches % 12;
                return `${feet}'${inches}"`;
            },
        },
        {
            label: locale === "fr-FR" ? "Pds" : "Wt",
            title: t.weight,
            key: "weightInPounds",
            render: (p) => `${p.weightInPounds} lbs`,
        },
        {
            label: locale === "fr-FR" ? "Âge" : "Age",
            title: t.age,
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
            label: locale === "fr-FR" ? "Date de naissance" : "Born",
            title: t.birthDate,
            key: "birthDate",
            defaultDir: "asc",
            render: (p) => {
                const date = new Date(p.birthDate);
                return date.toLocaleDateString(locale, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });
            },
        },
        {
            label: locale === "fr-FR" ? "Lieu de naissance" : "Birthplace",
            title: t.birthplace,
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