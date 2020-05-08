chrome.storage.local.get("mapData", function (mapData) {
  chrome.storage.local.get("demands", function (demands) {
    calculate(mapData.mapData, demands.demands);
  });
});

function calculate(mapData, demands) {
  let ints = Object.assign({}, mapData);
  for (let key in ints) {
    ints[key] = 1;
  }
  console.log(ints);
  const model = {
    optimize: "num",
    opType: "min",
    constraints: demands,
    variables: mapData,
    // ints: ints,
  };

  const t0 = performance.now();
  const result = solver.Solve(model);
  const t1 = performance.now();
  result.usedTime = t1 - t0;

  chrome.storage.local.set({ plan: result });
}
