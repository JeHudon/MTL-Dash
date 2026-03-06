const BASE_URL = "/api";

export async function getRoster() {
  const response = await fetch(`${BASE_URL}/club/MTL/roster/now`);
  return response.json();
}

export async function getSchedule() {
  const response = await fetch(`${BASE_URL}/club-schedule/MTL/now`);
  return response.json();
}

export async function getScoreboard() {
  const response = await fetch(`${BASE_URL}/scoreboard/mtl/now`);
  return response.json();
}
