// Récuperer liste des joueurs et infos sur eux selon saison
export async function getRoster(season) {
    const response = await fetch(`/api/roster/MTL/${season}`);
    return response.json();
}

// Récuperer calendrier par mois
export async function getSchedule() {
    const response = await fetch(`/api/club-schedule/MTL/month/now`);
    return response.json();
}

// Récuperer 3-4 dernière games et 7-8 prochaines
export async function getScoreboard() {
    const response = await fetch(`/api/scoreboard/mtl/now`);
    return response.json();
}

// Récuperer liste des joueurs et leur stats selon saison et type
export async function getStats(season, gameType) {
    const response = await fetch(`/api/club-stats/MTL/${season}/${gameType}`);
    return response.json();
}

// Récuperer liste des saisons disponibles
export async function getSeasons() {
    const response = await fetch(`/api/club-stats-season/MTL`);
    return response.json();
}

// Récuperer localisation (pays) du user
export async function getLocation() {
    const response = await fetch(`/api/location`);
    return response.json();
}

// Récuperer stats d'un game en particulier
export async function getGameInfo(gameId) {
    const response = await fetch(`/api/gamecenter/${gameId}/boxscore`);
    return response.json();
}

// Récuperer standings pour une date
export async function getStandings(date) {
    const response = await fetch(`/api/standings/${date}`);
    return response.json();
}

// Récuperer list saisons dispo pour standings
export async function getStandingsSeasons() {
    const response = await fetch(`/api/standings-season`);
    return response.json();
}

// https://api-web.nhle.com/v1/club-schedule/MTL/month/now : schedule du mois de mars 2026 (par mois)
// https://api-web.nhle.com/v1/standings/:date : classement par date
// https://api-web.nhle.com/v1/standings-season : liste des saisons dispo pour les standings --> standings end mit par défaut quand change la saison
// https://api-web.nhle.com/v1/stats/rest/en/franchise?sort=fullName&include=lastSeason.id&include=firstSeason.id : liste teams par années pour roster et stats et pouquoi par schedule aussi
// https://api-web.nhle.com/v1/prospects/MTL : prospects
// https://api-web.nhle.com/v1/player/:playerId/landing : profile perso d'un joueur en params
// https://forge-dapi.d3.nhle.com/v2/content/en-us/players?tags.slug=playerid-8476981 : bio d'un joueur pour son profile
