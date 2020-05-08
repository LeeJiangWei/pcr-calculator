buttons = document.getElementsByClassName(
  "d-flex flex-nowrap mb-3 armory-function"
)[0];
recipeModeButton = buttons.children[1];
mapDropModeButton = buttons.children[2];

recipeModeButton.addEventListener("click", getDemands);
mapDropModeButton.addEventListener("click", getMapData);

function getDemands() {
  const demands = document.getElementsByClassName("recipe-mode")[0].children[0];
  let result = [];
  for (let item of demands.children) {
    const name = item.getElementsByTagName("h6")[0].innerText;
    const number = item.getElementsByClassName("badge-danger")[0].innerText;
    const href = item.getElementsByTagName("a")[0].href;
    const itemObject = {
      name,
      number,
      href,
    };
    result.push(itemObject);
    console.log(itemObject);
  }
}

function getMapData() {}
