const reader = new FileReader();

const filePickerOpts = {
  types: [
    {
      description: "Text file",
      accept: { "text/plain": [".json"] },
    },
  ],
};

async function writeFile(fileHandle, contents) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();

  // Write the contents of the file to the stream.
  await writable.write(contents);

  // Close the file and write the contents to disk.
  await writable.close();
}

async function readFile() {
  // open file picker
  const [fileHandle] = await window.showOpenFilePicker(filePickerOpts);
  // get file contents
  const fileData = await fileHandle.getFile();
  return fileData;
}

async function onExportClick() {
  let fileHandle = await window.showSaveFilePicker(filePickerOpts);
  await writeFile(
    fileHandle, 
    JSON.stringify(serializeBandish())
  );
}

// serializers
function getCompositionSlug() {
  return (listDropdown.value || "bandish");
}

function serializeLine(line) {
  let matras = [];
  for (td of line) {
    let matra = [];
    for (div of td.getElementsByTagName("div")) matra.push(div.textContent);
    matras.push({
      "syllable": matra[0],
      "sargam": matra[1],
      "bol": matra[2],
    });
  }
  return {
    "matras": matras,
    "section": ""
  };
}

function serializeBandish() {
  let bandishData = [];
  for (line of document.getElementsByClassName("bandish"))
    bandishData.push(
      serializeLine(
        line.getElementsByTagName("td")));
  return {
    "slug": getCompositionSlug(),
    "lines": bandishData
  };
}

// event listeners
function onImportClick() {
  readFile().then(f => reader.readAsText(f));
}

function onBandishDataLoaded() {
  let lines = JSON.parse(reader.result);
  renderBandish(lines)
}
reader.addEventListener("load", onBandishDataLoaded);
