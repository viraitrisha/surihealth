import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import crypto from 'crypto';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Naam moet minimaal 2 tekens bevatten." }),
  email: z.string().email({ message: "Ongeldig e-mailadres." }),
  message: z.string().min(1, { message: "Bericht mag niet leeg zijn." }),
});

export const submitContactForm = createServerFn({ method: 'POST' })
  .validator(contactFormSchema)
  .handler(async ({ data }) => {
    try {
      const { db } = await import('../db');
      const { contacts } = await import('../db/schema');

      await db.insert(contacts).values({
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        message: data.message,
        createdAt: new Date(),
      });

      return { 
        success: true, 
        message: "Uw bericht is succesvol ontvangen door ons team." 
      };
    } catch (error: any) {
      console.error('CRUCIALE CONTACT FORM BACKEND FOUT:', error);
      throw new Error(error.message || 'Kon contactgegevens niet verwerken op de server.');
    }
  });
