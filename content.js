window.addEventListener("load", function () {
  f();
});

function f() {
  const buttons = document.getElementsByClassName(
    "d-flex flex-nowrap mb-3 armory-function"
  )[0];
  const recipeModeButton = buttons.children[1];
  const mapDropModeButton = buttons.children[2];

  recipeModeButton.addEventListener("click", getDemands);
  mapDropModeButton.addEventListener("click", getMapData);

  function getDemands() {
    const demandCardTable = document.getElementsByClassName("recipe-mode")[0]
      .children[0];

    let result = [];
    for (let item of demandCardTable.children) {
      const name = item.getElementsByTagName("h6")[0].innerText;
      const number = item.getElementsByClassName("badge-danger")[0].innerText;
      const href = item.getElementsByTagName("a")[0].href;
      const itemObject = {
        name,
        number,
        href,
      };
      result.push(itemObject);
    }

    chrome.storage.local.set({ demands: result }, function () {
      console.log("Demands storage complete.");
    });
  }

  function getMapData() {
    // 让一页显示全部掉落地图
    const rowsPerPageSelect = document.querySelector(
      "#app > div.main > div > div.item-box > div.row.mb-3 > div:nth-child(3) > div > div:nth-child(3) > div > div > select"
    );
    rowsPerPageSelect.value = 1000;
    rowsPerPageSelect.dispatchEvent(new Event("change"));
    setTimeout(getData, 1000);
  }

  function getData() {
    const mapDropTable = document.getElementsByClassName("mapDrop-table")[0];
    const tableRows = mapDropTable.getElementsByTagName("tr");

    let result = [];
    for (let tr of tableRows) {
      if (!tr.children[1]) continue;

      const mapName = tr.children[0].innerText;
      const totalDemands = tr.children[1].innerText;
      let dropList = [];

      const items = tr.getElementsByClassName("mapDrop-item");
      for (let item of items) {
        const number = item.getElementsByClassName(
          "text-center py-1 d-block"
        )[0].innerText;
        if (!number || number === "0") continue;

        const name = item.getElementsByTagName("img")[0].title;
        const dropRate = item.getElementsByTagName("h6")[0].innerText;
        dropList.push({ name, dropRate });
      }
      result.push({ mapName, totalDemands, dropList });
    }
    console.log(result);
    chrome.storage.local.set({ mapData: result }, function () {
      console.log("MapData Storage complete.");
    });
  }
}
