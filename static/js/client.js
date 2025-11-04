const apiVersion = "v1"

var url;
var bandishes = [];

function refreshList() {
  // clear options
  let options = listDropdown.children;
  for (let i = options.length - 1; i >= 0; --i) options[i].remove();

  for (bandish of bandishes) {
    let option = listDropdown.appendChild(document.createElement("option"));
    option.textContent = bandish["display_name"];
    option.value = bandish["slug"];
  }
}

function fetchBandishes() {
  let url = [urlInput.value, "api", apiVersion, "compositions"].join("/");

  fetch(url)
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

function fetchComposition(slug) {
  let url = [urlInput.value, "api", apiVersion, "compositions", slug].join("/");

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      compositionData = JSON.parse(text);
      renderBandish(compositionData);
    })
    .catch((error) => {
      window.alert(`Could not fetch bandishes: ${error}`);
    });
}

function updateComposition(data) {
  let url = [urlInput.value, "api", apiVersion, "compositions", data["slug"]].join("/");

  fetch(url, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response;
    })
    .then((response) => {
      console.log(response);
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
  fetchComposition(getCompositionSlug());
}

function onSaveClick() {
  updateComposition(serializeBandish());
}
