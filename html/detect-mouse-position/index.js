var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "34px Arial";
canvas.addEventListener("mousemove", (e) => {
  var eRect = canvas.getBoundingClientRect();
  var canvasX = Math.round(e.clientX - eRect.left);
  var canvasY = Math.round(e.clientY - eRect.top);
  ctx.clearRect(0, 0, 400, 300);
  ctx.fillText(`X: ${canvasX} , Y: ${canvasY}`, 200, 200);
});
ctx.textAlign = "center";
ctx.textBaseLine = "middle";
ctx.fillStyle = "#ddd";
ctx.fillText("Learning Canvas, yeah!!!", 300, 400);
