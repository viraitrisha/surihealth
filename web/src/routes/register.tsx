// src/routes/register.tsx
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useCallback } from 'react';
import { registerUserOnServer } from '../server-functions/auth';
import { useToast } from '#/hooks/use-toast';
import {
  CircleCheckBig,
  CircleAlert,
  Loader2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

export const Route = (createFileRoute as any)('/register')({
  component: RegisterPage,
});

// ---------- helpers (consistent met login) ----------
const getPasswordStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (pw.length < 8) return { label: 'Te kort', color: 'bg-red-500', width: 'w-0' };
  if (score <= 1) return { label: 'Zwak', color: 'bg-red-500', width: 'w-1/3' };
  if (score === 2 || score === 3) return { label: 'Gemiddeld', color: 'bg-yellow-500', width: 'w-2/3' };
  return { label: 'Sterk', color: 'bg-green-500', width: 'w-full' };
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // lokale veldvalidatiefouten
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const passwordStrength = getPasswordStrength(formData.password);

  // redirect na countdown
  useEffect(() => {
    if (!success) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate({ to: '/profile-setup' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [success, navigate]);

  // veld-validatie handlers
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, name: value }));
    const trimmed = value.trim();
    if (trimmed.length > 0 && trimmed.length < 2) {
      setNameError('Naam moet minimaal 2 karakters bevatten');
    } else {
      setNameError('');
    }
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value }));
    const trimmed = value.trim();
    if (trimmed.length > 0 && !isValidEmail(trimmed)) {
      setEmailError('Ongeldig e‑mailadres (bv. naam@domein.com)');
    } else {
      setEmailError('');
    }
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));
    if (value.length > 0 && value.length < 8) {
      setPasswordError('Minstens 8 karakters vereist');
    } else {
      setPasswordError('');
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nameTrimmed = formData.name.trim();
    const emailTrimmed = formData.email.trim().toLowerCase();
    const pw = formData.password;

    if (!nameTrimmed || !emailTrimmed || !pw) {
      setError('Vul alstublieft alle verplichte velden in.');
      return;
    }

    // als lokale validatiefouten actief zijn, niet versturen
    if (nameError || emailError || passwordError) {
      setError('Corrigeer de gemarkeerde velden.');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUserOnServer({
        data: {
          email: emailTrimmed,
          password: pw,
          name: nameTrimmed,
        },
      });

      if (result.success) {
        setLoading(false);
        setSuccess(true);
        toast({
          title: 'Account aangemaakt!',
          description: 'Uw SuriHealth profiel is succesvol geregistreerd.',
          type: 'success',
        });
      }
    } catch (authError: any) {
      setError(authError.message || 'Er is een fout opgetreden tijdens de registratie.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-0 md:p-6 select-none transition-colors duration-300">
      <div className="w-full max-w-5xl h-screen md:h-[650px] bg-[var(--card-bg)] rounded-none md:rounded-3xl border border-transparent md:border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        {/* ---- LEFT PANEL (identiek aan login) ---- */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#1A756A] via-[#13574e] to-[var(--accent-color)] p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full" xmlns="http://w3.org" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 Q30,50 100,0 M0,30 Q50,70 100,30 M0,60 Q70,90 100,60" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <path d="M10,100 Q40,40 90,100" stroke="currentColor" strokeWidth="0.3" fill="none" />
              <circle cx="30" cy="20" r="15" stroke="currentColor" strokeWidth="0.2" fill="none" />
              <circle cx="70" cy="60" r="25" stroke="currentColor" strokeWidth="0.2" fill="none" />
            </svg>
          </div>

          <div className="space-y-3 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black uppercase tracking-wider">SuriHealth</span>
            </div>
          </div>

          <div className="space-y-4 z-10 max-w-sm">
            <h1 className="text-4xl font-black tracking-tight leading-tight">
              Word lid van onze community.
            </h1>
            <p className="text-white/80 text-sm leading-relaxed font-medium">
              Ontdek recepten en adviezen die passen bij uw Surinaamse eetgewoonten.
            </p>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 z-10">
            Paramaribo, Suriname
          </div>
        </div>

        {/* ---- RIGHT PANEL: FORMULIER ---- */}
        <div className="flex-1 p-8 sm:p-16 flex flex-col justify-center bg-[var(--card-bg)] text-[var(--text-color)] transition-colors duration-300 overflow-y-auto">
          <div className="w-full max-w-sm mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight">Registreren</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                Maak een account aan voor uw Surinaamse maaltijdplanner
              </p>
            </div>

            {/* Success Melding (vervangt formulier) */}
            {success ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3 animate-in fade-in duration-200">
                <CircleCheckBig className="h-10 w-10 text-green-600 mx-auto animate-bounce" />
                <p className="font-bold text-lg text-green-800">Account succesvol aangemaakt!</p>
                <p className="text-xs text-green-600">
                  Je wordt doorgestuurd naar de vragenlijst in{' '}
                  <strong className="text-sm font-black">{countdown}</strong> seconden...
                </p>
                <div className="w-full bg-green-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-green-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                {/* Algemene foutmelding */}
                {error && (
                  <div className="p-4 bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--danger-text)] text-xs font-bold rounded-2xl flex items-start gap-2.5 animate-in fade-in duration-200">
                    <CircleAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <p className="leading-normal">{error}</p>
                  </div>
                )}

                {/* Formulier */}
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Naam veld */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                      Volledige Naam
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={handleNameChange}
                        disabled={loading}
                        className={`w-full pl-10 pr-4 py-3 bg-[var(--muted-bg)] border rounded-xl text-sm text-[var(--text-color)] focus:outline-none focus:ring-2 transition-all ${
                          nameError
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-[var(--border-color)] focus:ring-[#1A756A]'
                        }`}
                      />
                    </div>
                    {nameError && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">{nameError}</p>
                    )}
                  </div>

                  {/* E-mail veld */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                      E-mailadres
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="naam@voorbeeld.com"
                        value={formData.email}
                        onChange={handleEmailChange}
                        disabled={loading}
                        className={`w-full pl-10 pr-4 py-3 bg-[var(--muted-bg)] border rounded-xl text-sm text-[var(--text-color)] focus:outline-none focus:ring-2 transition-all ${
                          emailError
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-[var(--border-color)] focus:ring-[#1A756A]'
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">{emailError}</p>
                    )}
                  </div>

                  {/* Wachtwoord veld */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                      Wachtwoord
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Minimaal 8 tekens"
                        value={formData.password}
                        onChange={handlePasswordChange}
                        disabled={loading}
                        className={`w-full pl-10 pr-10 py-3 bg-[var(--muted-bg)] border rounded-xl text-sm text-[var(--text-color)] focus:outline-none focus:ring-2 transition-all ${
                          passwordError
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-[var(--border-color)] focus:ring-[#1A756A]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer disabled:opacity-50"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Sterktebalk + foutmelding */}
                    <div className="mt-2 space-y-1">
                      {formData.password.length > 0 && formData.password.length >= 8 && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                            />
                          </div>
                          <span className={`text-[11px] font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                      )}
                      {passwordError && (
                        <p className="text-[11px] text-red-500 font-medium">{passwordError}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-3.5 bg-[#1A756A] hover:bg-[#13574e] text-white font-bold rounded-xl shadow-md transition-all text-sm mt-4 cursor-pointer focus:outline-none disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Account aanmaken...
                      </>
                    ) : (
                      'Account aanmaken'
                    )}
                  </button>
                </form>

                {/* Link naar inloggen */}
                <div className="text-center pt-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
                  Heeft u al een account?{' '}
                  <Link to="/login" className="text-[#1A756A] font-bold hover:underline no-underline">
                    Inloggen
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}