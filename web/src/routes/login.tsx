import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { authClient } from '../auth/auth-client'; // De centrale Better Auth browser instantie
import { useToast } from '#/hooks/use-toast';
import { Mail, Lock, Loader2, CircleAlert, Eye, EyeOff } from 'lucide-react';
import { seedAdminAccountOnDemand } from '../server-functions/auth';

export const Route = (createFileRoute as any)('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  const emailTrimmed = formData.email.trim().toLowerCase();

  if (!emailTrimmed || !formData.password) {
    setError('Vul alstublieft alle verplichte velden in.');
    return;
  }

  setLoading(true);

  if (emailTrimmed === 'surihealth@gmail.com') {
    try {
      await seedAdminAccountOnDemand();
    } catch (f) {
    }
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

  setLoading(false);
  toast({
    title: 'Succesvol ingelogd!',
    description: 'Welkom terug bij SuriHealth.',
    type: 'success',
  });

  if (emailTrimmed === 'surihealth@gmail.com') {
    navigate({ to: '/admin/dashboard' });
  } else {
    navigate({ to: '/dashboard' });
  }
};


  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 justify-center items-center pt-24 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Titel-blok */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-[#1A756A] tracking-tight">Inloggen</h1>
          <p className="text-gray-500 text-sm mt-1">Toegang tot uw persoonlijke maaltijdplanner</p>
        </div>

        {/* Foutmelding indicator */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-200 text-xs shadow-sm animate-in fade-in duration-200">
            <CircleAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Inloggen mislukt</span>
              {error}
            </div>
          </div>
        )}

        {/* Formulier */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Veld 1: E-mailadres */}
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A756A] text-gray-900 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Veld 2: Wachtwoord */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Wachtwoord
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-[#1A756A] hover:underline no-underline">
                Wachtwoord vergeten?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A756A] text-gray-900 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                disabled={loading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer disabled:opacity-50"
                title={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Onthoud mijn gegevens checkbox */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer pt-1 select-none w-fit disabled:opacity-50">
            <input
              type="checkbox"
              disabled={loading}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded accent-[#1A756A] cursor-pointer"
            />
            <span className="font-semibold text-xs uppercase tracking-wider text-gray-500">Onthoud mijn gegevens</span>
          </label>

          {/* Submit Inlogknop */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 bg-[#1A756A] hover:bg-[#13574e] text-white font-bold rounded-xl shadow-md transition-all text-sm mt-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A756A] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Inloggen...
              </>
            ) : (
              'Inloggen'
            )}
          </button>
        </form>

        {/* Schakel-link naar registreren */}
        <div className="mt-5 text-center text-xs text-gray-500">
          Nieuw op ons platform?{' '}
          <Link to="/register" className="font-bold text-[#1A756A] hover:underline">
            Account maken
          </Link>
        </div>

      </div>
    </div>
  );
}