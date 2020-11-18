(function () {
  const FILL = 0,
    STROKE = 1,
    MEASURE = 2;
  let renderType = FILL;
  const BLANK_SPACE = " ";
  let maxSpaceSize = 3,
    minSpaceSize = 0.5;
  const renderTextJustified = (ctx, text, x, y, width) => {
    let words,
      wordsWidth,
      count,
      spaces,
      spaceWidth,
      adjSpace,
      renderer,
      i,
      textAlign,
      useSize,
      totalWidth;
    textAlign = ctx.textAlign;
    ctx.textAlign = "left";
    wordsWidth = 0;
    words = text.split(BLANK_SPACE).map((word) => {
      let width = ctx.measureText(word).width;
      wordsWidth += width;
      return {
        width,
        word,
      };
    });

    count = words.length;
    spaces = count - 1;
    spaceWidth = ctx.measureText(BLANK_SPACE).width;
    adjSpace = Math.max(
      spaceWidth * minSpaceSize,
      (width - wordsWidth) / spaces
    );
    useSize = adjSpace > spaceWidth * maxSpaceSize ? spaceWidth : adjSpace;
    totalWidth = wordsWidth + useSize * spaces;
    if (renderType === MEASURE) {
      ctx.textAlign = textAlign;
      return totalWidth;
    }
    renderer =
      renderType === FILL ? ctx.fillText.bind(ctx) : ctx.strokeText.bind(ctx);
    switch (textAlign) {
      case "right":
        x -= totalWidth;
        break;
      case "end":
        x += width - totalWidth;
        break;
      case "center":
        x -= totalWidth / 2;
        break;

      default:
        break;
    }
    if (useSize === spaceWidth) {
      renderer(text, x, y);
    } else {
      for (let i = 0; i < count; i++) {
        renderer(words[i].word, x, y);
        x += words[i].width;
        x += useSize;
      }
    }
    ctx.textAlign = textAlign;
  };
  const justifiedTextSettings = (settings) => {
    let min, max;
    const vetNumber = (num, defaultNum) => {
      num = num !== null && !isNaN(num) ? num : defaultNum;
      if (num < 0) {
        num = defaultNum;
      }
      return num;
    };
    if (settings === undefined || settings === null) {
      return;
    }
    max = vetNumber(settings.maxSpaceSize, maxSpaceSize);
    min = vetNumber(settings.minSpaceSize, minSpaceSize);
    if (min > max) {
      return;
    }
    minSpaceSize = min;
    maxSpaceSize = max;
  };

  const fillJustifyText = function (text, x, y, width, settings) {
    justifiedTextSettings(settings);
    renderType = FILL;
    renderTextJustified(this, text, x, y, width);
  };
  const strokeJustifyText = function (text, x, y, width, settings) {
    justifiedTextSettings(settings);
    renderType = STROKE;
    renderTextJustified(this, text, x, y, width);
  };
  const measureJustifiedText = function (text, width, settings) {
    justifiedTextSettings(settings);
    renderType = MEASURE;
    return renderTextJustified(this, text, 0, 0, width);
  };

  CanvasRenderingContext2D.prototype.fillJustifyText = fillJustifyText;
  CanvasRenderingContext2D.prototype.strokeJustifyText = strokeJustifyText;
  CanvasRenderingContext2D.prototype.measureJustifiedText = measureJustifiedText;
})();

