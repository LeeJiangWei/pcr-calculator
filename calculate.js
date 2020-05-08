chrome.storage.local.get("mapData", function (mapData) {
  chrome.storage.local.get("demands", function (demands) {
    calculate(mapData, demands);
  });
});

function calculate(mapData, demands) {
  const model = {
    optimize: "num",
    opType: "min",
    constraints: demands,
    variables: mapData,
  };
  const result = solver.Solve(model);

  console.log(result);
}
