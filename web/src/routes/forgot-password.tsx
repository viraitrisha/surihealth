import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useToast } from '#/hooks/use-toast';
import { Mail, Loader2, CircleCheck, CircleAlert } from 'lucide-react';

export const Route = (createFileRoute as any)('/forgot-password')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Vul alstublieft een geldig e-mailadres in.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          redirectTo: `${window.location.origin}/reset-password`,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setError(result?.message || 'Er is iets misgegaan. Controleer uw e-mailadres.');
        setLoading(false);
        return;
      }

      setLoading(false);
      setSuccess(true);
      toast({
        title: 'E-mail verzonden!',
        description: 'Controleer uw inbox voor de herstellink.',
        type: 'success',
      });
    } catch (err: any) {
      setError('Verbindingsfout met de server. Probeer het opnieuw.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-(--bg-color) flex items-center justify-center p-0 md:p-6 select-none transition-colors duration-300">
      <div className="w-full max-w-5xl h-screen md:h-162.5 bg-(--card-bg) rounded-none md:rounded-3xl border border-transparent md:border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        
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
        <div className="flex-1 p-8 sm:p-16 flex flex-col justify-center bg-(--card-bg) text-(--text-color) transition-colors duration-300">
          <div className="w-full max-w-sm mx-auto space-y-6">
            
            {/* Header Text */}
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight">Wachtwoord vergeten</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                Vul uw e-mailadres in om een herstellink te ontvangen
              </p>
            </div>

            {/* Succesbericht (getoond na succesvolle aanvraag) */}
            {success ? (
              <div className="p-5 bg-[var(--success-bg, #f0fdf4)] border border-[var(--success-border, #bbf7d0)] text-[var(--success-text, #166534)] rounded-2xl flex flex-col items-center gap-3 animate-in fade-in duration-200">
                <CircleCheck className="h-10 w-10 text-green-600" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold">Controleer uw e-mailadres</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    We hebben een herstellink naar <strong className="text-slate-800 dark:text-slate-200">{email}</strong> gestuurd.
                  </p>
                </div>
                <Link to="/login" className="mt-2 text-xs font-bold text-[#1A756A] hover:underline no-underline">
                  Terug naar inloggen
                </Link>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {/* Foutmelding */}
                {error && (
                  <div className="p-4 bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--danger-text)] text-xs font-bold rounded-2xl flex items-start gap-2.5 animate-in fade-in duration-200">
                    <CircleAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <p className="leading-normal">{error}</p>
                  </div>
                )}

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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 bg-[var(--muted-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[#1A756A] transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Verzendknop */}
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center py-3.5 bg-[#1A756A] hover:bg-[#13574e] text-white font-bold rounded-xl shadow-md transition-all text-sm mt-4 cursor-pointer focus:outline-none disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Herstellink aanvragen...
                    </>
                  ) : (
                    'Herstellink aanvragen'
                  )}
                </button>

                {/* Terug naar inloggen link */}
                <div className="text-center pt-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
                  <Link to="/login" className="text-[#1A756A] font-bold hover:underline no-underline">
                    Terug naar inloggen
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}