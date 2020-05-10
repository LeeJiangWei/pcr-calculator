chrome.storage.local.get(["options", "plan"], function (items) {
  const { plan, options } = items;
  const { multiplier, displayInt } = options;

  let html = "";
  for (let key in plan) {
    if (key === "result") {
      html += `<tr><td>总次数</td><td>${
        displayInt ? Math.ceil(plan[key] / multiplier) : plan[key] / multiplier
      }</td></tr>`;
    } else if (key === "feasible") {
      html += `<tr><td>可行性</td><td>${plan[key]}</td></tr>`;
    } else if (key === "bounded") {
      html += `<tr><td>有界性</td><td>${plan[key]}</td></tr>`;
    } else if (key === "usedTime") {
      html += `<tr><td>用时</td><td>${plan[key]} ms</td></tr>`;
    } else {
      html += `<tr><td>${key}</td><td>${
        displayInt ? Math.ceil(plan[key] / multiplier) : plan[key] / multiplier
      }</td></tr>`;
    }
  }
  html = `<table><tr><th>关卡名</th><th>建议次数</th></tr>${html}</table>`;

  let table = document.createElement("div");
  table.innerHTML = html;
  document.getElementById("mount").appendChild(table);
});
