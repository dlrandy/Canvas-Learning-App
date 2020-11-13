var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ox = canvas.width / 2;
var oy = canvas.height / 2;
ctx.font = "42px serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillStyle = "#FFF";
ctx.fillText("Hello World", ox, oy);

document.getElementById("rotate_canvas").addEventListener("click", () => {
  ctx.translate(ox, oy);
  ctx.rotate((Math.PI / 180) * 15);
  ctx.fillText("hello canvas", 0, 0);
  ctx.translate(-ox, -oy);
});
document.getElementById("save_img").addEventListener("click", function () {
  var w = canvas.width;
  var h = canvas.height;
  ctx.save();
  var data = ctx.getImageData(0, 0, w, h);
  var compositeOperation = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, w, h);
  var imageData = canvas.toDataURL("image/png");
  ctx.clearRect(0, 0, w, h);
  ctx.putImageData(data, 0, 0);
  ctx.globalCompositeOperation = compositeOperation;

  var a = document.createElement("a");
  a.href = imageData;
  a.download = "template.png";
  a.click();
  ctx.restore();
});
