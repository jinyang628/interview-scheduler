export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      default:
        break;
    }
    return true;
  });
});
