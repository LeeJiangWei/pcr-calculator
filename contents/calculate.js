chrome.storage.local.get(["mapData", "demands", "options"], function (items) {
  const { mapData, demands, options } = items;
  calculate(mapData, demands, options);
});

function calculate(mapData, demands, options) {
  const { algorithm, timeOut, metric } = options;

  let ints = Object.assign({}, mapData);
  for (let key in ints) {
    ints[key] = 1;
  }

  const model = {
    optimize: metric,
    opType: "min",
    constraints: demands,
    variables: mapData,
    options: {
      timeout: timeOut,
    },
  };

  if (algorithm === "ip") {
    model.ints = ints;
  }

  const t0 = performance.now();
  const result = solver.Solve(model);
  const t1 = performance.now();
  result.usedTime = t1 - t0;

  chrome.storage.local.set({ plan: result });
}
