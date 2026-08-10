// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  
  integrations: [
    starlight({
      title: 'SuriHealth',
      favicon: '/surihealth-logo.png',
      
      customCss: [
        './src/styles/custom.css',
      ],

      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },

      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/viraitrisha/surihealth' }
      ],

      // 🛡️ REFINEMENT: Toggle script injection entirely removed to revert right-sidebar to default state
      sidebar: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: '1. Toegang',
          items: [
            { label: 'Introductie & Doelstelling', link: '/guides/introductie/' },
            { label: 'Systeemvereisten', link: '/guides/systeemvereisten/' },
            { label: 'Toegang tot de Applicatie', link: '/guides/toegang/' },
            { label: 'Account Registreren', link: '/guides/registreren/' },
            { label: 'Inloggen & Beveiliging', link: '/guides/inloggen/' },
            { label: 'Eerste Keer Opstarten', link: '/guides/aan-de-slag/' },
          ],
        },
        {
          label: '2. Intake & Dashboard',
          items: [
            { label: 'Medische Vragenlijst', link: '/guides/vragenlijst/' },
            { label: 'Het Gezondheidsdashboard', link: '/guides/dashboard/' },
            { label: 'Navigatie & Interface', link: '/guides/navigatie-balk/' },
          ],
        },
        {
          label: '3. Recepten',
          items: [
            { label: 'Receptenoverzicht', link: '/guides/recepten/' },
            { label: 'Maaltijd Categorieën', link: '/guides/categories/' },
            { label: 'Recept Details & Instructies', link: '/guides/recept-detail/' },
            { label: 'Favorieten Pagina', link: '/guides/favorieten/' },
            { label: 'Boodschappenlijst', link: '/guides/boodschappenlijst/' },
          ],
        },
        {
          label: '4. Instellingen & Contact',
          items: [
            { label: 'Gezondheidsprofiel Wijzigen', link: '/guides/profiel/' },
            { label: 'Systeeminstellingen', link: '/guides/instellingen/' },
            { label: 'Contact Opnemen & FAQ', link: '/guides/contact/' },
          ],
        },
        {
          label: '5. Platform Beheer',
          items: [
            { label: 'Beheerders Dashboard', link: '/admin/dashboard/' },
            { label: 'Support Tickets & Inbox', link: '/admin/messages/' },
            { label: 'Recepten Database CRUD', link: '/admin/recipes/' },
            { label: 'Gebruikersaccounts Beheren', link: '/admin/users/' },
          ],
        },
        {
          label: '6. Onderhoud & Referenties',
          items: [
            { label: 'Problemen & Oplossingen', link: '/guides/probleem-oplossing/' },
            { label: 'Verklarende Woordenlijst', link: '/guides/glossary/' },
            { label: 'Documentatie Informatie', link: '/guides/document-info/' },
            { label: 'Sessie Veilig Afsluiten', link: '/guides/afsluiten/' },
          ],
        },
      ],
    }),
  ],
});