var canvasB = null,
  ctxWorker = null;

self.onmessage = function (e) {
  if (typeof e.data == "string") {
    for (let i = 0; i < 20000000000; i++) {}
  } else {
    canvasB = e.data.canvas;
    ctxWorker = canvasB.getContext("2d");
    startCounting();
  }
};

var counter = 0;
function startCounting() {
  setInterval(() => {
    redrawCanvasB();
    counter++;
  }, 100);
}
function redrawCanvasB() {
  ctxWorker.clearRect(0, 0, canvasB.width, canvasB.height);
  ctxWorker.font = "16px Verdana";
  ctxWorker.textAlign = "center";
  ctxWorker.fillText(
    "Counting: " + counter,
    canvasB.width / 2,
    canvasB.height / 2
  );
}
