let form = document.getElementsByTagName("form")[0];
form.addEventListener("change", onFormChanged);
window.addEventListener("load", onFormLoaded);

const algorithmRadios = document.getElementsByName("algorithm");
const multiplierRadios = document.getElementsByName("multiplier");
const metricRadios = document.getElementsByName("metric");
const displayIntCheckbox = document.getElementById("displayIntCheckbox");
const timeOutInput = document.getElementById("timeOutInput");

function onFormChanged() {
  let options = {
    algorithm: "lp",
    metric: "farmTime",
    multiplier: 1,
    displayInt: false,
    timeOut: 1000,
  };

  for (let radio of algorithmRadios) {
    if (radio.checked) {
      options.algorithm = radio.value;
    }
  }

  for (let radio of metricRadios) {
    if (radio.checked) {
      options.metric = radio.value;
    }
  }

  for (let radio of multiplierRadios) {
    if (radio.checked) {
      options.multiplier = parseInt(radio.value);
    }
  }

  options.displayInt = displayIntCheckbox.checked;

  options.timeOut = parseFloat(timeOutInput.value);

  chrome.storage.local.set({ options }, function () {
    console.log("Options saved successfully.");
  });
}

function onFormLoaded() {
  chrome.storage.local.get("options", function (items) {
    const { options } = items;

    for (let radio of algorithmRadios) {
      radio.checked = options.algorithm === radio.value;
    }
    for (let radio of metricRadios) {
      radio.checked = options.metric === radio.value;
    }
    for (let radio of multiplierRadios) {
      radio.checked = options.multiplier === parseInt(radio.value);
    }
    displayIntCheckbox.checked = options.displayInt;
    timeOutInput.value = options.timeOut;
  });
}
