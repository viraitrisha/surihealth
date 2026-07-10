// client/src/pages/ForgotPassword.tsx
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Reset link verstuurd naar " + email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Wachtwoord vergeten</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded" />
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">Reset link sturen</button>
      </form>
      {msg && <p className="mt-4 text-green-500">{msg}</p>}
    </div>
  );
}
