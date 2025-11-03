const parser = new DOMParser();
const allowedTags = ["U", "B", "I"];

function clearBandish() {
  let lines = document.querySelectorAll(".separator,.bandish");
  for (let i = lines.length - 1; i >= 1; --i) lines[i].remove(); // leaving the first separator
}

function newSeparator() {
  let separator = document.createElement("tr");
  separator.classList.value = "separator";
  return separator;
}

function newBandishCell(cellData) {
  if (cellData == undefined) cellData = ["-", "-", "-"];
  let newCell = document.createElement("td");

  for (value of cellData) {
    let cellDiv = newCell.appendChild(document.createElement("div"));
    cellDiv.textContent = value;
    cellDiv.classList.value = "show hidden";

    let cellInput = newCell.appendChild(document.createElement("input"));
    cellInput.type = "text";
    cellInput.value = value;
    cellInput.classList.add("edit");
    cellInput.setAttribute("onchange", "onMatraChange(this)");
  }

  return newCell;
}

function newBandishLine(lineData = []) {
  let newLine = document.createElement("tr");
  newLine.classList.value = "bandish active";

  // add cells
  for (let i = 0; i < bols.length; i++) {
    newCell = newLine.appendChild(newBandishCell(lineData[i]));
  }

  // add control box
  let th = newLine.appendChild(document.createElement("th"));

  let thCbActive = th.appendChild(document.createElement("input"));
  thCbActive.type = "checkbox";
  thCbActive.checked = true;
  thCbActive.classList.value = "show hidden";
  thCbActive.setAttribute("onchange", "setActive(this)");

  let thBtRemove = th.appendChild(document.createElement("button"));
  thBtRemove.textContent = "-";
  thBtRemove.classList.add("edit");
  thBtRemove.setAttribute("onclick", "onRemoveLine(this)");

  return newLine;
}

function onAddLine() {
  editRow.insertAdjacentElement("beforebegin", newBandishLine());
  editRow.insertAdjacentElement("beforebegin", newSeparator());
}

function onEditToggle() {
  let visible = cbEdit.checked;
  Array.from(document.getElementsByClassName("edit"), tag => {
    if (visible) tag.classList.remove("hidden");
    else tag.classList.add("hidden");
  });
  Array.from(document.getElementsByClassName("show"), tag => {
    if (visible) tag.classList.add("hidden");
    else tag.classList.remove("hidden");
  });
}

function onMatraChange(matraInput) {
  let body = parser.parseFromString(matraInput.value, "text/html")["body"];

  // inputvalidation for HTML input
  // TODO: validate with TrustedTypesPolicy
  // https://developer.mozilla.org/en-US/docs/Web/API/TrustedTypePolicy
  Array.from(body.children).forEach(tag => {
    if (! allowedTags.includes(tag.tagName)) tag.remove();
  });

  matraInput.value = matraInput.previousSibling.innerHTML = body.innerHTML;
}

function onRemoveLine(button) {
  button.parentElement.parentElement.nextElementSibling.remove();
  button.parentElement.parentElement.remove();
}
