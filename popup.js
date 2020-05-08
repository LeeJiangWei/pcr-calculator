calulateButton = document.getElementById("calculate");
parseRecipeButton = document.getElementById("recipe");
parseMapDropButton = document.getElementById("mapDrop");

calulateButton.addEventListener("click", function () {
  chrome.storage.onChanged.addListener(function (changes, areaName) {
    const plan = changes.plan.newValue;
    if (plan.feasible) {
      mountMessage("计算完成！用时 " + plan.usedTime + " 毫秒");
    } else {
      mountMessage(
        "计算失败。可能的原因：" +
          "<br> 1. 地图上限设置过低，存在现有地图中不掉落的装备" +
          "<br> 2. 未能正确解析所有地图，请确保地图掉落选项里的每页选项选择为“全部”"
      );
    }
  });
  chrome.tabs.executeScript({ file: "calculate.js" });
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
