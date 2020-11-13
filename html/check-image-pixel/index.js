var canvas = document.getElementById("canvas main");
var context = canvas.getContext("2d");

const singleImg = document.getElementById("single");
const output = document.getElementById("output");
let loaded = 0;

singleImg.onload = function () {
  loaded++;
  singleImg.crossOrigin = "anonymous";
  context.drawImage(singleImg, 0, 0, 100, 100);
  if (loaded > 1) {
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    let j = 0;
    for (let i = 0; i < imgData.data.length; i += 4) {
      let count = imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2];
      let _break = document.createElement("br");
      let checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.checked = true;
      if (count > 383) {
        checkbox.checked = false;
      }
      output.appendChild(checkbox);
      j++;
      if (j == 100) {
        j = 0;
        output.appendChild(_break);
      }
    }
  }
};
