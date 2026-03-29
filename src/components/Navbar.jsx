import { useLocale } from "../context/LocaleContext.jsx";
import { useTranslation } from "../i18n.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const { locale, setLocale } = useLocale();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const t = useTranslation(locale);
    const navigate = useNavigate();
    const location = useLocation();

    function switchLocale(newLocale) {
        setLocale(newLocale);
        const isFR = locale === "fr";
        const isGoingFR = newLocale === "fr";

        let path = location.pathname;

        // Toujours enlever /fr d'abord
        path = path.replace(/^\/fr/, "") || "/";

        // Ajouter /fr si on switch vers FR
        if (isGoingFR) {
            path = "/fr" + path;
        }

        navigate(path);
    }

    const prefix = locale === "fr" ? "/fr" : "";

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            {/* Overlay — closes menu when clicked */}
            {isMenuOpen && <div className="navbar-overlay" onClick={() => setIsMenuOpen(false)} />}
            {/* Logo et nom de l'équipe */}
            <div className="navbar-brand">
                <div className="navbar-item">
                    <img src="/Images/logo.png" alt="Logo" />
                </div>
                <div className="navbar-item">
                    <img src="/Images/text.png" alt="Logo" />
                </div>

                {/* Burger button — only visible on mobile via Bulma */}
                <button
                    className={`navbar-burger ${isMenuOpen ? "is-active" : ""}`}
                    aria-label="menu"
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                </button>
            </div>

            {/* Collapsible menu */}
            <div className={`navbar-menu ${isMenuOpen ? "is-active" : ""}`}>
                <div className="navbar-start">
                    <div className="navbar-item">
                        <Link
                            className="nav-text"
                            to={`${prefix}/`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t("home")}
                        </Link>
                    </div>
                    <div className="navbar-item">
                        <Link
                            className="nav-text"
                            to={`${prefix}/roster/20252026`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t("team")}
                        </Link>
                    </div>
                    <div className="navbar-item">
                        <Link
                            className="nav-text"
                            to={`${prefix}/stats/20252026/2`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t("stats")}
                        </Link>
                    </div>
                    <div className="navbar-item">
                        <a className="nav-text">{t("schedule")}</a>
                    </div>
                    <div className="navbar-item">
                        <Link
                            className="nav-text"
                            to={`${prefix}/standings/${new Date().toLocaleDateString("fr-CA")}/wildcard`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t("standings")}
                        </Link>
                    </div>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <button
                                className={`button ${locale === "en" ? "is-active" : ""}`}
                                onClick={() => switchLocale("en")}
                            >
                                EN
                            </button>
                            <button
                                className={`button ${locale === "fr" ? "is-active" : ""}`}
                                onClick={() => switchLocale("fr")}
                            >
                                FR
                            </button>
                        </div>
                    </div>
                </div>

                {/* Boutons sign up / login (désactivés pour l'instant)
                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            <a className="button is-primary">
                                <strong>Sign up</strong>
                            </a>
                            <a className="button is-light"> Log in </a>
                        </div>
                    </div>
                </div> */}
            </div>
        </nav>
    );
}

export default Navbar;
