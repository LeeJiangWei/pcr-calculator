chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.addRules([
    {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: "pcredivewiki.tw" },
        }),
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()],
    },
  ]);
});

chrome.runtime.onMessage.addListener(function (message) {
  if (message === "calculate") {
    chrome.tabs.executeScript({ file: "logic.js" });
  }
});
