import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { submitContactForm } from '../server-functions/contact';
import { useToast } from '#/hooks/use-toast';
import { Mail, User, MessageSquare, Loader2, Send, CheckCircle2, MapPin, Clock } from 'lucide-react';

export const Route = (createFileRoute as any)('/contact')({
  component: ContactPage,
});

function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const currentYear = new Date().getFullYear();

  const isNameTouched = formData.name.length > 0;
  const isNameValid = formData.name.trim().length >= 2;

  const isEmailTouched = formData.email.length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isNameValid) {
      toast({
        title: 'Naam te kort',
        description: 'Vul alstublieft een geldige naam in van minimaal 2 letters.',
        type: 'warning',
      });
      return;
    }

    if (!isEmailValid) {
      toast({
        title: 'Ongeldig e-mailadres',
        description: 'Controleer of uw e-mailadres een @ en een geldig domein bevat.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await submitContactForm({
        data: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        },
      });

      if (response.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        
        toast({
          title: 'Bericht verzonden',
          description: 'We nemen zo snel mogelijk contact met u op.',
          type: 'success',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Verzenden mislukt',
        description: err.message || 'Controleer uw invoer en probeer het opnieuw.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-32 pb-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
        
        {/* ---- LINKER KANT: Info Banner - ZONDER TELEFOON ---- */}
        <div className="lg:w-2/5 bg-gradient-to-br from-[#1A756A] to-[#2D9C8F] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decoratieve elementen */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-16 -mb-16"></div>
          
          <div className="relative space-y-6">
            <div>
              <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                Neem contact op
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Laten we <br />samenwerken</h1>
            </div>
            
            <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-sm">
              Heeft u vragen over gezonde Surinaamse voeding, medische dieetkoppelingen of suggesties voor nieuwe lokale recepten? Wij staan voor u klaar.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <MapPin className="h-5 w-5 text-white/80 flex-shrink-0" />
                <span>Paramaribo, Suriname</span>
              </div>
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <Clock className="h-5 w-5 text-white/80 flex-shrink-0" />
                <span>Ma - Vrij: 09:00 - 17:00</span>
              </div>
            </div>
          </div>

          {/* Copyright met dynamisch jaartal */}
          <div className="relative pt-8 border-t border-white/20 text-xs opacity-75 flex items-center gap-1.5">
            <span className="font-bold">© {currentYear} SuriHealth</span>
            <span className="w-1 h-1 rounded-full bg-white/50"></span>
            <span>Alle rechten voorbehouden</span>
          </div>
        </div>

        {/* ---- RECHTER KANT: Formulier - ZONDER TELEFOON & ONDERWERP ---- */}
        <div className="lg:w-3/5 p-8 md:p-12">
          {success ? (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-4 py-8 animate-in fade-in duration-300">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Bedankt voor uw bericht!</h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Uw gegevens zijn veilig ontvangen. We verwerken uw aanvraag zo snel mogelijk en nemen binnen 24 uur contact met u op.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1A756A] hover:text-[#13574e] pt-4 focus:outline-none cursor-pointer bg-transparent border-none transition-colors"
              >
                <Send className="h-4 w-4" />
                Nog een bericht sturen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Stuur ons een bericht</h2>
                <p className="text-gray-500 text-sm">Vul het formulier in en wij nemen zo snel mogelijk contact met u op.</p>
              </div>
              
              {/* Veld 1: Naam */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Volledige Naam
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Bijv. Ramesh Kanhai"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                    className={`w-full pl-9 pr-3 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none transition-all disabled:opacity-50 text-gray-900 ${
                      !isNameTouched 
                        ? 'border-gray-200 focus:ring-2 focus:ring-[#1A756A] focus:border-transparent' 
                        : isNameValid 
                          ? 'border-emerald-500 bg-emerald-50/30 focus:ring-2 focus:ring-emerald-500 focus:border-transparent' 
                          : 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400 focus:border-transparent'
                    }`}
                  />
                </div>
                {isNameTouched && !isNameValid && (
                  <p className="text-[10px] text-red-500 font-medium mt-1">
                    Naam moet minimaal 2 letters bevatten.
                  </p>
                )}
              </div>

              {/* Veld 2: E-mailadres */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  E-mailadres
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="naam@voorbeeld.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                    className={`w-full pl-9 pr-3 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none transition-all disabled:opacity-50 text-gray-900 ${
                      !isEmailTouched 
                        ? 'border-gray-200 focus:ring-2 focus:ring-[#1A756A] focus:border-transparent' 
                        : isEmailValid 
                          ? 'border-emerald-500 bg-emerald-50/30 focus:ring-2 focus:ring-emerald-500 focus:border-transparent' 
                          : 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400 focus:border-transparent'
                    }`}
                  />
                </div>
                {isEmailTouched && !isEmailValid && (
                  <p className="text-[10px] text-red-500 font-medium mt-1">
                    Vul een geldig e-mailadres in (bijv. naam@domein.com).
                  </p>
                )}
              </div>

              {/* Veld 3: Bericht */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Uw Bericht
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    required
                    rows={4}
                    placeholder="Schrijf hier uw vraag of opmerking..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A756A] focus:border-transparent text-gray-900 transition-all resize-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Knop */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-4 bg-[#1A756A] hover:bg-[#13574e] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm mt-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1A756A] focus:ring-offset-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Bericht wordt verzonden...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Bericht verzenden
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-2">
                * Verplichte velden. Uw gegevens worden vertrouwelijk behandeld.
              </p>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}