// src/routes/login.tsx
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import { authClient } from '../auth/auth-client';
import { useToast } from '#/hooks/use-toast';
import { Mail, Lock, Loader2, CircleAlert, Eye, EyeOff } from 'lucide-react';
import { seedAdminAccountOnDemand, checkUserBlockStatus } from '../server-functions/auth';

export const Route = (createFileRoute as any)('/login')({
  component: LoginPage,
});

// ---------- helper voor wachtwoordsterkte ----------
const getPasswordStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (pw.length < 8) return { label: 'Te kort', color: 'bg-red-500', width: 'w-0' }; // geen balk
  if (score <= 1) return { label: 'Zwak', color: 'bg-red-500', width: 'w-1/3' };
  if (score === 2 || score === 3) return { label: 'Gemiddeld', color: 'bg-yellow-500', width: 'w-2/3' };
  return { label: 'Sterk', color: 'bg-green-500', width: 'w-full' };
};

// ---------- helper voor e-mailvalidatie ----------
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ---------- lokale veldvalidatiefouten ----------
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // wachtwoordsterkte afgeleid van huidige waarde
  const passwordStrength = getPasswordStrength(formData.password);

  // e‑mail validatie bij elke wijziging
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));
    const trimmed = value.trim();
    if (trimmed.length > 0 && !isValidEmail(trimmed)) {
      setEmailError('Ongeldig e‑mailadres (bv. naam@domein.com)');
    } else {
      setEmailError('');
    }
  }, []);

  // wachtwoord validatie bij elke wijziging
  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, password: value }));
    if (value.length > 0 && value.length < 8) {
      setPasswordError('Minstens 8 karakters vereist');
    } else {
      setPasswordError('');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailTrimmed = formData.email.trim().toLowerCase();

    // controleer nogmaals of de velden (na trim) geldig zijn
    if (!emailTrimmed || !formData.password) {
      setError('Vul alstublieft alle verplichte velden in.');
      return;
    }

    // als lokale validatiefouten actief zijn, niet versturen
    if (emailError || passwordError) {
      setError('Corrigeer de gemarkeerde velden.');
      return;
    }

    setLoading(true);

    try {
      const blockCheck = await checkUserBlockStatus({ data: { email: emailTrimmed } });
      if (blockCheck.isBlocked) {
        setError('Toegang geweigerd. Dit account is permanent geblokkeerd door de beheerder.');
        setLoading(false);
        await authClient.signOut();
        return;
      }
    } catch (f) {
      // als de check faalt, gaan we toch door
    }

    if (emailTrimmed === 'surihealth@gmail.com') {
      try {
        await seedAdminAccountOnDemand();
      } catch (f) {}
    }

    const { error: authError } = await authClient.signIn.email({
      email: emailTrimmed,
      password: formData.password,
      rememberMe: rememberMe,
    });

    if (authError) {
      setError(authError.message || 'E-mailadres of wachtwoord is onjuist.');
      setLoading(false);
      return;
    }

    const dynamicSession = await authClient.getSession();
    const userRole = (dynamicSession?.data?.user as any)?.role;

    setLoading(false);
    toast({
      title: 'Succesvol ingelogd',
      type: 'success',
    });

    if (userRole === 'admin' || emailTrimmed === 'surihealth@gmail.com') {
      navigate({ to: '/admin/dashboard' });
    } else {
      navigate({ to: '/dashboard' });
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-0 md:p-6 select-none transition-colors duration-300">
      <div className="w-full max-w-5xl h-screen md:h-[650px] bg-[var(--card-bg)] rounded-none md:rounded-3xl border border-transparent md:border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        
        {/* ---- LEFT PANEL: IMMERSIVE BOTANICAL BRANDING CANVASES ---- */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#1A756A] via-[#13574e] to-[var(--accent-color)] p-12 text-white flex-col justify-between relative overflow-hidden">
          
          {/* Abstract Interactive Leaf/Bladeren Vector Lines Background Layer */}
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
              Gezond leven met Surinaamse smaak.
            </h1>
            <p className="text-white/80 text-sm leading-relaxed font-medium">
              Koppel traditionele Surinaamse gerechten aan verantwoorde medische voedingsadviezen.
            </p>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 z-10">
            Paramaribo, Suriname
          </div>
        </div>

        {/* ---- RIGHT PANEL: SLICK MINIMALIST INPUT INTERFACE ---- */}
        <div className="flex-1 p-8 sm:p-16 flex flex-col justify-center bg-[var(--card-bg)] text-[var(--text-color)] transition-colors duration-300">
          <div className="w-full max-w-sm mx-auto space-y-6">
            
            {/* Header Text */}
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight">Inloggen</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                Toegang tot uw recepten- en gezondheidsdashboard
              </p>
            </div>

            {/* Error Message Module */}
            {error && (
              <div className="p-4 bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--danger-text)] text-xs font-bold rounded-2xl flex items-start gap-2.5 animate-in fade-in duration-200">
                <CircleAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="leading-normal">{error}</p>
              </div>
            )}

            {/* Input Form Fields Matrix */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* E‑mail veld */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                  E-mailadresse
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
                    placeholder="••••••••"
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Wachtwoord sterktemeter + validatiefout */}
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

              {/* Keep session saved + Wachtwoord vergeten? */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="h-4 w-4 accent-[#1A756A] border-[var(--border-color)] rounded-md"
                  />
                  <span>Sessie onthouden</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-bold text-[#1A756A] hover:underline no-underline"
                >
                  Wachtwoord vergeten?
                </Link>
              </div>

              {/* Submit Core Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 bg-[#1A756A] hover:bg-[#13574e] text-white font-bold rounded-xl shadow-md transition-all text-sm mt-4 cursor-pointer focus:outline-none disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Inloggen...
                  </>
                ) : (
                  'Inloggen'
                )}
              </button>
            </form>

            {/* Redirection Navigation Link */}
            <div className="text-center pt-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
              Nog geen account?{' '}
              <Link to="/register" className="text-[#1A756A] font-bold hover:underline no-underline">
                Registreer hier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}