window.addEventListener("load", f);

function f() {
  const buttons = document.getElementsByClassName(
    "d-flex flex-nowrap mb-3 armory-function"
  )[0];
  const recipeModeButton = buttons.children[1];
  const mapDropModeButton = buttons.children[2];

  // recipeModeButton.addEventListener("click", getDemands);
  // mapDropModeButton.addEventListener("click", getMapData);

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    // TODO: 解决DOM更新有延迟的问题
    if (message.info === "parseRecipe") {
      recipeModeButton.dispatchEvent(new Event("click"));
      if (getDemands()) {
        sendResponse({ info: "success" });
      } else {
        setTimeout(function () {
          if (getDemands()) {
            sendResponse({ info: "success" });
          } else {
            sendResponse({ info: "failure" });
          }
        }, 200);
      }
    } else if (message.info === "parseMapDrop") {
      mapDropModeButton.dispatchEvent(new Event("click"));
      if (getMapData()) {
        sendResponse({ info: "success" });
      } else {
        setTimeout(function () {
          if (getMapData()) {
            sendResponse({ info: "success" });
          } else {
            sendResponse({ info: "failure" });
          }
        }, 200);
      }
    } else {
      sendResponse({ info: "failure" });
    }
  });
}

function getDemands() {
  if (!document.getElementsByClassName("recipe-mode")[0]) return false;

  const demandCardTable = document.getElementsByClassName("recipe-mode")[0]
    .children[0];

  let result = {};
  for (let item of demandCardTable.children) {
    const name = item.getElementsByTagName("h6")[0].innerText;
    const number = item.getElementsByClassName("badge-danger")[0].innerText;
    // const href = item.getElementsByTagName("a")[0].href;
    result[name] = { min: parseInt(number) };
  }
  console.log(result);

  chrome.storage.local.set({ demands: result }, function () {
    console.log("Demands storage complete.");
  });

  return true;
}

function getMapData() {
  // 让一页显示全部掉落地图
  const rowsPerPageSelect = document.querySelector(
    "#app > div.main > div > div.item-box > div.row.mb-3 > div:nth-child(3) > div > div:nth-child(3) > div > div > select"
  );
  if (!rowsPerPageSelect) return false;

  rowsPerPageSelect.value = 1000;
  rowsPerPageSelect.dispatchEvent(new Event("change"));
  setTimeout(getData, 1000);
}

function getData() {
  if (!document.getElementsByClassName("mapDrop-table")[0]) return false;

  const mapDropTable = document.getElementsByClassName("mapDrop-table")[0];
  const tableRows = mapDropTable.getElementsByTagName("tr");

  let result = {};
  for (let tr of tableRows) {
    if (!tr.children[1]) continue;

    const mapName = tr.children[0].innerText;
    // const totalDemands = tr.children[1].innerText;
    let dropList = {};

    const items = tr.getElementsByClassName("mapDrop-item");
    for (let item of items) {
      const number = item.getElementsByClassName("text-center py-1 d-block")[0]
        .innerText;
      if (!number || number === "0") continue;

      const name = item.getElementsByTagName("img")[0].title;
      const dropRate = item.getElementsByTagName("h6")[0].innerText;
      dropList[name] = parseFloat(dropRate) / 100.0;
      dropList.num = 1;
    }
    result[mapName] = dropList;
  }

  console.log(result);
  chrome.storage.local.set({ mapData: result }, function () {
    console.log("MapData Storage complete.");
  });

  return true;
}
