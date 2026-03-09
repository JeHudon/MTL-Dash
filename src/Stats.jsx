import { getRoster, getSchedule, getScoreboard, getStats, getSeasons } from "./api.js";
import { useState, useEffect } from "react";

function Stats() {
    const [stats, setStats] = useState([]);
    const [season, setSeason] = useState("20252026");
    const [allSeasons, setAllSeasons] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getStats();
            setStats(data);
        };
        fetchStats();

        const fetchSeasons = async () => {
            const data = await getSeasons();
            setAllSeasons(data);
        };
        fetchSeasons();
    }, []);

    function formatSeason(season) {
        const start = season.toString().slice(0, 4);
        const end = season.toString().slice(6);
        return `${start}-${end}`;
    }

    return (
        <>
            <div className="container">
                <div className="section">
                    <div className="columns is-multiline is-centered is-variable is-8">
                        <div className="select">
                            <select>
                                {allSeasons.map((season) => (
                                    <option key={season.season} value={season.season}>
                                        {formatSeason(season.season)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Stats;
