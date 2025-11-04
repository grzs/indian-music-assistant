const apiVersion = "test"

var url;
var bandishes = [];

function refreshList() {
  // clear options
  let options = listDropdown.children;
  for (let i = options.length - 1; i >= 0; --i) options[i].remove();

  for (i in bandishes) {
    let option = listDropdown.appendChild(document.createElement("option"));
    option.textContent = bandishes[i]["name"];
    option.value = i;
  }
}

function fetchBandishes() {
  let bandishesUrl = [urlInput.value, "api", apiVersion, "bandishes"].join("/");

  fetch(bandishesUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      bandishes = JSON.parse(text);
      refreshList();
    })
    .catch((error) => {
      window.alert(`Could not fetch bandishes: ${error}`);
    });
}

// event listeners

function onURLChange() {
  url = urlInput.value;
}

function onListBtnClick() {
  fetchBandishes();
}

function onLoadClick() {
  let lines = bandishes[listDropdown.value]["lines"];
  renderBandish(lines);
}
