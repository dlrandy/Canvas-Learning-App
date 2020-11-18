const settings = {
  maxSpaceSize: 6,
  minSpaceSize: 0.5,
};

var canvas = document.getElementById("canvas");
var w = canvas.width,
  h = canvas.height;
var ctx = canvas.getContext("2d");
var i = 0;
var text = [];
text[i++] = "This text is aligned from the left of the canvas.";
text[i++] = "This text is near the max spacing size";
text[i++] = "This text is way too short.";
text[i++] = "This text is too long for the space provied and will overflow#";
text[i++] = "This text is aligned using 'end' and starts at x + width";
text[i++] = "This text is near the max spacing size";
text[i++] = "This text is way too short.";
text[i++] = "#This text is too long for the space provied and will overflow";
text[i++] = "This is aligned with 'center' and is placed from the center";
text[i++] = "This text is near the max spacing size";
text[i++] = "This text is way too short.";
text[i++] =
  "This text is just too long for the space provied and will overflow";
// ctx is the 2d context
// canvas is the canvas
ctx.clearRect(0, 0, w, h);
ctx.font = "25px arial";
ctx.textAlign = "center";
var left = 20;
var center = canvas.width / 2;
var width = canvas.width - left * 2;
var y = 40;
var size = 16;
var i = 0;
ctx.fillText("Justified text examples.", center, y);
y += 40;
ctx.font = "14px arial";
ctx.textAlign = "left";
var ww = ctx.measureJustifiedText(text[0], width);
var setting = {
  maxSpaceSize: 6,
  minSpaceSize: 0.5,
};
ctx.strokeStyle = "red";
ctx.beginPath();
ctx.moveTo(left, y - size * 2);
ctx.lineTo(left, y + size * 15);
ctx.moveTo(canvas.width - left, y - size * 2);
ctx.lineTo(canvas.width - left, y + size * 15);
ctx.stroke();
ctx.textAlign = "left";
ctx.fillStyle = "red";
ctx.fillText("< 'start' aligned", left, y - size);
ctx.fillStyle = "black";
ctx.fillJustifyText(text[i++], left, y, width, setting); // settings is remembered
ctx.fillJustifyText(text[i++], left, (y += size), width);
ctx.fillJustifyText(text[i++], left, (y += size), width);
ctx.fillJustifyText(text[i++], left, (y += size), width);
y += 2.3 * size;
ctx.fillStyle = "red";
ctx.fillText(
  "< 'end' aligned from x plus the width -------------------->",
  left,
  y - size
);
ctx.fillStyle = "black";
ctx.textAlign = "end";
ctx.fillJustifyText(text[i++], left, y, width);
ctx.fillJustifyText(text[i++], left, (y += size), width);
ctx.fillJustifyText(text[i++], left, (y += size), width);
ctx.fillJustifyText(text[i++], left, (y += size), width);
y += 40;
ctx.strokeStyle = "red";
ctx.beginPath();
ctx.moveTo(center, y - size * 2);
ctx.lineTo(center, y + size * 5);
ctx.stroke();
ctx.textAlign = "center";
ctx.fillStyle = "red";
ctx.fillText("'center' aligned", center, y - size);
ctx.fillStyle = "black";
ctx.fillJustifyText(text[i++], center, y, width);
ctx.fillJustifyText(text[i++], center, (y += size), width);
ctx.fillJustifyText(text[i++], center, (y += size), width);
ctx.fillJustifyText(text[i++], center, (y += size), width);
