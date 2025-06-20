const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("levelupSound");

const bgImage = new Image();
bgImage.src = "assets/bg.png";

const buttonImage = new Image();
buttonImage.src = "assets/button.png";

let buttonX = 0;
let buttonY = 0;
let buttonSize = 0;
let glowAlpha = 0; // 発光の透明度
let glowTimeout = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawScene();
}

function drawScene() {
  if (!bgImage.complete || !buttonImage.complete) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  // ボタンサイズ・位置
  buttonSize = Math.min(canvas.width, canvas.height) / 3;
  buttonX = canvas.width / 2 - buttonSize / 2;
  buttonY = canvas.height / 2 - buttonSize / 2;

  // 発光エフェクト（外側に白い円を描く）
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

    // 発光エフェクト表示
    glowAlpha = 0.8;
    drawScene();
    if (glowTimeout) clearTimeout(glowTimeout);
    glowTimeout = setTimeout(() => {
      glowAlpha = 0;
      drawScene();
    }, 200); // 0.2秒後に消す
  }
});

bgImage.onload = buttonImage.onload = () => {
  resizeCanvas();
};

window.addEventListener("resize", resizeCanvas);
