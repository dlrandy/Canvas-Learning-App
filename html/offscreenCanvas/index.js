var canvasA = document.getElementById("canvas main");
var ctxA = canvasA.getContext("2d");

var counter = 0;
setInterval(() => {
  redrawCanvasA();
  counter++;
}, 100);

function redrawCanvasA() {
  ctxA.clearRect(0, 0, canvasA.width, canvasA.height);
  ctxA.font = "16px Verdana";
  ctxA.textAlign = "center";
  ctxA.fillText("Counting: " + counter, canvasA.width / 2, canvasA.height / 2);
}

var cWorker = document
  .getElementById("canvas worker")
  .transferControlToOffscreen();
var worker = new Worker("./worker.js");
worker.postMessage({ canvas: cWorker }, [cWorker]);
function slowdown() {
  for (let i = 0; i < 2000000000; i++) {}
}

function slowdownWorker() {
  worker.postMessage("slowDown");
}

document.getElementById("slowdown").addEventListener("click", slowdown);
document
  .getElementById("slowdownWorker")
  .addEventListener("click", slowdownWorker);
