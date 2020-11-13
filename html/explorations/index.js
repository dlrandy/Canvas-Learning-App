var canvas = document.getElementById("canvas main");
var context = canvas.getContext("2d");
context.strokeRect(50, 50, 100, 100);

context.beginPath();
context.arc(150, 150, 50, 0, 2 * Math.PI);
context.closePath();
context.stroke();

context.beginPath();
context.moveTo(200, 75);
context.lineTo(100, 75);
context.lineTo(100, 25);
// context.lineWidth = 10;
context.closePath();
context.strokeStyle = "#666666";
context.stroke();

context.beginPath();
context.moveTo(75, 40);
context.bezierCurveTo(75, 37, 70, 25, 50, 25);
context.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
context.bezierCurveTo(20, 80, 40, 102, 75, 120);
context.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
context.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
context.bezierCurveTo(85, 25, 75, 37, 75, 40);
context.stroke();
context.closePath();

for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    context.strokeStyle = `rgb(255, ${Math.floor(255 - 42.5 * i)}, ${Math.floor(
      255 - 42.5 * j
    )})`;
    context.beginPath();
    context.strokeRect(j * 25, i * 25, 25, 25);
    context.stroke();
  }
}

context.fillStyle = "rgba(46, 195, 182, 0.5)";
context.fillRect(25, 25, 100, 100);

context.fillStyle = "rgba(231, 29, 54, 0.5)";
context.fillRect(75, 75, 100, 100);

const download = document.getElementById("download");
download.addEventListener("click", function (e) {
  var link = document.createElement("a");
  link.download = "download.png";
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
});

const img = document.getElementById("evalutions");

img.onload = function () {
  img.crossOrigin = "anonymous";
  context.drawImage(img, 0, 0);
  const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
  for (i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255 - imgData.data[i];
    imgData.data[i + 1] = 255 - imgData.data[i + 1];
    imgData.data[i + 2] = 255 - imgData.data[i + 2];
    imgData.data[i + 3] = 255;
  }
  context.putImageData(imgData, 0, 0);
};

const singleImg = document.getElementById("single");
singleImg.onload = function () {
  context.drawImage(singleImg, 0, 200);
  const imgData = context.getImageData(
    0,
    200,
    canvas.width,
    canvas.height - 200
  );
  for (i = 0; i < imgData.data.length; i += 4) {
    let count = imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2];
    let colour = 0;
    if (count > 510) colour = 255;
    else if (count > 255) colour = 127.5;
    imgData.data[i] = colour;
    imgData.data[i + 1] = colour;
    imgData.data[i + 2] = colour;
    imgData.data[i + 3] = 255;
  }
  context.putImageData(imgData, 200, 200);
};
