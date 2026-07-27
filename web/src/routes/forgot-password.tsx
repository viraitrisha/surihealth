import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useToast } from '#/hooks/use-toast';
import { Mail, Loader2, CircleCheck, CircleAlert, ArrowLeft } from 'lucide-react';

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
        headers: { 
          'Content-Type': 'application/json' 
        },
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
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 items-center justify-center pt-24 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Titel-blok */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#1A756A] tracking-tight">Wachtwoord vergeten</h1>
          <p className="text-gray-500 text-sm mt-1">Vul uw e-mailadres in om een herstellink te ontvangen</p>
        </div>

        {/* Succes Indicator */}
        {success ? (
          <div className="rounded-xl bg-green-50 p-5 text-center border border-green-200 text-sm text-green-800 space-y-2 animate-in fade-in duration-200">
            <CircleCheck className="h-10 w-10 text-green-600 mx-auto" />
            <p className="font-bold text-base">Controleer uw e-mailadres</p>
            <p className="text-gray-600">
              We hebben een herstellink naar <strong className="text-slate-800">{email}</strong> gestuurd om uw wachtwoord veilig te resetten.
            </p>
            <Link to="/login" className="inline-block mt-4 text-[#1A756A] font-bold hover:underline no-underline">
              Terug naar inloggen
            </Link>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            
            {/* Foutmelding indicator */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-200 text-xs shadow-sm animate-in fade-in duration-200">
                <CircleAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Invoerveld */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                E-mailadres
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  disabled={loading}
                  placeholder="naam@voorbeeld.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A756A] text-gray-900 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Verzendknop */}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full flex items-center justify-center py-3 px-4 bg-[#1A756A] hover:bg-[#13574e] text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-sm cursor-pointer focus:outline-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Herstellink aanvragen...
                </>
              ) : (
                'Herstellink aanvragen'
              )}
            </button>

            {/* Terugknop naar login */}
            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-slate-700 no-underline transition-colors">
                <ArrowLeft className="h-3 w-3" /> Terug naar inloggen
              </Link>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
