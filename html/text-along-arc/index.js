var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

const rad = canvas.height * 0.4;
const text = "Hello circle TEXT!";
const fontSize = 40;
const centX = canvas.width / 2;
const centY = canvas.height / 2;
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.font = fontSize + "px verdana";
ctx.textAlign = "center";
ctx.textBaseline = "bottom";
ctx.fillStyle = "#000";
ctx.strokeStyle = "#666";
// Text under stretched from Math.PI to 0 (180 - 0 deg)
ctx.fillCircleText(text, centX, centY, rad, Math.PI, 0);
// text over top centered at Math.PI * 1.5 ( 270 deg)
ctx.fillCircleText(text, centX, centY, rad, Math.PI * 1.5);
// text under top centered at Math.PI * 1.5 ( 270 deg)
ctx.textBaseline = "top";
ctx.fillCircleText(text, centX, centY, rad, Math.PI * 1.5);
// text over top centered at Math.PI * 1.5 ( 270 deg)
ctx.textBaseline = "middle";
ctx.fillCircleText(text, centX, centY, rad, Math.PI * 1.5);
// Use measureCircleText to get angular size
var circleTextMetric = ctx.measureCircleText("Text to measure", rad);
console.log(circleTextMetric.width); // width of text if rendered normally
console.log(circleTextMetric.angularWidth); // angular width of text
console.log(circleTextMetric.pixelAngularSize); // angular size of a pixel
// Use measure text to draw a arc around the text
ctx.textBaseline = "middle";
var width = ctx.measureCircleText(text, rad).angularWidth;
ctx.fillCircleText(text, centX, centY, rad, Math.PI * 1.5);
// render the arc around the text
ctx.strokeStyle = "red";
ctx.lineWidth = 3;
ctx.beginPath();
ctx.arc(
  centX,
  centY,
  rad + fontSize / 2,
  Math.PI * 1.5 - width / 2,
  Math.PI * 1.5 + width / 2
);
ctx.arc(
  centX,
  centY,
  rad - fontSize / 2,
  Math.PI * 1.5 + width / 2,
  Math.PI * 1.5 - width / 2,
  true
);
ctx.closePath();
ctx.stroke();
