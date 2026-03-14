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
        const isFR = locale === "fr-FR";
        const isGoingFR = newLocale === "fr-FR";

        let path = location.pathname;

        if (isFR && !isGoingFR) {
            // Enlever le préfixe /fr
            path = path.replace(/^\/fr/, "") || "/";
        } else if (!isFR && isGoingFR) {
            // Ajouter le préfixe /fr
            path = "/fr" + path;
        }

        navigate(path);
    }

    const prefix = locale === "fr-FR" ? "/fr" : "";

    return (
        <nav
            className="navbar"
            role="navigation"
            aria-label="main navigation"
            style={{ height: "125px", margin: "5px" }}
        >
            {/* Logo et nom de l'équipe */}
            <div className="navbar-brand" style={{ padding: "0 100px" }}>
                <div className="navbar-item">
                    <img
                        src="/Images/logo.png"
                        alt="Logo"
                        style={{ width: "auto", maxHeight: "100%" }}
                    />
                </div>
                <div className="navbar-item">
                    <img
                        src="/Images/text.png"
                        alt="Logo"
                        style={{ width: "auto", maxHeight: "100%" }}
                    />
                </div>
            </div>

            <div className="navbar-menu">
                <div className="navbar-start">
                    {/* Liens de navigation */}
                    <div className="navbar-item">
                        <Link className="nav-text" to={`${prefix}/`}>
                            {t.home}
                        </Link>
                    </div>

                    <div className="navbar-item">
                        <Link className="nav-text" to={`${prefix}/roster/20252026`}>
                            {t.team}
                        </Link>
                    </div>

                    <div className="navbar-item">
                        <Link className="nav-text" to={`${prefix}/stats/20252026/2`}>
                            {t.stats}
                        </Link>
                    </div>

                    <div className="navbar-item">
                        <a className="nav-text">{t.schedule}</a>
                    </div>

                    <div className="navbar-item">
                        <a className="nav-text">{t.standings}</a>
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
                    <div className="navbar-item">
                        <div className="buttons">
                            <button
                                className={`button ${locale === "en-US" ? "is-active" : ""}`}
                                onClick={() => switchLocale("en-US")}
                            >
                                EN
                            </button>
                            <button
                                className={`button ${locale === "fr-FR" ? "is-active" : ""}`}
                                onClick={() => switchLocale("fr-FR")}
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