(function () {
  if (
    typeof CanvasRenderingContext2D.prototype.fillJustifyText !== "function"
  ) {
    throw new ReferenceError(
      "justified paragraph extension missing required CanvasRenderingContext2D justified text extension"
    );
  }

  let maxSpaceSize = 3,
    minSpaceSize = 0.5,
    /*尽可能的存放更多的字，false则为空格尽可能正常 */
    compact = true,
    lineSpacing = 1.5;

  const noJustifySetting = {
    minSpaceSize: 1,
    maxSpaceSize: 1,
  };

  function justifiedTextSettings(settings) {
    let min, max;
    function vetNumber(num, defaultNum) {
      num = num !== null && !isNaN(num) ? num : defaultNum;
      return num < 0 ? defaultNum : num;
    }
    if (!settings) {
      return;
    }
    compact = settings.compact || compact;
    max = vetNumber(settings.maxSpaceSize, maxSpaceSize);
    min = vetNumber(settings.minSpaceSize, minSpaceSize);
    lineSpacing = vetNumber(settings.lineSpacing, lineSpacing);
    if (min > max) {
      return;
    }
    minSpaceSize = min;
    maxSpaceSize = max;
  }

  function getFontSize(font) {
    let numFind = /[0-9]+/;
    let number = numFind.exec(font)[0];
    if (isNaN(number)) {
      throw new ReferenceError("justifiedPar cant find font size");
    }
    return Number(number);
  }

  function justifiedPar(ctx, text, x, y, width, settings, stroke) {
    let spaceWidth,
      minS,
      maxS,
      words,
      count,
      lines,
      lineWidth,
      lastLineWidth,
      lastSize,
      renderer,
      fontSize,
      adjSpace,
      spaces,
      word,
      lineWords,
      lineFound;

    spaceWidth = ctx.measureText(" ").width;
    minS = spaceWidth * minSpaceSize;
    maxS = spaceWidth * maxSpaceSize;
    words = text.split(" ").map((word) => {
      let width = ctx.measureText(word).width;
      return {
        word,
        width,
      };
    });

    count = 0;
    lines = [];

    while (words.length > 0) {
      lastLineWidth = 0;
      lastSize = -1;
      lineFound = false;
      word = words.shift();
      lineWidth = word.width;
      lineWords = [word.word];
      count = 0;
      while (lineWidth < width && words.length > 0) {
        word = words.shift();
        lineWidth += word.width;
        lineWords.push(word.word);
        count += 1;
        spaces = count - 1;
        adjSpace = (width - lineWidth) / spaces;

        if (minS > adjSpace) {
          lineFound = true;
          words.unshift(word);
          lineWords.pop();
        } else {
          if (!compact) {
            if (adjSpace < spaceWidth) {
              if (lastSize === -1) {
                lastSize = adjSpace;
              }
              if (
                Math.abs(spaceWidth - adjSpace) <
                Math.abs(spaceWidth - lastSize)
              ) {
                lineFound = true;
              } else {
                words.unshift(word);
                lineWords.pop();
                lineFound = true;
              }
            }
          }
        }
        lastSize = adjSpace;
      }
      lines.push(lineWords.join(" "));
    }

    fontSize = getFontSize(ctx.font);
    renderer =
      stroke === true
        ? ctx.strokeJustifyText.bind(ctx)
        : ctx.fillJustifyText.bind(ctx);

    for (let i = 0; i < lines.length - 1; i++) {
      renderer(lines[i], x, y, width, settings);
      y += lineSpacing * fontSize;
    }
    if (lines.length > 0) {
      if (["left", "start"].includes(ctx.textAlign)) {
        renderer(lines[lines.length - 1], x, y, width, noJustifySetting);
        ctx.measureJustifiedText("", width, settings);
      } else {
        renderer(lines[lines.length - 1], x, y, width);
      }
    }

    y += lineSpacing * fontSize;

    return {
      nextLine: y,
      fontSize,
      lineHeight: lineSpacing * fontSize,
    };
  }

  function fillParagraphText(text, x, y, width, settings) {
    justifiedTextSettings(settings);
    settings = {
      minSpaceSize,
      maxSpaceSize,
    };
    return justifiedPar(this, text, x, y, width, settings);
  }
  function strokeParagraphText(text, x, y, width, settings) {
    justifiedTextSettings(settings);
    settings = {
      minSpaceSize,
      maxSpaceSize,
    };
    return justifiedPar(this, text, x, y, width, settings, true);
  }

  CanvasRenderingContext2D.prototype.fillParaText = fillParagraphText;
  CanvasRenderingContext2D.prototype.strokeParaText = strokeParagraphText;
})();
(function () {
  const FILL = 0; // const to indicate filltext render
  const STROKE = 1;
  var renderType = FILL; // used internal to set fill or stroke text
  const multiplyCurrentTransform = true; // if true Use current transform when rendering
  // if false use absolute coordinates which is a little quicker
  // after render the currentTransform is restored to default transform

  // measure circle text
  // ctx: canvas context
  // text: string of text to measure
  // r: radius in pixels
  //
  // returns the size metrics of the text
  //
  // width: Pixel width of text
  // angularWidth : angular width of text in radians
  // pixelAngularSize : angular width of a pixel in radians
  var measure = function (ctx, text, radius) {
    var textWidth = ctx.measureText(text).width; // get the width of all the text
    return {
      width: textWidth,
      angularWidth: (1 / radius) * textWidth,
      pixelAngularSize: 1 / radius,
    };
  };
  // displays text along a circle
  // ctx: canvas context
  // text: string of text to measure
  // x,y: position of circle center
  // r: radius of circle in pixels
  // start: angle in radians to start.
  // [end]: optional. If included text align is ignored and the text is
  // scaled to fit between start and end;
  // [forward]: optional default true. if true text direction is forwards, if false direction is backward
  var circleText = function (ctx, text, x, y, radius, start, end, forward) {
    var i, textWidth, pA, pAS, a, aw, wScale, aligned, dir, fontSize;
    if (text.trim() === "" || ctx.globalAlpha === 0) {
      // don't render empty string or transparent
      return;
    }
    if (
      isNaN(x) ||
      isNaN(y) ||
      isNaN(radius) ||
      isNaN(start) ||
      (end !== undefined && end !== null && isNaN(end))
    ) {
      //
      throw TypeError(
        "circle text arguments requires a number for x,y, radius, start, and end."
      );
    }
    aligned = ctx.textAlign; // save the current textAlign so that it can be restored at end
    dir = forward ? 1 : forward === false ? -1 : 1; // set dir if not true or false set forward as true
    pAS = 1 / radius; // get the angular size of a pixel in radians
    textWidth = ctx.measureText(text).width; // get the width of all the text
    if (end !== undefined && end !== null) {
      // if end is supplied then fit text between start and end
      pA = ((end - start) / textWidth) * dir;
      wScale = (pA / pAS) * dir;
    } else {
      // if no end is supplied correct start and end for alignment
      // if forward is not given then swap top of circle text to read the correct direction
      if (forward === null || forward === undefined) {
        if (((start % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) > Math.PI) {
          dir = -1;
        }
      }
      pA = -pAS * dir;
      wScale = -1 * dir;
      switch (aligned) {
        case "center": // if centered move around half width
          start -= (pA * textWidth) / 2;
          end = start + pA * textWidth;
          break;
        case "right": // intentionally falls through to case "end"
        case "end":
          end = start;
          start -= pA * textWidth;
          break;
        case "left": // intentionally falls through to case "start"
        case "start":
          end = start + pA * textWidth;
      }
    }
    ctx.textAlign = "center";
    a = start; // set the start angle
    for (var i = 0; i < text.length; i += 1) {
      // for each character
      aw = ctx.measureText(text[i]).width * pA; // get the angular width of the text
      var xDx = Math.cos(a + aw / 2); // get the yAxies vector from the center x,y out
      var xDy = Math.sin(a + aw / 2);
      if (multiplyCurrentTransform) {
        // transform multiplying current transform
        ctx.save();
        if (xDy < 0) {
          // is the text upside down. If it is flip it
          ctx.transform(
            -xDy * wScale,
            xDx * wScale,
            -xDx,
            -xDy,
            xDx * radius + x,
            xDy * radius + y
          );
        } else {
          ctx.transform(
            -xDy * wScale,
            xDx * wScale,
            xDx,
            xDy,
            xDx * radius + x,
            xDy * radius + y
          );
        }
      } else {
        if (xDy < 0) {
          // is the text upside down. If it is flip it
          ctx.setTransform(
            -xDy * wScale,
            xDx * wScale,
            -xDx,
            -xDy,
            xDx * radius + x,
            xDy * radius + y
          );
        } else {
          ctx.setTransform(
            -xDy * wScale,
            xDx * wScale,
            xDx,
            xDy,
            xDx * radius + x,
            xDy * radius + y
          );
        }
      }
      if (renderType === FILL) {
        ctx.fillText(text[i], 0, 0); // render the character
      } else {
        ctx.strokeText(text[i], 0, 0); // render the character
      }
      if (multiplyCurrentTransform) {
        // restore current transform
        ctx.restore();
      }
      a += aw; // step to the next angle
    }
    // all done clean up.
    if (!multiplyCurrentTransform) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); // restore the transform
    }
    ctx.textAlign = aligned; // restore the text alignment
  };
  // define fill text
  var fillCircleText = function (text, x, y, radius, start, end, forward) {
    renderType = FILL;
    circleText(this, text, x, y, radius, start, end, forward);
  };
  // define stroke text
  var strokeCircleText = function (text, x, y, radius, start, end, forward) {
    renderType = STROKE;
    circleText(this, text, x, y, radius, start, end, forward);
  };
  // define measure text
  var measureCircleTextExt = function (text, radius) {
    return measure(this, text, radius);
  };
  // set the prototypes
  CanvasRenderingContext2D.prototype.fillCircleText = fillCircleText;
  CanvasRenderingContext2D.prototype.strokeCircleText = strokeCircleText;
  CanvasRenderingContext2D.prototype.measureCircleText = measureCircleTextExt;
})();

