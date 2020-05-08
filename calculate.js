chrome.storage.local.get("mapData", function (mapData) {
  chrome.storage.local.get("demands", function (demands) {
    calculate(mapData, demands);
  });
});

function calculate(mapData, demands) {
  // TODO: calculate the result
}
