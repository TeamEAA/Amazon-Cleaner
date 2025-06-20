const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("levelupSound");

// 背景画像の読み込み
const bgImage = new Image();
bgImage.src = "assets/bg.png";

bgImage.onload = () => {
  resizeCanvas();
  drawButton();
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawButton();
}

function drawButton() {
  // 背景描画
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  const btnW = 300;
  const btnH = 100;
  const x = canvas.width / 2 - btnW / 2;
  const y = canvas.height / 2 - btnH / 2;

  ctx.fillStyle = "red";
  ctx.fillRect(x, y, btnW, btnH);

  ctx.strokeStyle = "#FFF";
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, btnW, btnH);

  ctx.fillStyle = "#FFF";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("レベルアップ！", canvas.width / 2, canvas.height / 2);
}

canvas.addEventListener("click", () => {
  sound.currentTime = 0;
  sound.play();
  drawButton(); // 再描画（視覚効果があれば）
});

window.addEventListener("resize", resizeCanvas);
