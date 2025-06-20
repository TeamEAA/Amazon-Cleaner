const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("levelupSound");

const bgImage = new Image();
bgImage.src = "assets/bg.png";

const buttonImage = new Image();
buttonImage.src = "assets/button.png";

const titleImage = new Image();
titleImage.src = "assets/title.png"; // アプリ名画像

let level = parseInt(localStorage.getItem("level") || "1");
let buttonX = 0;
let buttonY = 0;
let buttonSize = 0;
let glowAlpha = 0;
let glowTimeout = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawScene();
}

function drawScene() {
  if (!bgImage.complete || !buttonImage.complete || !titleImage.complete) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  // タイトル画像を最上部に重ねて表示
  const titleWidth = Math.min(canvas.width * 0.8, 600);
  const titleHeight = titleWidth * 0.25;
  const titleX = (canvas.width - titleWidth) / 2;
  const titleY = 20;
  ctx.drawImage(titleImage, titleX, titleY, titleWidth, titleHeight);

  // レベル表示（画像の下に大きく）
  ctx.font = "bold 48px sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(`レベル ${level}`, canvas.width / 2, titleY + titleHeight + 50);

  // ボタン位置とサイズ
  buttonSize = Math.min(canvas.width, canvas.height) / 3;
  buttonX = canvas.width / 2 - buttonSize / 2;
  buttonY = canvas.height / 2 - buttonSize / 2;

  // 発光エフェクト
  if (glowAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = glowAlpha;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, buttonSize / 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.restore();
  }

  // ボタン画像
  ctx.drawImage(buttonImage, buttonX, buttonY, buttonSize, buttonSize);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const cx = buttonX + buttonSize / 2;
  const cy = buttonY + buttonSize / 2;
  const dx = mx - cx;
  const dy = my - cy;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= buttonSize / 2) {
    sound.currentTime = 0;
    sound.play();

    level++;
    localStorage.setItem("level", level);

    glowAlpha = 0.8;
    drawScene();
    if (glowTimeout) clearTimeout(glowTimeout);
    glowTimeout = setTimeout(() => {
      glowAlpha = 0;
      drawScene();
    }, 200);
  }
});

bgImage.onload = buttonImage.onload = titleImage.onload = () => {
  resizeCanvas();
};

window.addEventListener("resize", resizeCanvas);
