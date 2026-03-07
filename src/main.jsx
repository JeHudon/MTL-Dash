import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Dash from "./Dash.jsx";
// import "bulma/css/bulma.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

createRoot(document.getElementById("scoreboard")).render(
  <StrictMode>
    <Dash />
  </StrictMode>,
);
