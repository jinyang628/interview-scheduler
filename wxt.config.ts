import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    default_locale: "en",
    description: "Book Google Calendar meetings automatically",
    name: "Calendar Scheduler",
    version: "0.0.1",
    permissions: [
      "tabs",
      "activeTab",
      "background",
      "webNavigation",
      "storage",
      "scripting",
      "downloads",
      "cookies",
      "notifications",
      "https://www.googleapis.com/auth/calendar",
      "identity",
    ],
    background: {
      service_worker: "background.js",
      persistent: true,
    },
    content_scripts: [
      {
        matches: ["<all_urls>"],
        js: ["/content-scripts/content.js"],
      },
    ],
    web_accessible_resources: [
      {
        resources: [
          "icon/*.png",
          "images/*.svg",
          "images/*.png",
          "injected.js",
        ],
        matches: ["*://*/*"],
      },
    ],
  },
  modules: ["@wxt-dev/module-react", "@wxt-dev/i18n/module"],
  srcDir: "src",
  outDir: "dist",
});
