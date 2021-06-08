const canvas = document.querySelector("#paintCanvas");
const input = document.getElementById("fileLoadBtn");
const imagesList = document.querySelector("imagesList");

let isMouseDown = false;
let currentColor = "black";
let currentBg = "white";
let currentSize = 1;
const linesArray = [];
const ctx = canvas.getContext("2d");

document.getElementById("clearBtn").addEventListener("click", () => {
  window.location.reload();
});

document.getElementById("brushColor").addEventListener("change", function () {
  currentColor = this.value;
  document.getElementById(
    "brushColorVal"
  ).textContent = `Brush Color: ${this.value}`;
});
document.getElementById("bgColor").addEventListener("change", function () {
  ctx.fillStyle = this.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  redraw();
  currentBg = ctx.fillStyle;
});

document.getElementById("brushSize").addEventListener("change", function () {
  currentSize = this.value;
  document.getElementById("brushSize").innerHTML = this.value;
  document.getElementById(
    "brushSizeVal"
  ).textContent = `Brush Size: ${this.value}`;
});

input.addEventListener("change", (e) => {
  var file = input.files[0];
  const img = new Image();
  let imgSrc = window.URL.createObjectURL(file);
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
  };
  img.src = imgSrc;
});

// GET MOUSE POSITION

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

// STORE DATA

function store(x = 0, y = 0, s, c) {
  var line = {
    x: x,
    y: y,
    size: s,
    color: c,
  };
  linesArray.push(line);
  document.getElementById("mousePos").textContent = `Pos: ${x},${y}`;
}

// ON MOUSE DOWN

function mousedown(canvas, evt) {
  if (typeof evt === "object" && evt.button === 0) {
    isMouseDown = true;
    var currentPosition = getMousePos(canvas, evt);
    ctx.moveTo(currentPosition.x, currentPosition.y);
    ctx.beginPath();
    ctx.lineWidth = currentSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
  }
}

// ON MOUSE MOVE

function mousemove(canvas, evt) {
  if (isMouseDown) {
    var currentPosition = getMousePos(canvas, evt);
    ctx.lineTo(currentPosition.x, currentPosition.y);
    ctx.stroke();
    store(currentPosition.x, currentPosition.y, currentSize, currentColor);
  }
}

const mouseUp = (e) => {
  isMouseDown = false;
  store();
  console.log("canvas");
};

// REDRAW

function redraw() {
  for (var i = 1; i < linesArray.length; i++) {
    ctx.beginPath();
    ctx.moveTo(linesArray[i - 1].x, linesArray[i - 1].y);
    ctx.lineWidth = linesArray[i].size;
    ctx.lineCap = "round";
    ctx.strokeStyle = linesArray[i].color;
    ctx.lineTo(linesArray[i].x, linesArray[i].y);
    ctx.stroke();
  }
}

// DRAWING EVENT HANDLERS

canvas.addEventListener("mousedown", function () {
  mousedown(canvas, event);
});
canvas.addEventListener("mousemove", function () {
  mousemove(canvas, event);
});

paintCanvas.addEventListener("mouseup", mouseUp);
