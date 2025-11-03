const reader = new FileReader();

const filePickerOpts = {
  types: [
    {
      description: "Text file",
      accept: { "text/plain": [".json"] },
    },
  ],
};

function parseLine(line) {
  let data = [];
  for (td of line) {
    let cell = [];
    for (div of td.getElementsByTagName("div")) cell.push(div.textContent);
    data.push(cell);
  }
  return data;
}

function parseBandish() {
  let bandishData = [];
  for (line of document.getElementsByClassName("bandish"))
    bandishData.push(
      parseLine(
        line.getElementsByTagName("td")));
  return bandishData;
}

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

async function saveBandish() {
  let fileHandle = await window.showSaveFilePicker(filePickerOpts);
  await writeFile(
    fileHandle, 
    JSON.stringify(parseBandish())
  );
}

function loadBandish() {
  stop();
  reset();
  readFile().then(f => reader.readAsText(f));
}

function onBandishDataLoaded() {
  let bandishData = JSON.parse(reader.result);

  clearBandish();
  for (line of bandishData) onAddLine(line);

  cbEdit.checked = false;
  onEditToggle();
  reset();
}
reader.addEventListener("load", onBandishDataLoaded);
