export const translations = {
    "en-US": {
        regular: "Regular Season",
        playoffs: "Playoffs",
        skaters: "Skaters",
        goalies: "Goalies",
        forwards: "Forwards",
        defensemen: "Defensemen",
        loading: "Loading...",
        player: "Player",
        forwards: "Forwards",
        defensemen: "Defensemen",
        home: "Home",
        team: "Team",
        stats: "Stats",
        schedule: "Schedule",
        standings: "Standings",
        shots: "Shots",
    },
    "fr-FR": {
        regular: "Régulière",
        playoffs: "Séries éliminatoires",
        skaters: "Patineurs",
        goalies: "Gardiens",
        forwards: "Attaquants",
        defensemen: "Défenseurs",
        loading: "Chargement...",
        player: "Joueur",
        forwards: "Attaquants",
        defensemen: "Défenseurs",
        home: "Accueil",
        team: "Équipe",
        stats: "Stats",
        schedule: "Calendrier",
        standings: "Classement",
        shots: "Tirs",
    },
};

export function useTranslation(locale) {
    return translations[locale] ?? translations["fr-FR"];
}
