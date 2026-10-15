import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // Generated captures and QA reports must not reload an active film or download.
    watch: { ignored: ['**/qa/**', '**/*.md'] },
  },
});
