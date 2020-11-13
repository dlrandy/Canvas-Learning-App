function createCanvas(width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.ctx = canvas.getContext("2d");
  return canvas;
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var offscreenCanvas = createCanvas(100, 100);
offscreenCanvas.ctx.fillStyle = "orange";
offscreenCanvas.ctx.fillRect(10, 10, 200, 200);
ctx.drawImage(offscreenCanvas, 0, 0);
