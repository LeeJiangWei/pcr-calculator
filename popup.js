calulateButton = document.getElementById("calculate");
parseRecipeButton = document.getElementById("recipe");
parseMapDropButton = document.getElementById("mapDrop");

calulateButton.addEventListener("click", function () {
  chrome.tabs.executeScript({ file: "calculate.js" }, function () {
    chrome.storage.local.get("plan", function (item) {
      // TODO: 显示计算结果为表格，或者另外弹出窗口
      mountMessage("计算完成！");
      console.log(item.plan);
    });
  });
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
  const p = document.createElement("p");
  p.innerText = message;
  document.getElementById("mount").appendChild(p);
}
