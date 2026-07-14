import { useState } from "react";
import { useTheme } from "#/contexts/theme-context";

interface SettingsOverlayProps {
    isOpen:boolean;
    onClose:() => void;
    onOpenProfile: () =>void;
}

export default function SettingsOverlay({
    isOpen,
    onClose,
    onOpenProfile,
}: SettingsOverlayProps) {
    const {theme, setTheme } = useTheme();
    // const [theme, setTheme] = useState("light");
    const [language, setLanguage] = useState("nl");
    const [notifications, setNotifications] = useState(false);

    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-[3000] flex justify-end bg-[var(--black-color)]/40 backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()} className="flex h-full w-[42rem] max-w-[95%] flex-col overflow-y-auto bg-[var(--white-color)] px-10 py-12 shadow-2xl">
                <div className="mb-8 flex items-center justify-between">
                    <button onClick={onClose} className="text-5xl font-bold transition hover:scale-110">x</button>

                    <h2 className="border-b-4 border-[var(--secondary-color)] pb-2 text-4xl font-bold text-[var(--secondary-color)]">
                        Instellingen
                    </h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="mb-2 block font-bold">
                            Thema
                        </label>

                        <select value={theme} onChange={(e) => setTheme(e.target.value as "light" | "dark")} className="w-full  bg-[var(--secondary-color)] rounded-xl border-[var(--primary-color)] px-4 py-3">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block font-bold">
                            Taal
                        </label>

                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-[var(--secondary-color)] rounded-xl border-[var(--primary-color)] px-4 py-3">
                            <option value="nl">Nederlands</option>
                            <option value="en">Engels</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="font-bold">
                            Notificaties
                        </label>

                        <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)}></input>
                    </div>

                    <button type="button" onClick={onOpenProfile} className="w-full rounded-full bg-[var(--secondary-color)] py-3 font-bold">
                        Profiel bijwerken
                    </button>

                    <button type="button" className="w-full rounded-full bg-[var(--primary-color)] py-3 font-bold">
                        Account verwijderen
                    </button>

                    <button type="button"className="w-full rounded-full bg-[var(--black-color)] py-3 font-bold text-[var(--white-color)]">
                        Uitloggen
                    </button>
                </div>
            </div>
        </div>
    );
}