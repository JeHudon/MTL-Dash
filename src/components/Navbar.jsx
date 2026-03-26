import { useLocale } from "../context/LocaleContext.jsx";
import { useTranslation } from "../i18n.js";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const { locale, setLocale } = useLocale();
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
            {/* Logo et nom de l'équipe */}
            <div className="navbar-brand">
                <div className="navbar-item">
                    <img src="/Images/logo.png" alt="Logo" />
                </div>
                <div className="navbar-item">
                    <img src="/Images/text.png" alt="Logo" />
                </div>
            </div>

            <div className="navbar-menu">
                <div className="navbar-start">
                    {/* Liens de navigation */}
                    <div className="navbar-item">
                        <Link className="nav-text" to={`${prefix}/`}>
                            {t("home")}
                        </Link>
                    </div>

                    <div className="navbar-item">
                        <Link className="nav-text" to={`${prefix}/roster/20252026`}>
                            {t("team")}
                        </Link>
                    </div>

                    <div className="navbar-item">
                        <Link className="nav-text" to={`${prefix}/stats/20252026/2`}>
                            {t("stats")}
                        </Link>
                    </div>

                    <div className="navbar-item">
                        <a className="nav-text">{t("schedule")}</a>
                    </div>

                    <div className="navbar-item">
                        <Link className="nav-text" to={`${prefix}/standings/${new Date().toLocaleDateString("fr-CA")}/wildcard`}>
                            {t("standings")}
                        </Link>
                    </div>

                    {/* Menu déroulant (désactivé pour l'instant)
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link"> More </a>
                        <div className="navbar-dropdown">
                            <a className="navbar-item"> About </a>
                            <a className="navbar-item is-selected"> Jobs </a>
                            <a className="navbar-item"> Contact </a>
                            <hr className="navbar-divider" />
                            <a className="navbar-item"> Report an issue </a>
                        </div>
                    </div> */}
                </div>

                {/* Boutons de langue */}
                <div className="navbar-end">
                    <div className="navbar-item" style={{ paddingRight: "70px" }}>
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
