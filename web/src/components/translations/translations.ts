import type { Language } from "#/contexts/language-context";

export const translations = {
    nl: {
        dashboard: "Dashboard",
        welcome: "Welkom",
        Profile: "Profiel",
        settings: "Instellingen",
        recipes: "Recepten",
        favorites: "Favorieten",
        shopping: "Boodschappen",
        logout: "Uitloggen",
        theme: "Thema",
        language: "Taal",
        notifications: "Notificaties",
        updateProfile: "Profiel bijwerken",
        deleteAccount: "Account verwijderen",
        recipeQuestion: "Wilt u automatisch dagelijkse recepten ontvangen of handmatig instellen?",
        automatic: "Automatisch",
        manual: "Handmatig",
    },

    en: {
        dashboard: "Dashboard",
        welcome: "Welcome",
        Profile: "Profile",
        settings: "Settings",
        recipes: "Recipes",
        favorites: "Favorites",
        shopping: "Shopping",
        logout: "Logout",
        theme: "Theme",
        language: "Language",
        notifications: "Notifications",
        updateProfile: "Update profile",
        deleteAccount: "Delete Account",
        recipeQuestion: "Do you want to receive daily recipes automatically or set them manually?",
        automatic: "Automatic",
        manual: "Manual",
    },
} as const;

export function getTranslations(language: Language) {
    return translations[language];
}