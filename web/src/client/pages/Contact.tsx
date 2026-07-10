import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Naam is verplicht'),
  email: z.string().email('Ongeldig email adres'),
  subject: z.string().min(5, 'Onderwerp is verplicht'),
  message: z.string().min(10, 'Bericht moet minimaal 10 tekens zijn'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log('Contact form data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Contact</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Informatie */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Neem contact met ons op</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-medium">Adres</p>
                  <p className="text-gray-600">Paramaribo, Suriname</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">info@surihealth.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-medium">Telefoon</p>
                  <p className="text-gray-600">+597 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-suri-cream">
            <h3 className="font-semibold mb-2">Openingstijden</h3>
            <p className="text-gray-600">Maandag - Vrijdag: 08:00 - 20:00</p>
            <p className="text-gray-600">Zaterdag: 09:00 - 17:00</p>
            <p className="text-gray-600">Zondag: Gesloten</p>
          </div>
        </div>

        {/* Contact Formulier */}
        <div className="card">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Bericht verzonden!</h3>
              <p className="text-gray-600">We nemen zo snel mogelijk contact met je op.</p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-suri-green hover:underline"
              >
                Nieuw bericht
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
                <input
                  type="text"
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Onderwerp</label>
                <input
                  type="text"
                  className={`input-field ${errors.subject ? 'border-red-500' : ''}`}
                  {...register('subject')}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bericht</label>
                <textarea
                  rows={4}
                  className={`input-field ${errors.message ? 'border-red-500' : ''}`}
                  {...register('message')}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isSubmitting ? 'Verzenden...' : 'Verstuur bericht'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;