const stackOverflowDemo = `
function showTextDemo(){
  /** Include fullScreenCanvas.js begin **/
  var canvas = document.getElementById("canv");
  if(canvas !== null){
      document.body.removeChild(canvas);
  }
  canvas = (function () {
      // creates a blank image with 2d context
      canvas = document.createElement("canvas");
      canvas.id = "canv";
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = "absolute";
      canvas.style.top = "0px";
      canvas.style.left = "0px";
      canvas.ctx = canvas.getContext("2d");
      document.body.appendChild(canvas);
      return canvas;
  } ) ();
  var ctx = canvas.ctx;
  /** fullScreenCanvas.js end **/





  // measure circle text
  // ctx: canvas context
  // text: string of text to measure
  // x,y: position of center
  // r: radius in pixels
  //
  // returns the size metrics of the text
  //
  // width: Pixel width of text
  // angularWidth : angular width of text in radians
  // pixelAngularSize : angular width of a pixel in radians
  var measureCircleText = function(ctx, text, x, y, radius){
      var textWidth;
      // get the width of all the text
      textWidth = ctx.measureText(text).width;
      return {
          width               :textWidth,
          angularWidth        : (1 / radius) * textWidth,
          pixelAngularSize    : 1 / radius
      }
  }

  // displays text alon a circle
  // ctx: canvas context
  // text: string of text to measure
  // x,y: position of center
  // r: radius in pixels
  // start: angle in radians to start.
  // [end]: optional. If included text align is ignored and the text is
  //        scalled to fit between start and end;
  // direction
  var circleText = function(ctx,text,x,y,radius,start,end,direction){
      var i, textWidth, pA, pAS, a, aw, wScale, aligned, dir;
      // save the current textAlign so that it can be restored at end
      aligned = ctx.textAlign;

      dir = direction ? 1 : -1;
      // get the angular size of a pixel in radians
      pAS = 1 / radius;

      // get the width of all the text
      textWidth = ctx.measureText(text).width;

      // if end is supplied then fit text between start and end
      if(end !== undefined){
          pA = ((end - start) / textWidth) * dir;
          wScale = (pA / pAS) * dir;
      }else{ // if no end is supplied corret start and end for alignment
          pA = -pAS * dir;
          wScale = -1 * dir;
          switch(aligned){
              case "center": // if centered move around half width
                  start -= pA * (textWidth / 2);
                  end = start + pA * textWidth;
                  break;
              case "right":
                  end = start;
                  start -= pA * textWidth;
                  break;
              case "left":
                  end = start + pA * textWidth;
          }
      }

      // some code to help me test. Left it here incase someone wants to underline
      // rmove the following 3 lines if you dont need underline
      ctx.beginPath();
      ctx.arc(x,y,radius,end,start,end>start?true:false);
      ctx.stroke();

      ctx.textAlign = "center"; // align for rendering

      a = start;  // set the start angle
      for (var i = 0; i < text.length; i += 1) {  // for each character
          // get the angular width of the text
          aw = ctx.measureText(text[i]).width * pA;
          var xDx = Math.cos(a + aw / 2); // get the yAxies vector from the center x,y out
          var xDy = Math.sin(a + aw / 2);
          if (xDy < 0) {  // is the text upside down. If it is flip it
              // sets the transform for each character scaling width if needed
              ctx.setTransform(-xDy * wScale, xDx * wScale,-xDx,-xDy, xDx * radius + x,xDy * radius + y);
          }else{
              ctx.setTransform(-xDy * wScale, xDx * wScale, xDx, xDy, xDx * radius + x, xDy * radius + y);
          }
          // render the character
          ctx.fillText(text[i],0,0);

          a += aw;

      }
      ctx.setTransform(1,0,0,1,0,0);
      ctx.textAlign = aligned;
  }


  // set up canvas
  var w = canvas.width;
  var h = canvas.height;
  var cw = w / 2;   // centers
  var ch = h / 2;
  var rad = (h / 2) * 0.9;  // radius
  // clear
  ctx.clearRect(0, 0, w, h)
  // the font
  var fontSize = Math.floor(h/20);
  if(h < 400){
     var fontSize = 10;
  }
  ctx.font = fontSize + "px verdana";
  // base settings
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#666";
  ctx.strokeStyle = "#666";

  // Text under stretched
  circleText(ctx, "Test of circular text rendering", cw, ch, rad, Math.PI, 0, true);
  // Text over stretchered
  ctx.fillStyle = "Black";
  circleText(ctx, "This text is over the top", cw, ch, rad, Math.PI, Math.PI * 2, true);

  // Show centered text
  rad -= fontSize + 4;
  ctx.fillStyle = "Red";
  // Use measureCircleText to get angular size
  var tw = measureCircleText(ctx, "Centered", cw, ch, rad).angularWidth;
  // centered bottom and top
  circleText(ctx, "Centered", cw, ch, rad, Math.PI / 2, undefined, true);
  circleText(ctx, "Centered", cw, ch, rad, -Math.PI * 0.5, undefined, false);
  // left align bottom and top
  ctx.textAlign = "left";
  circleText(ctx, "Left Align", cw, ch, rad, Math.PI / 2 - tw * 0.6, undefined, true);
  circleText(ctx, "Left Align Top", cw, ch, rad, -Math.PI / 2 + tw * 0.6, undefined, false);
  // right align bottom and top
  ctx.textAlign = "right";
  circleText(ctx, "Right Align", cw, ch, rad, Math.PI / 2 + tw * 0.6, undefined, true);
  circleText(ctx, "Right Align Top", cw, ch, rad, -Math.PI / 2 - tw * 0.6, undefined, false);

  // Show base line at middle
  ctx.fillStyle = "blue";
  rad -= fontSize + fontSize;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  circleText(ctx, "Baseline Middle", cw, ch, rad, Math.PI / 2, undefined, true);
  circleText(ctx, "Baseline Middle", cw, ch, rad, -Math.PI / 2, undefined, false);

  // show baseline at top
  ctx.fillStyle = "Green";
  rad -= fontSize + fontSize;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  circleText(ctx, "Baseline top", cw, ch, rad, Math.PI / 2, undefined, true);
  circleText(ctx, "Baseline top", cw, ch, rad, -Math.PI / 2, undefined, false);
  }

  showTextDemo();
  window.addEventListener("resize",showTextDemo);
`;
