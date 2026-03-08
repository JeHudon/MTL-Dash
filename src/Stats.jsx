import { getRoster, getSchedule, getScoreboard, getStats } from "./api.js";
import { useState, useEffect } from "react";

function Stats() {
    const [stats, setStats] = useState([]);

    const fetchStats = async () => {
        const data = await getStats();
        setStats(data);
    };
    fetchStats();
}
