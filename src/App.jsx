import { getRoster, getSchedule, getScoreboard } from "./api";
import { useState, useEffect } from "react";

function App() {
    const [roster, setRoster] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [scoreboard, setScoreboard] = useState([]);

    useEffect(() => {
        const fetchRoster = async () => {
            const data = await getRoster();
            setRoster(data);
        };

        const fetchSchedule = async () => {
            const data = await getSchedule();
            setSchedule(data);
        };

        const fetchScoreboard = async () => {
            const data = await getScoreboard();
            setScoreboard(data);
        };

        fetchRoster();
        fetchSchedule();
        fetchScoreboard();
    }, []);

    return (
        <>
            <div className="container">
                <h1 className="title is-4 has-text-centered" style={{ paddingTop: "20px" }}>
                    MTL Scoreboard
                </h1>
                <div className="section">
                    <div className="columns is-multiline is-centered">
                        {scoreboard && scoreboard.gamesByDate ? (
                            scoreboard.gamesByDate.map((day) => (
                                <div className="box card large column is-3" style={{margin:"15px"}} key={day.date}>
                                    <h2>{day.date}</h2>
                                    {day.games.map((game) => (
                                        <div key={game.id}>
                                            <p>
                                                Home: {game.homeTeam.name.fr} (
                                                {game.homeTeam.abbrev})
                                            </p>
                                            <p>
                                                Away: {game.awayTeam.name.fr} (
                                                {game.awayTeam.abbrev})
                                            </p>
                                            <p>
                                                Score: {game.homeTeam.score} - {game.awayTeam.score}
                                            </p>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <img
                                                    src={game.homeTeam.logo}
                                                    alt={game.homeTeam.commonName.default}
                                                    width={50}
                                                />
                                                <img
                                                    src={game.awayTeam.logo}
                                                    alt={game.awayTeam.commonName.default}
                                                    width={50}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
