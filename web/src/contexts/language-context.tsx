import {
    createContext,
    useContext,
    useEffect, 
    useState,
    type ReactNode,
} from "react" ;

export type Language = "nl" | "en";

interface LanguageContextType {
    language: Language; 
    setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined> (
    undefined
);

export function LanguageProvider( {
    children,
}: {
    children: ReactNode;
}) {
    const [language, setLanguage] = useState<Language>("nl");

    useEffect(() => {
        const saved = localStorage.getItem("language");
        if(saved === "nl" || saved === "en") {
            setLanguage(saved);
        }
    }, []);
    useEffect(() => {
        localStorage.setItem("language", language);
        document.documentElement.lang = language;
    }, [language]);

    return (
        <LanguageContext.Provider
        value={{
            language,
            setLanguage,
        }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }
    return context; 
}
