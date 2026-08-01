// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'SuriHealth Documentatie',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Home',
					link: '/',
				},
				{
					label: 'Aan de slag',
					items: [
						{ label: 'Introductie', link: '/guides/introductie/'},
						{ label: 'Systeemvereisten', link: '/guides/systeemvereisten/'},
						{ label: 'Toegang tot de applicatie', link: '/guides/toegang/'},
						{ label: 'Account aanmaken', link: '/guides/registreren/'},
						{ label: 'Inloggen', link: '/guides/inloggen/'},
					],
				},
				{
					label: 'Gebruik van de applicatie',
					items: [
						{ label: 'Vragenlijst', link: '/guides/vragenlijst/'},
						{ label: 'Dashboard', link: '/guides/dashboard/'},
						{ label: 'Navigatie balk', link: '/guides/navigatie-balk/'},
						{ label: 'Automatisch maaltijden', link: '/guides/automatisch/'},
						{ label: 'Handmatig maaltijdplan', link: '/guides/handmatig/'},
						{ label: 'Recept detail & Favorieten', link: '/guides/recept-detail/'},
						{ label: 'Boodschappenlijst', link: '/guides/boodschappenlijst/'},
						{ label: 'Favorieten pagina', link: '/guides/favorieten/'},
						{ label: 'Profiel', link: '/guides/profiel/'},
						{ label: 'Instellingen', link: '/guides/instellingen/'},
						{ label: 'Contact & FAQ', link: '/guides/contact/'},
					],
				},
				{
					label: 'Afsluiten van de applicatie',
					link: '/guides/afsluiten/',
				},
				{
					label: 'Problemen & oplossingen',
					link: '/guides/probleem-oplossing/',
				},
				{
					label: 'Glossary',
					link: '/guides/glossary/',
				},
				{
					label: 'Document Informatie',
					link: '/guides/document-info/',
				},
			],
		}),
	],
});
