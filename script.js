const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("levelupSound");

const bgImage = new Image();
bgImage.src = "assets/bg.png";

const buttonImage = new Image();
buttonImage.src = "assets/button.png";

const titleImage = new Image();
titleImage.src = "assets/title.png";

let level = parseInt(localStorage.getItem("level") || "1");
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

  // タイトル画像（比率を維持して中央上部）
  const titleMaxWidth = canvas.width * 0.8;
  const titleRatio = titleImage.width / titleImage.height;
  const titleWidth = Math.min(titleMaxWidth, 600);
  const titleHeight = titleWidth / titleRatio;
  const titleX = (canvas.width - titleWidth) / 2;
  const titleY = 20;
  ctx.drawImage(titleImage, titleX, titleY, titleWidth, titleHeight);

  // レベル表示（タイトル画像の下）
  ctx.font = "bold 48px sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(`レベル ${level}`, canvas.width / 2, titleY + titleHeight + 60);

  // ボタン描画（中央、比率維持）
  const baseSize = Math.min(canvas.width, canvas.height) / 3;
  const buttonRatio = buttonImage.width / buttonImage.height;
  let btnW = baseSize;
  let btnH = baseSize;
  if (buttonRatio > 1) {
    btnH = baseSize / buttonRatio;
  } else {
    btnW = baseSize * buttonRatio;
  }

  const buttonX = canvas.width / 2 - btnW / 2;
  const buttonY = canvas.height / 2 - btnH / 2;

  // 発光エフェクト
  if (glowAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = glowAlpha;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, baseSize / 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.restore();
  }

  ctx.drawImage(buttonImage, buttonX, buttonY, btnW, btnH);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const dx = mx - cx;
  const dy = my - cy;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const radius = Math.min(canvas.width, canvas.height) / 6;
  if (distance <= radius) {
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

titleImage.onload = () => {
  bgImage.onload = buttonImage.onload = () => {
    resizeCanvas();
  };
};

window.addEventListener("resize", resizeCanvas);
