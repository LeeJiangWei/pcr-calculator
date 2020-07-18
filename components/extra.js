chrome.storage.local.get(["options", "plan"], function (items) {
  const { plan, options } = items;
  const { multiplier, displayInt } = options;
  const sort = "down";
  const axis = "mapName";

  let html = "",
    totalFarmTime = 0,
    totalApCost = 0;
  let planArr = [];

  for (let mapName in plan) {
    if (!isNaN(parseInt(mapName))) {
      const chapterIndex = parseInt(mapName.slice(0, mapName.indexOf("-")));
      const mapIndex = parseInt(
        mapName.slice(mapName.indexOf("-") + 1, mapName.length)
      );

      const apCost = Math.min(7 + Math.ceil(chapterIndex / 3), 10);
      let farmTime = parseFloat((plan[mapName] / multiplier).toFixed(2));
      farmTime = displayInt ? Math.ceil(farmTime) : farmTime;
      const summedApCost = parseFloat((farmTime * apCost).toFixed(2));

      totalFarmTime += farmTime;
      totalApCost += summedApCost;
      planArr.push({
        mapName,
        chapterIndex,
        mapIndex,
        farmTime,
        summedApCost,
      });
    }
  }

  planArr = planArr.sort(function (a, b) {
    if (sort === "no") return 0;

    let result = 0;
    if (axis === "mapName") {
      result =
        a.chapterIndex * 100 + a.mapIndex - b.chapterIndex * 100 - b.mapIndex;
    } else if (axis === "farmTime") {
      result = a.farmTime - b.farmTime;
    } else if (axis === "summedApCost") {
      result = a.summedApCost - b.summedApCost;
    } else {
      result = 0;
    }

    if (sort === "down") {
      result *= -1;
    }

    return result;
  });

  planArr.forEach(function (item) {
    const { mapName, farmTime, summedApCost } = item;
    html += `<tr><td>${mapName}</td><td>${farmTime}</td><td>${summedApCost}</td></tr>`;
  });

  html = `<table><tr><th>关卡名</th><th>建议次数</th><th>体力消耗</th></tr>${html}<tr><td>总计</td><td>${
    displayInt ? Math.ceil(totalFarmTime) : totalFarmTime.toFixed(2)
  }</td><td>${
    displayInt ? Math.ceil(totalApCost) : totalApCost.toFixed(2)
  }</td></tr></table>`;

  let table = document.createElement("div");
  table.innerHTML = html;
  document.getElementById("mount").appendChild(table);
});
