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
    if (message.info === "parseRecipe") {
      recipeModeButton.dispatchEvent(new Event("click"));
      setTimeout(function () {
        if (getDemands()) {
          sendResponse({ info: "success" });
        } else {
          sendResponse({ info: "failure" });
        }
      }, 500);
    } else if (message.info === "parseMapDrop") {
      mapDropModeButton.dispatchEvent(new Event("click"));
      setTimeout(function () {
        if (getMapData()) {
          sendResponse({ info: "success" });
        } else {
          sendResponse({ info: "failure" });
        }
      }, 500);
    } else if (message.info === "mapTable") {
      if (mapTable()) {
        sendResponse({ info: "success" });
      } else {
        sendResponse({ info: "failure" });
      }
    } else {
      sendResponse({ info: "failure" });
    }
    return true;
  });
}

function mapTable() {
  // TODO: 完成映射逻辑
  chrome.storage.local.get("plan", function (items) {
    let { plan } = items;
    let thead = document.querySelector(
      "#app > div.main > div > div.item-box > div.row.mb-3 > div:nth-child(3) > table > thead"
    );
    let th = document.createElement("th");
    th.innerText = "建议次数";
    thead.appendChild(th);

    let tbody = document.querySelector(
      "#app > div.main > div > div.item-box > div.row.mb-3 > div:nth-child(3) > table > tbody"
    );
    console.log(tbody.children);
    for (let tr of tbody.children) {
      const mapName = tr.children[0].innerText;
      console.log(mapName);
      if (plan[mapName]) {
        console.log("add:" + mapName + " value:" + plan[mapName]);
        let td = document.createElement("td");
        td.innerText = plan[mapName];
        tr.appendChild(td);
      } else {
        console.log("remove:" + mapName);
        tr.remove();
      }
    }
  });
  return true;
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

  if (rowsPerPageSelect.value === 1000) {
    return getData();
  } else {
    rowsPerPageSelect.value = 1000;
    rowsPerPageSelect.dispatchEvent(new Event("change"));
    setTimeout(getData, 500);
    return true;
  }
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

  chrome.storage.local.set({ mapData: result }, function () {
    console.log("MapData Storage complete.");
  });

  return true;
}
