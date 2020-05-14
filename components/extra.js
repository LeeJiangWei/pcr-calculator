chrome.storage.local.get(["options", "plan"], function (items) {
  const { plan, options } = items;
  const { multiplier, displayInt } = options;

  let html = "",
    totalFarmTime = 0,
    totalApCost = 0;
  for (let key in plan) {
    if (!isNaN(parseInt(key))) {
      const chapterIndex = key.slice(0, key.indexOf("-"));
      const apCost = Math.min(7 + Math.ceil(chapterIndex / 3), 10);

      let farmTime = parseFloat((plan[key] / multiplier).toFixed(2));
      farmTime = displayInt ? Math.ceil(farmTime) : farmTime;

      const summedApCost = parseFloat((farmTime * apCost).toFixed(2));

      html += `<tr><td>${key}</td><td>${farmTime}</td><td>${summedApCost}</td></tr>`;

      totalFarmTime += farmTime;
      totalApCost += summedApCost;
    }
  }
  html = `<table><tr><th>关卡名</th><th>建议次数</th><th>体力消耗</th></tr>${html}<tr><td>总计</td><td>${
    displayInt ? Math.ceil(totalFarmTime) : totalFarmTime.toFixed(2)
  }</td><td>${
    displayInt ? Math.ceil(totalApCost) : totalApCost.toFixed(2)
  }</td></tr></table>`;

  let table = document.createElement("div");
  table.innerHTML = html;
  document.getElementById("mount").appendChild(table);
});
