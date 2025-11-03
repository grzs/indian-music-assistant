var multiplier, multiplierCounter;
var divider, dividerCounter;

var currentMatra;
var currentMatraBandish;
var currentLine;
var bandish;
var bandishMatras;
var loop;

function setBpm() {
  document.getElementById("bpmSlider").value = document.getElementById("bpm").value;
  loop != undefined && play();
}

function setBpmSlider() {
  document.getElementById("bpm").value = document.getElementById("bpmSlider").value;
  loop != undefined && play();
}

function next(x, y) {
  nextTaalMatra(x);
  nextBandishMatra(x, y);
}

function nextTaalMatra(i) {
  if (multiplierCounter >= multiplier) {
    bols[currentMatra] != undefined &&
      bols[currentMatra].classList.contains("current") &&
      bols[currentMatra].classList.toggle("current");

    // set currentMatra to i or the next one
    if (i >= 0 && i < bols.length) currentMatra = i;
    else if (++currentMatra >= bols.length) currentMatra = 0;

    // adjust speed if needed
    if (currentMatra == 0) play();

    // highlight current one
    bols[currentMatra].classList.toggle("current");

    // sounds
    if (loop != undefined) {
      cbClick.checked && triggerSound(click);
      currentMatra == 0 && cbChime.checked && triggerSound(sam);
    }

    multiplierCounter = 1;
  } else multiplierCounter++;

  return currentMatra;
}

function nextBandishMatra(x, y) {
  if (dividerCounter >= divider) {
    bandishMatras[currentMatraBandish] != undefined &&
      bandishMatras[currentMatraBandish].classList.contains("current") &&
      bandishMatras[currentMatraBandish].classList.toggle("current");

    // set currentMatraBandish to i or the next one
    if (x >= 0 && x < bandishMatras.length) currentMatraBandish = x;
    else if (++currentMatraBandish >= bols.length) currentMatraBandish = 0;

    // go to next line when reached the end of line
    currentMatraBandish == 0 && nextBandishLine(y);

    // highlight current one
    bandishMatras[currentMatraBandish].classList.toggle("current");

    dividerCounter = 1;
  } else dividerCounter++;

  return currentMatraBandish;
}

function nextBandishLine(i) {
  bandish[currentLine] !=  undefined &&
    bandish[currentLine].classList.contains("currentline") &&
    bandish[currentLine].classList.toggle("currentline");

  if (i >= 0 && i < bandish.length) { currentLine = i; }
  else { ++currentLine >= bandish.length && (currentLine = 0); }

  bandish[currentLine].classList.toggle("currentline");
  bandishMatras = bandish[currentLine].getElementsByTagName("td");

  return currentLine;
}

function play() {
  loop && clearInterval(loop);
  multiplier = document.getElementById("multiplier").value;
  multiplierCounter = 1;
  divider = document.getElementById("divider").value;
  dividerCounter = 1;

  let interval = intervalBase / (document.getElementById("bpm").value * multiplier);
  loop = setInterval(next, interval);
}

function stop() {
  if (loop === undefined) reset();
  else {
    clearInterval(loop);
    loop = undefined;
  }
}

function setActive(e) {
  let line = e.parentNode.parentNode;
  if (e.checked) line.classList.add("active");
  else line.classList.remove("active");

  // TODO: incorporate it to next() or init()
  stop();
  reset();
}

function triggerSound(aObj) {
  if (aObj.played.length === 0 || aObj.ended) aObj.play(); // never played or playback ended
  else aObj.currentTime = 0;                               // playing
}

function reset() {
  // TODO: it could be better ...
  let currentCells = Array.from(document.getElementsByClassName("current"));
  let currentLines = Array.from(document.getElementsByClassName("currentline"));
  currentCells.forEach(td => {
    td.classList.remove("current");
  });
  currentLines.forEach(tr => {
    tr.classList.remove("currentline");
  });

  bandish = document.getElementsByClassName("bandish active");

  currentLine = -1;
  currentMatra = -1;
  currentMatraBandish = -1;
  bandishMatras = [];
}

