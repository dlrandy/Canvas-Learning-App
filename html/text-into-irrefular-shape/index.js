window.onload = function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var cw = canvas.width;
  var ch = canvas.height;
  var fontsize = 12;
  var fontface = "verdana";
  var lineHeight = parseInt(fontsize * 1.286);
  var text = `It was the best of times, it was the worst of times, it was the age of wisdom, it was
 the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was theseason of Light, it was the season of Darkness, it was the spring of hope, it was the winter of
 despair, we had everything before us, we had nothing before us, we were all going direct to Heaven,
 we were all going direct the other way; in short, the period was so far like the present period,
 that some of its noisiest authorities insisted on its being received, for good or for evil, in the
 superlative degree of comparison only.`;
  var words = text.split(" ");
  var wordWidths = [];
  ctx.font = fontsize + "px " + fontface;
  for (var i = 0; i < words.length; i++) {
    wordWidths.push(ctx.measureText(words[i]).width);
  }
  var spaceWidth = ctx.measureText(" ").width;
  var wordIndex = 0;
  var data = [];
  // Demo: draw Heart
  // Note: the shape can be ANY opaque drawing -- even an image
  ctx.scale(3, 3);
  ctx.beginPath();
  ctx.moveTo(75, 40);
  ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
  ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
  ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
  ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
  ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
  ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // fill heart with text
  ctx.fillStyle = "white";
  var imgData = ctx.getImageData(0, 0, cw, ch).data;
  for (var i = 0; i < imgData.length; i += 4) {
    // 获取透明字段的数据
    data.push(imgData[i + 3]);
  }
  placeWords();

  function placeWords() {
    let sx = 0,
      sy = 0,
      y = 0,
      wordIndex = 0;
    ctx.textBaseline = "top";
    while (y < ch && wordIndex < words.length) {
      sx = 0;
      sy = y;
      let startingIndex = wordIndex;
      while (sx < cw && wordIndex < words.length) {
        let endX = getRect(sx, sy, lineHeight);
        let available = endX - sx;
        let spacer = spaceWidth;
        let w = spacer + wordWidths[wordIndex];

        while (available >= w) {
          ctx.fillText(words[wordIndex], sx, sy);
          sx += w;
          available -= w;
          spacer = spaceWidth;
          wordIndex++;
          w = spacer + wordWidths[wordIndex];
        }
        sx = endX + 1;
      }
      y = wordIndex > startingIndex ? y + lineHeight : y + 1;
    }
  }

  function getRect(sx, sy, height) {
    let x = sx,
      y = sy,
      ok = true;
    while (ok) {
      if (data[y * cw + x] < 250) {
        ok = false;
      }
      y++;
      if (y >= sy + height) {
        y = sy;
        x++;
        if (x >= cw) {
          ok = false;
        }
      }
    }
    return x;
  }
};
