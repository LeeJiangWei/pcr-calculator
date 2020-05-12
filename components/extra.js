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

      const farmTime = displayInt
        ? Math.ceil(plan[key] / multiplier)
        : plan[key] / multiplier;

      const summedApCost = displayInt
        ? Math.ceil(plan[key]) * apCost
        : plan[key] * apCost;

      html += `<tr><td>${key}</td><td>${farmTime}</td><td>${summedApCost}</td></tr>`;

      totalFarmTime += farmTime;
      totalApCost += summedApCost;
    }
  }
  html = `<table><tr><th>关卡名</th><th>建议次数</th><th>体力消耗</th></tr>${html}<tr><td>总计</td><td>${totalFarmTime}</td><td>${totalApCost}</td></tr></table>`;

  let table = document.createElement("div");
  table.innerHTML = html;
  document.getElementById("mount").appendChild(table);
});
