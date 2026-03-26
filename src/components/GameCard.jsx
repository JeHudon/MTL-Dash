import Icon from "@mdi/react";
import { mdiWhistle } from "@mdi/js";
import { useLocale } from "../context/LocaleContext.jsx";
import { useTranslation } from "../i18n.js";
import React, { useEffect, useState } from "react";
import { getGameInfo } from "../api.js";

function GameCard({ game, location }) {
    const [gameInfo, setGameInfo] = useState(null);
    const { locale } = useLocale();
    const t = useTranslation(locale);
    const isFuture = game.gameState === "FUT" || game.gameState === "PRE";
    const isLive = game.gameState === "LIVE" || game.gameState === "CRIT";
    const gameId = game.id;

    // Quand crée objet et pas Futur, fetch au 20 secondes pour updates
    useEffect(() => {
        if (isFuture) return;

        let timeout;

        const fetchInfo = async () => {
            const data = await getGameInfo(gameId);
            setGameInfo(data);

            if (isLive) {
                timeout = setTimeout(fetchInfo, 20000);
            }
        };

        if (!document.hidden) fetchInfo();

        const onVisibilityChange = () => {
            if (!document.hidden) {
                clearTimeout(timeout);
                fetchInfo();
            } else {
                clearTimeout(timeout);
            }
        };

        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => {
            clearTimeout(timeout);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, [gameId, isLive, isFuture]);

    // Retourne shot dépendament coté
    function getSog(side) {
        if (!gameInfo) return "-";
        return gameInfo[`${side}Team`]?.sog ?? "-";
    }

    // Donne Status de la game
    function getGameStatus() {
        if (isFuture) {
            return new Date(game.startTimeUTC).toLocaleTimeString(locale, {
                timeZone: "America/New_York",
                hour: "numeric",
                minute: "2-digit",
            });
        }

        if (isLive) {
            const suffixes = ["", "ST", "ND", "RD"];
            const suffix = suffixes[game.period] ?? "TH";
            if (game.clock.inIntermission)
                return (
                    <>
                        {game.period}
                        {suffix} INT
                    </>
                );
            return (
                <>
                    {game.period}
                    {suffix}
                </>
            );
        }

        if (game.gameState === "OFF" || game.gameState === "FINAL") {
            return (
                "FINAL" +
                (game.periodDescriptor.periodType !== "REG"
                    ? `/${game.periodDescriptor.periodType}`
                    : "")
            );
        }

        return "";
    }

    // Change couleur période selon gameState
    function getGameStatusClass() {
        if (game.gameState === "LIVE" && !game.clock?.inIntermission) return "game-status-live";
        if (game.gameState === "CRIT") return "game-status-crit";
        return "game-status";
    }

    return (
        <div className="box game-card">
            {/* Date */}
            <div className="game-date">
                {new Date(game.startTimeUTC).toLocaleDateString(locale, {
                    month: "long",
                    day: "numeric",
                })}
            </div>

            {/* Status de la game */}
            <div className="game-info">
                <div className="game-status-wrapper">
                    <div className={getGameStatusClass()}>{getGameStatus()}</div>
                    {isLive && (
                        <span className="time">
                            <span className="live-indicator"></span>
                            {game.clock.timeRemaining}
                            {!game.clock.running && game.clock.inIntermission ? (
                                <img src="/Icons/zamboni.png" className="icon-img" />
                            ) : !game.clock.running ? (
                                <Icon path={mdiWhistle} size={0.7} />
                            ) : (
                                ""
                            )}
                        </span>
                    )}
                </div>

                {/* Teams + Shots + Score  ou Record */}
                {["home", "away"].map((side) => {
                    const team = game[`${side}Team`];
                    return (
                        <React.Fragment key={side}>
                            <p className="team-row">
                                <img src={team.logo} alt={team.commonName.default} width={50} />
                                <span className="team-info">
                                    <span className="team-abbrev">{team.abbrev}</span>
                                    <span className="shots">
                                        {!isFuture ? `${t("shots")} : ${getSog(side)}` : ""}
                                    </span>
                                </span>
                                <span className={isFuture ? "record" : "score"}>
                                    {isFuture ? team.record : team.score}
                                </span>
                            </p>
                        </React.Fragment>
                    );
                })}

                {/* Postes de TV */}
                <p className="tv-broadcast">
                    {isFuture &&
                        game.tvBroadcasts
                            .filter((tv) => !location || tv.countryCode === location.country)
                            .map((tv) => tv.network)
                            .join(", ")}
                </p>
            </div>
        </div>
    );
}

export default GameCard;
