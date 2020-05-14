calulateButton = document.getElementById("calculate");
parseRecipeButton = document.getElementById("recipe");
parseMapDropButton = document.getElementById("mapDrop");
optionsButton = document.getElementById("options");

chrome.storage.onChanged.addListener(function (changes, areaName) {
  const plan = changes.plan.newValue;
  if (plan.feasible) {
    mountMessage("计算完成！用时 " + plan.usedTime + " 毫秒，你还可以:");
    mountExtraButtons();
    generateTable(plan);
  } else {
    mountMessage(
      "计算失败。可能的原因：" +
        "<br> 1. 地图上限设置过低，存在现有地图中不掉落的装备" +
        "<br> 2. 未能正确解析所有地图，请确保地图掉落选项里的每页选项选择为“全部”"
    );
  }
});

calulateButton.addEventListener("click", function () {
  chrome.tabs.executeScript({ file: "/contents/calculate.js" });
});

parseRecipeButton.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { info: "parseRecipe" }, function (
      response
    ) {
      if (response.info === "success") {
        mountMessage("成功解析需求！");
      } else {
        mountMessage("解析需求失败！");
      }
    });
  });
});

parseMapDropButton.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { info: "parseMapDrop" }, function (
      response
    ) {
      if (response.info === "success") {
        mountMessage("成功解析地图掉落！");
      } else {
        mountMessage("解析地图掉落失败！");
      }
    });
  });
});

optionsButton.addEventListener("click", function () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("/options/options.html"));
  }
});

function mountMessage(message) {
  document.getElementById("mount").innerHTML = message;
}

function mountExtraButtons() {
  let extraButton = document.createElement("button");
  extraButton.innerText = "在新标签页中显示";
  extraButton.className = "button";
  extraButton.addEventListener("click", function () {
    chrome.tabs.create({ url: "/components/extra.html" });
  });

  let mapButton = document.createElement("button");
  mapButton.innerText = "映射回原页面";
  mapButton.className = "button";
  mapButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { info: "mapTable" }, function (
        response
      ) {
        if (response.info === "success") {
          mountMessage("成功映射至页面！");
        } else {
          mountMessage("映射至页面失败！");
        }
      });
    });
  });

  let mountNode = document.getElementById("mount");
  mountNode.appendChild(document.createElement("br"));
  mountNode.appendChild(extraButton);
  mountNode.appendChild(mapButton);
}

function generateTable(plan) {
  chrome.storage.local.get("options", function (items) {
    const { multiplier, displayInt } = items.options;

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
    html = `<table><tr><th>关卡名</th><th>建议次数</th><th>体力消耗</th></tr>${html}<tr><td>总计</td><td>${totalFarmTime.toFixed(
      2
    )}</td><td>${totalApCost.toFixed(2)}</td></tr></table>`;

    let table = document.createElement("div");
    table.innerHTML = html;
    document.getElementById("mount").appendChild(table);
  });
}
