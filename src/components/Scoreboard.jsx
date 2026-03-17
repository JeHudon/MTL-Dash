import { useState } from "react";
import GameCard from "./GameCard.jsx";

function Scoreboard({ games, location }) {
    const [startIndex, setStartIndex] = useState(3);
    const [prevIndex, setPrevIndex] = useState(3);
    const gamesPerPage = 6;
    const cardWidth = 240;
    const gap = 40;

    const maxIndex = Math.max(0, games.length - gamesPerPage);
    const distance = Math.abs(startIndex - prevIndex);
    const duration = Math.min(0.3 + distance * 0.1, 1.0);

    return (
        <div className="scoreboard-row">
            {/* Bouton précédent */}
            <button
                className="button nav-button"
                onClick={() => { setPrevIndex(startIndex); setStartIndex(0); }}
                disabled={startIndex === 0}
            >
                ‹
            </button>

            {/* Toutes les cards, translation CSS pour simuler le scroll */}
            <div className="cards-overflow">
                <div
                    className="cards-wrapper"
                    style={{
                        transform: `translateX(${-startIndex * (cardWidth + gap)}px)`,
                        transition: `transform ${duration}s ease`,
                    }}
                >
                    {games.map((game, i) => (
                        <div className="game-column" key={game?.id ?? `empty-${i}`}>
                            <GameCard game={game} location={location} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bouton suivant */}
            <button
                className="button nav-button"
                onClick={() => { setPrevIndex(startIndex); setStartIndex(maxIndex); }}
                disabled={startIndex >= maxIndex}
            >
                ›
            </button>
        </div>
    );
}

export default Scoreboard;