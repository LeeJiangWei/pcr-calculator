calulateButton = document.getElementById("calculate");
calulateButton.addEventListener("click", function () {
  chrome.tabs.executeScript({ file: "calculate.js" }, function (result) {
    // TODO: return calculate result
    const p = document.createElement("p");
    p.innerText = "计算完成!";
    document.getElementById("mount").appendChild(p);
  });
});
