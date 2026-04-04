import { useState, useEffect, useRef } from "react";
import GameCard from "./GameCard.jsx";

function Scoreboard({ games, location }) {
	const wrapperRef = useRef(null);
	const [availableWidth, setAvailableWidth] = useState(0);
	const [startIndex, setStartIndex] = useState(3);
	const [prevIndex, setPrevIndex] = useState(3);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);
    const mobileScrollRef = useRef(null);

	const cardWidth = 240;
	const gap = 40;
	const maxGamesPerPage = 6;
	const NAV_BUTTONS_WIDTH = 112; // 2 buttons ~40px each + 2rem gap (~32px) x2

	useEffect(() => {
		if (!wrapperRef.current) return;
		const observer = new ResizeObserver(([entry]) => {
			setAvailableWidth(entry.contentRect.width);
		});
		observer.observe(wrapperRef.current);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 1023);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

    useEffect(() => {
    if (isMobile && mobileScrollRef.current) {
        const card = mobileScrollRef.current.children[3]; // 4th card (index 3)
        if (card) {
            card.scrollIntoView({ behavior: "instant", block: "nearest", inline: "center" });
        }
    }
}, [isMobile]);

	const gamesPerPage = availableWidth
		? Math.min(
				maxGamesPerPage,
				Math.max(
					1,
					Math.floor(
						(availableWidth - NAV_BUTTONS_WIDTH + gap) /
							(cardWidth + gap),
					),
				),
			)
		: maxGamesPerPage;

	const exactWidth = gamesPerPage * cardWidth + (gamesPerPage - 1) * gap;

	const maxIndex = Math.max(0, games.length - gamesPerPage);
	const clampedStart = Math.min(startIndex, maxIndex);
	const distance = Math.abs(clampedStart - prevIndex);
	const duration = Math.min(0.3 + distance * 0.1, 1.0);
	const step = gamesPerPage >= 4 ? gamesPerPage - 1 : gamesPerPage;

    if (isMobile) {
        return (
            <div className="scoreboard-mobile" ref={mobileScrollRef}>
                {games.map((game, i) => (
                    <div className="game-column" key={game?.id ?? `empty-${i}`}>
                        <GameCard game={game} location={location} />
                    </div>
                ))}
            </div>
        );
    } else {
		return (
			<div className="scoreboard-measure" ref={wrapperRef}>
				<div className="scoreboard-row">
					<button
						className="button nav-button"
						onClick={() => {
							setPrevIndex(clampedStart);
							setStartIndex(Math.max(0, clampedStart - step));
						}}
						disabled={clampedStart === 0}
					>
						‹
					</button>

					<div
						className="cards-overflow"
						style={{ width: exactWidth }}
					>
						<div
							className="cards-wrapper"
							style={{
								transform: `translateX(${-clampedStart * (cardWidth + gap)}px)`,
								transition: `transform ${duration}s ease`,
							}}
						>
							{games.map((game, i) => (
								<div
									className="game-column"
									key={game?.id ?? `empty-${i}`}
								>
									<GameCard game={game} location={location} />
								</div>
							))}
						</div>
					</div>

					<button
						className="button nav-button"
						onClick={() => {
							setPrevIndex(clampedStart);
							setStartIndex(
								Math.min(maxIndex, clampedStart + step),
							);
						}}
						disabled={clampedStart >= maxIndex}
					>
						›
					</button>
				</div>
			</div>
		);
	}
}

export default Scoreboard;
