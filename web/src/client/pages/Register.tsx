// client/src/pages/Register.tsx
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== confirmPw) {
      setMsg("Wachtwoorden komen niet overeen!");
      return;
    }
    setMsg("Registratie succesvol!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Registreren</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded" />
        <input type="password" placeholder="Wachtwoord" value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full px-3 py-2 border rounded" />
        <input type="password" placeholder="Bevestig wachtwoord" value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          className="w-full px-3 py-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Registreren</button>
      </form>
      {msg && <p className="mt-4 text-red-500">{msg}</p>}
    </div>
  );
}
