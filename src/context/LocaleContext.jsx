import { createContext, useContext, useState } from "react";

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
    const [locale, setLocale] = useState("en");
    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    return useContext(LocaleContext);
}