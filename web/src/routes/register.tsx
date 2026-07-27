import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { registerUserOnServer } from '../server-functions/auth';
import { useToast } from '#/hooks/use-toast';
import { CircleCheckBig, CircleAlert, Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export const Route = (createFileRoute as any)('/register')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Vul alstublieft alle verplichte velden in.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Uw wachtwoord moet minimaal 8 tekens bevatten.');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUserOnServer({
        data: {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          name: formData.name.trim(),
        }
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
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 justify-center items-center pt-24 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Titel-blok */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-[#1A756A] tracking-tight">Registreren</h1>
          <p className="text-gray-500 text-sm mt-1">Maak een account aan voor uw Surinaamse maaltijdplanner</p>
        </div>

        {/* Success Melding met live countdown balk */}
        {success && (
          <div className="mb-5 rounded-xl bg-green-50 p-5 text-center border border-green-200 shadow-sm animate-in fade-in duration-200">
            <div className="flex flex-col items-center gap-2">
              <CircleCheckBig className="h-10 w-10 text-green-600 animate-bounce" />
              <span className="font-bold text-lg text-green-800">Account succesvol aangemaakt!</span>
              <span className="text-xs text-green-600">
                Je wordt doorgestuurd naar de vragenlijst in <strong className="text-sm font-black">{countdown}</strong> seconden...
              </span>
              <div className="w-full bg-green-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className="bg-green-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Foutmelding indicator */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-200 text-xs shadow-sm animate-in fade-in duration-200">
            <CircleAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Registratie mislukt</span>
              {error}
            </div>
          </div>
        )}

        {/* Formulierblok (Verdwijnt automatisch bij succesvolle registratie) */}
        {!success && (
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Veld 1: Volledige Naam */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Volledige Naam
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  disabled={loading}
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A756A] text-gray-900 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Veld 2: E-mailadres */}
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

            {/* Veld 3: Wachtwoord met zichtbaarheidsschakelaar */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Wachtwoord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  placeholder="Minimaal 8 tekens"
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

            {/* Submit Knop */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 bg-[#1A756A] hover:bg-[#13574e] text-white font-bold rounded-xl shadow-md transition-all text-sm mt-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A756A] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Account aanmaken...
                </>
              ) : (
                'Account aanmaken'
              )}
            </button>
          </form>
        )}

        {/* Onderkant switch-link naar inloggen */}
        {!success && (
          <div className="mt-5 text-center text-xs text-gray-500">
            Heeft u al een account?{' '}
            <Link to="/login" className="font-bold text-[#1A756A] hover:underline">
              Inloggen
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
