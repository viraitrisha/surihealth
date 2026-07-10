// client/src/pages/Login.tsx
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) {
      setMsg("Vul je gegevens in om verder te gaan.");
      return;
    }
    setMsg("Welkom terug, fijn dat je er bent!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Inloggen bij Mealplanner
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emailadres
            </label>
            <input
              type="email"
              placeholder="jouw@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wachtwoord
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Inloggen
          </button>
        </form>
        {msg && <p className="mt-4 text-center text-gray-600">{msg}</p>}
        <div className="mt-6 text-center">
          <a href="/forgot" className="text-sm text-blue-600 hover:underline">
            Wachtwoord vergeten?
          </a>
        </div>
      </div>
    </div>
  );
}
