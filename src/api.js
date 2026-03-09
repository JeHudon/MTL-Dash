const BASE_URL = "/api";

export async function getRoster() {
  const response = await fetch(`${BASE_URL}/roster/MTL/20252026`);
  return response.json();
}

export async function getSchedule() {
  const response = await fetch(`${BASE_URL}/club-schedule/MTL/month/now`);
  return response.json();
}

export async function getScoreboard() {
  const response = await fetch(`${BASE_URL}/scoreboard/mtl/now`);
  return response.json();
}

export async function getStats(season, gameType) {
  const response = await fetch(`${BASE_URL}/club-stats/MTL/${season}/${gameType}`);
  return response.json();
}

export async function getSeasons() {
  const response = await fetch(`${BASE_URL}/club-stats-season/MTL`);
  return response.json();
}

// https://api-web.nhle.com/v1/club-stats-season/MTL : liste saisons disponibles
// https://api-web.nhle.com/v1/club-schedule/MTL/month/now : schedule du mois de mars 2026 (par mois)
// https://api-web.nhle.com/v1/standings/now : classement du 6 mars 2026 (par date)