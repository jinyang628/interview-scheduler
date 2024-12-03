import "@/styles/globals.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main(ctx) {
    console.log("Hello content script!");
  },
});
