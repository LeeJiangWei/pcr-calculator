chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
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
  chrome.storage.local.set({
    options: {
      algorithm: "lp",
      metric: "farmTime",
      multiplier: 1,
      displayInt: false,
      timeOut: 1000,
    },
  });
});
