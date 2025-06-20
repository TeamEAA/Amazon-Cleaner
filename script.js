const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("levelupSound");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawButton();
}

function drawButton() {
  const btnW = 300;
  const btnH = 100;
  const x = canvas.width / 2 - btnW / 2;
  const y = canvas.height / 2 - btnH / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(x, y, btnW, btnH);

  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, btnW, btnH);

  ctx.fillStyle = "#000000";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("レベルアップ！", canvas.width / 2, canvas.height / 2);
}

canvas.addEventListener("click", () => {
  sound.currentTime = 0;
  sound.play();
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
