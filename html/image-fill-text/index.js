function drawImageInsideText(canvas, x, y, img, text, font) {
  var c = canvas.cloneNode();
  var ctx = c.getContext("2d");
  ctx.font = font;
  ctx.fillText(text, x, y);
  ctx.globalCompositeOperation = "source-atop";
  ctx.drawImage(img, 0, 0);
  canvas.getContext("2d").drawImage(c, 0, 0);
}

var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");
var img = document.getElementById("img");
img.onload = function () {
  drawImageInsideText(
    canvas,
    0,
    canvas.height - 200,
    img,
    "Water!",
    "225px arial"
  );
};
