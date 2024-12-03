import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    default_locale: "en",
    description: "Proactive agent that helps you browse the web faster",
    name: "Browzy",
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
      "notifications"
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
