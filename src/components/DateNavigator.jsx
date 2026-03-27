import React, { useState, useRef, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fr", fr);

function DateNavigator({ date, currentSeason, onDateChange, locale }) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const wrapperRef = useRef(null);

    const today = new Date().toLocaleDateString("fr-CA");
    const seasonStart = currentSeason?.standingsStart;
    const seasonEnd = currentSeason?.standingsEnd;
    const latestAvailable = seasonEnd < today ? seasonEnd : today;

    const canGoPrev = date > seasonStart;
    const canGoNext = date < latestAvailable;

    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function offsetDate(d, days) {
        const dt = new Date(d + "T12:00:00");
        dt.setDate(dt.getDate() + days);
        return dt.toLocaleDateString("fr-CA"); // always fr-CA for yyyy-mm-dd storage format
    }

    function formatDisplay(d) {
        const dt = new Date(d + "T12:00:00");
        return dt.toLocaleDateString(locale, { month: "short", day: "numeric" });
    }

    return (
        <div className="dateNavigator" ref={wrapperRef}>
            <button
                className="button"
                disabled={!canGoPrev}
                onClick={() => onDateChange(offsetDate(date, -1))}
            >
                <span className="icon">
                    <i className="fas fa-chevron-left" />
                </span>
            </button>

            <span className="date-label" onClick={() => setPickerOpen((o) => !o)}>
                {formatDisplay(date)}
            </span>

            <button
                className="button"
                disabled={!canGoNext}
                onClick={() => onDateChange(offsetDate(date, 1))}
            >
                <span className="icon">
                    <i className="fas fa-chevron-right" />
                </span>
            </button>

            {pickerOpen && (
                <div style={{
                    position: "absolute",
                    top: "calc(100% + 5px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 100,
                }}>
                    <DatePicker
                        inline
                        locale={locale === "fr" ? "fr" : undefined}
                        selected={new Date(date + "T12:00:00")}
                        minDate={seasonStart ? new Date(seasonStart + "T12:00:00") : undefined}
                        maxDate={new Date(latestAvailable + "T12:00:00")}
                        onChange={(d) => {
                            onDateChange(d.toLocaleDateString("fr-CA")); // always store as yyyy-mm-dd
                            setPickerOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default DateNavigator;