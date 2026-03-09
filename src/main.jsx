import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Dash from "./Dash.jsx";
import Stats from "./Stats.jsx";
// import "bulma/css/bulma.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const scoreboard = document.getElementById("scoreboard");
if (scoreboard) {
  createRoot(scoreboard).render(<Dash />);
}

const stats = document.getElementById("stats");
if (stats) {
  createRoot(stats).render(<Stats />);
}