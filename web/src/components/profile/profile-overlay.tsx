import { useState } from "react";

interface ProfileOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileOverlay({
    isOpen,
    onClose,
} :ProfileOverlayProps) {
    const [name] = useState("Naam");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [allergies, setAllergies] = useState("");
    const [diets, setDiets] = useState("");
    const [preferences, setPreferences] = useState("");
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log({
            gender,
            age,
            height,
            weight,
            allergies,
            diets,
            preferences,
        });
    };


return (
    <div onClick={onClose} className="fixed inset-0 z-[3000] flex justify-end bg-[var(--black-color)]/40 backdrop-sm">
        <div onClick={(e) => e.stopPropagation()} className="flex flex-col h-full w-[42rem] max-w-[95%] overflow-y-auto bg-[var(--white-color)] px-10 py-12 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
                <button onClick={onClose} className="text-5xl font-bold text-[var(--black-color)] transition hover:scale-110">x</button>
                <h2 className="border-b-4 border-[var(--secondary-color)] Fpb-2 text-4xl font-bold text-[var(--secondary-color)]">Profiel</h2>
            </div>
 
            <div className="flex-1 text-center">
                <img src="/img/HMP profile image.jpg" alt="Profiel" className="mx-auto mb-6 h-52 w-52 rounded-full border-4 border-[var(--accent-color)] object-cover"></img>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="mb-8 text-3xl font-semibold text-[var(--accent-color)]">{name}</h3>

                    <input 
                    type="text"
                    placeholder="Geslacht"
                    value={gender}
                    onChange={(e)=>setGender(e.target.value)} className="w-full rounded-1xl border-2 border-[var(--primary-color)] bg-[var(--secondary-color)] px-5 py-3 text-lg text-[var(--black-color)] focus:border-[var(--accent-color)] focus:outline-none"></input>
                    <input
                    type="number"
                    placeholder="Leeftijd"
                    value={age}
                    onChange={(e) => setAge(e.target.value)} className="w-full rounded-1xl border-2 border-[var(--primary-color)] bg-[var(--secondary-color)] px-5 py-3 text-lg text-[var(--black-color)] focus:border-[var(--accent-color)] focus:outline-none"></input>
                    <input 
                    type="number"
                    placeholder="Lengte (cm)"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)} className="w-full rounded-1xl border-2 border-[var(--primary-color)] bg-[var(--secondary-color)] px-5 py-3 text-lg text-[var(--black-color)] focus:border-[var(--accent-color)] focus:outline-none"></input>
                    <input 
                    type="number"
                    placeholder="Gewicht (kg)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)} className="w-full rounded-1xl border-2 border-[var(--primary-color)] bg-[var(--secondary-color)] px-5 py-3 text-lg text-[var(--black-color)] focus:border-[var(--accent-color)] focus:outline-none"></input>
                    <textarea
                    placeholder="Allergieën"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)} className="w-full rounded-1xl border-2 border-[var(--primary-color)] bg-[var(--secondary-color)] px-5 py-3 text-lg text-[var(--black-color)] focus:border-[var(--accent-color)] focus:outline-none"></textarea>
                    <textarea
                    placeholder="Diëten"
                    value={diets}
                    onChange={(e) => setDiets(e.target.value)} className="w-full rounded-1xl border-2 border-[var(--primary-color)] bg-[var(--secondary-color)] px-5 py-3 text-lg text-[var(--black-color)] focus:border-[var(--accent-color)] focus:outline-none"></textarea>
                    <textarea
                    placeholder="Voorkeuren"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)} className="w-full rounded-1xl border-2 border-[var(--primary-color)] bg-[var(--secondary-color)] px-5 py-3 text-lg text-[var(--black-color)] focus:border-[var(--accent-color)] focus:outline-none"></textarea>

                    <button type="submit" className="mt-8 w-full rounded-full bg-[var(--black-color)] py-4 text-xl font-bold text-[var(--white-color)] transition hover:-translate-y-1 hover:bg-[var(--secondary-color)]">Opslaan</button>
                </form>
            </div>
        </div>
    </div>
);
}