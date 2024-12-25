import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    default_locale: 'en',
    description: 'Schedule Google Calendar meetings automatically',
    name: 'Calendar Scheduler',
    version: '0.0.1',
    permissions: ['tabs', 'background', 'storage'],
    background: {
      service_worker: 'background.js',
      persistent: true,
    },
    content_scripts: [
      {
        matches: ['*://mail.google.*/*'],
        js: ['/content-scripts/content.js'],
      },
    ],
    web_accessible_resources: [
      {
        resources: ['icon/*.png', 'images/*.svg', 'images/*.png'],
        matches: ['*://*/*'],
      },
    ],
  },
  modules: ['@wxt-dev/module-react', '@wxt-dev/i18n/module'],
  srcDir: 'src',
  outDir: 'dist',
});
