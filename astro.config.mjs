import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx({
      remarkPlugins: [],
      rehypePlugins: [],
    })
  ],
  output: 'static',
  build: {
    format: 'directory'
  },
  vite: {
    server: {
      host: true
    },
    preview: {
      host: true,
      port: 4321
    }
  }
});
