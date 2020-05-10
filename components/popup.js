calulateButton = document.getElementById("calculate");
parseRecipeButton = document.getElementById("recipe");
parseMapDropButton = document.getElementById("mapDrop");

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

    let html = "";
    for (let key in plan) {
      if (key === "result") {
        html += `<tr><td>总次数</td><td>${
          displayInt
            ? Math.ceil(plan[key] / multiplier)
            : plan[key] / multiplier
        }</td></tr>`;
      } else if (key === "feasible") {
        html += `<tr><td>可行性</td><td>${plan[key]}</td></tr>`;
      } else if (key === "bounded") {
        html += `<tr><td>有界性</td><td>${plan[key]}</td></tr>`;
      } else if (key === "usedTime") {
        html += `<tr><td>用时</td><td>${plan[key]} ms</td></tr>`;
      } else if (key === "isIntegral") {
        html += `<tr><td>整数规划</td><td>${Boolean(plan[key])}</td></tr>`;
      } else {
        html += `<tr><td>${key}</td><td>${
          displayInt
            ? Math.ceil(plan[key] / multiplier)
            : plan[key] / multiplier
        }</td></tr>`;
      }
    }
    html = `<table><tr><th>关卡名</th><th>建议次数</th></tr>${html}</table>`;

    let table = document.createElement("div");
    table.innerHTML = html;
    document.getElementById("mount").appendChild(table);
  });
}