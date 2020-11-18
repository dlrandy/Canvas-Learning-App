var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function wrapText(text, x, y, maxWidth, fontSize, fontFace) {
  let firstY = y,
    words = text.split(" "),
    line = "",
    lineHeight = fontSize * 1.286;

  ctx.font = `${fontSize}  ${fontFace}`;
  ctx.textBaseline = "top";
  for (let n = 0; n < words.length; n++) {
    let testLine = `${line}${words[n]} `;
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth) {
      ctx.fillText(line, x, y);
      if (n < words.length - 1) {
        line = words[n] + " ";
        y += lineHeight;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

wrapText(
  `Native Canvas API does not have a method to wrap text onto the next line when a desired maximum width is
reached. This example wraps text into paragraphs.
function wrapText(text, x, y, maxWidth, fontSize, fontFace){
 var firstY=y;
 var words = text.split(' ');
 var line = '';
 var lineHeight=fontSize*1.286; // a good approx for 10-18px sizes
 ctx.font=fontSize+" "+fontFace;
 ctx.textBaseline='top';
 for(var n = 0; n < words.length; n++) {
 var testLine = line + words[n] + ' ';
 var metrics = ctx.measureText(testLine);
 var testWidth = metrics.width;
 if(testWidth > maxWidth)`,
  0,
  0,
  canvas.width / 2,
  14,
  "arial"
);
