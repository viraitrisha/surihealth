// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'SuriHealth Documentation',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com',
        },
      ],
      sidebar: [],
    }),
  ],
});