const settings = {
  maxSpaceSize: 6,
  minSpaceSize: 0.5,
};
var para = `You can inset the start of the paragraph with spaces. Though this may not be consistent from
paragraph to paragraph. It is always a good thing to learn what a function is doing and modifying it. An
exercise would be to add a setting to the settings that indents the first line by a fixed amount. Hint the
while loop will need to temporarily make the first word appear larger (+ indent) words[0].width += ?
and then when rendering lines indent the first line.`;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "25px arial";
ctx.textAlign = "center";
var left = 10;
var center = canvas.width / 2;
var width = canvas.width - left * 2;
var y = 20;
var size = 16;
var i = 0;
ctx.fillText("Justified paragraph examples.", center, y);
y += 30;
ctx.font = "14px arial";
ctx.textAlign = "left";
// set para settings
var setting = {
  maxSpaceSize: 6,
  minSpaceSize: 0.5,
  lineSpacing: 1.2,
  compact: true,
};
// Show the left and right bounds.
ctx.strokeStyle = "red";
ctx.beginPath();
ctx.moveTo(left, y - size * 2);
ctx.lineTo(left, y + size * 15);
ctx.moveTo(canvas.width - left, y - size * 2);
ctx.lineTo(canvas.width - left, y + size * 15);
ctx.stroke();
ctx.textAlign = "left";
ctx.fillStyle = "black";
// Draw paragraph
var line = ctx.fillParaText(para, left, y, width, setting); // settings is remembered
// Next paragraph
y = line.nextLine + line.lineHeight;
setting.compact = false;
ctx.fillParaText(para, left, y, width, setting);
