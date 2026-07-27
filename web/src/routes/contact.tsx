// src/routes/contact.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { submitContactForm } from '../server-functions/contact';
import { useToast } from '#/hooks/use-toast';
import { Mail, User, MessageSquare, Loader2, Send, CheckCircle2, MapPin } from 'lucide-react';

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
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 pt-32 pb-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* ---- LINKER KANT: Info Banner ---- */}
        <div className="flex-1 bg-linear-to-br from-[#1A756A] to-[#2D9C8F] p-8 md:p-12 text-white flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Contact opnemen</h1>
            <p className="text-white/90 text-sm md:text-base leading-relaxed">
              Heeft u vragen over gezonde Surinaamse voeding, medische dieetkoppelingen of suggesties voor nieuwe lokale recepten? 
            </p>
          </div>

          <div className="pt-8 border-t border-white/20 text-xs opacity-75 flex items-center gap-1.5 font-bold">
            <MapPin className="h-4 w-4 text-white" />
            <span>Paramaribo, Suriname</span>
          </div>
        </div>

        {/* ---- RECHTER KANT: Formulier met live underlines ---- */}
        <div className="flex-1 p-8 md:p-12">
          {success ? (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-4 py-8 animate-in fade-in duration-300">
              <CheckCircle2 className="h-16 w-16 text-emerald-600 stroke-[1.5]" />
              <h2 className="text-2xl font-bold text-slate-800">Bedankt voor uw bericht!</h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Uw gegevens zijn veilig opgeslagen. We verwerken uw aanvraag zo snel mogelijk.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-sm font-bold text-[#1A756A] hover:underline pt-2 focus:outline-none cursor-pointer bg-transparent border-none"
              >
                Nog een bericht sturen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Veld 1: Naam met interactieve onderrand */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Volledige Naam
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Bijv. Ramesh Kanhai"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none transition-all disabled:opacity-50 text-gray-900 ${
                      !isNameTouched 
                        ? 'border-gray-300 focus:ring-2 focus:ring-[#1A756A]' 
                        : isNameValid 
                          ? 'border-emerald-500 bg-emerald-50/10 focus:ring-2 focus:ring-emerald-500' 
                          : 'border-red-400 bg-red-50/10 focus:ring-2 focus:ring-red-400'
                    }`}
                  />
                </div>
                {isNameTouched && !isNameValid && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 pl-1">
                    Naam moet minimaal 2 letters bevatten.
                  </p>
                )}
              </div>

              {/* Veld 2: E-mailadres met interactieve onderrand */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  E-mailadres
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="naam@voorbeeld.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none transition-all disabled:opacity-50 text-gray-900 ${
                      !isEmailTouched 
                        ? 'border-gray-300 focus:ring-2 focus:ring-[#1A756A]' 
                        : isEmailValid 
                          ? 'border-emerald-500 bg-emerald-50/10 focus:ring-2 focus:ring-emerald-500' 
                          : 'border-red-400 bg-red-50/10 focus:ring-2 focus:ring-red-400'
                    }`}
                  />
                </div>
                {isEmailTouched && !isEmailValid && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 pl-1">
                    Vul alstublieft een geldig e-mailadres in (bijv. naam@domein.com).
                  </p>
                )}
              </div>

              {/* Veld 3: Bericht */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Uw Bericht
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    required
                    rows={4}
                    placeholder="Schrijf hier uw vraag..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A756A] text-gray-900 transition-all resize-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Knop */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 bg-[#1A756A] hover:bg-[#13574e] text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 text-sm mt-6 cursor-pointer focus:outline-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Bericht verzenden...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Bericht verzenden
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}
