/**
 * 新年擲骰子遊戲
 * 玩家點選五顆 3D 骰子（萬、千、百、十、個），決定紅包金額
 */

// ===== 遊戲狀態 =====
const state = {
  results: [null, null, null, null, null],
  multipliers: [10000, 1000, 100, 10, 1],
  isRolling: false,
};

// ===== DOM 元素 =====
const diceCubes = Array.from({ length: 5 }, (_, i) =>
  document.getElementById(`dice-${i}`)
);
const hintEl = document.getElementById("hint");
const resultArea = document.getElementById("result-area");
const amountValue = document.getElementById("amount-value");
const shareDiceResult = document.getElementById("share-dice-result");
const btnShare = document.getElementById("btn-share");
const btnDownload = document.getElementById("btn-download");
const btnRestart = document.getElementById("btn-restart");

/**
 * 根據點數產生骰子面的圓點 HTML
 * @param {number} num - 點數（1~6）
 * @returns {string} 圓點的 HTML 字串
 */
function createDots(num) {
  let dots = "";
  for (let i = 0; i < num; i++) {
    dots += '<div class="dot"></div>';
  }
  return dots;
}

/**
 * 為每顆骰子的六面隨機指定點數（初始化外觀）
 * 正面（front）預設顯示問號狀態：不放圓點
 */
function initDiceFaces() {
  // 標準骰子對面總和為 7：前1/後6, 右2/左5, 上3/下4
  const faceConfig = [
    { selector: ".face-front", value: 1 },
    { selector: ".face-back", value: 6 },
    { selector: ".face-right", value: 2 },
    { selector: ".face-left", value: 5 },
    { selector: ".face-top", value: 3 },
    { selector: ".face-bottom", value: 4 },
  ];

  diceCubes.forEach((cube) => {
    faceConfig.forEach(({ selector, value }) => {
      const face = cube.querySelector(selector);
      // 加上對應的點數 class，用於 CSS Grid 佈局
      face.className = `dice-face ${selector.replace(".", "")} face-${value}`;
      face.innerHTML = createDots(value);
    });
  });
}

/**
 * 取得讓指定點數朝上的 3D 旋轉角度
 * @param {number} value - 目標點數（1~6）
 * @returns {{ x: number, y: number }} 旋轉角度
 */
function getRotationForValue(value) {
  // 根據骰子面配置，計算需要哪個面朝向正面（面對玩家）
  // 正面=1, 背面=6, 右=2, 左=5, 上=3, 下=4
  const rotations = {
    1: { x: 0, y: 0 },       // 正面朝前
    2: { x: 0, y: -90 },     // 右面朝前
    3: { x: -90, y: 0 },     // 上面朝前
    4: { x: 90, y: 0 },      // 下面朝前
    5: { x: 0, y: 90 },      // 左面朝前
    6: { x: 0, y: 180 },     // 背面朝前
  };
  return rotations[value];
}

/**
 * 擲骰子：3D 旋轉動畫
 * @param {number} index - 骰子索引（0~4）
 */
function rollDice(index) {
  if (state.results[index] !== null || state.isRolling) return;

  state.isRolling = true;
  const cube = diceCubes[index];
  const scene = cube.parentElement;

  cube.classList.add("rolling");

  // 產生最終結果（1~6）
  const result = Math.floor(Math.random() * 6) + 1;
  state.results[index] = result;

  // 取得目標旋轉角度
  const target = getRotationForValue(result);

  // 動畫：快速旋轉多圈後停在目標面
  const totalDuration = 1200;
  const startTime = performance.now();

  // 隨機旋轉方向，增加變化感
  const spinDirectionX = Math.random() > 0.5 ? 1 : -1;
  const spinDirectionY = Math.random() > 0.5 ? 1 : -1;

  // 多轉幾圈再停下（至少轉 3 圈）
  const extraSpinsX = (3 + Math.floor(Math.random() * 2)) * 360 * spinDirectionX;
  const extraSpinsY = (3 + Math.floor(Math.random() * 2)) * 360 * spinDirectionY;

  const finalX = target.x + extraSpinsX;
  const finalY = target.y + extraSpinsY;

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    // 使用 easeOutCubic 讓結尾放慢
    let progress = Math.min(elapsed / totalDuration, 1);
    progress = 1 - Math.pow(1 - progress, 3);

    const currentX = finalX * progress;
    const currentY = finalY * progress;

    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // 動畫結束，設定最終角度
      cube.style.transform = `rotateX(${target.x}deg) rotateY(${target.y}deg)`;
      cube.classList.remove("rolling");
      cube.classList.add("rolled");
      scene.classList.add("rolled-scene");

      state.isRolling = false;
      updateHint();
      checkAllRolled();
    }
  }

  requestAnimationFrame(animate);
}

/**
 * 更新提示文字
 */
function updateHint() {
  const remaining = state.results.filter((r) => r === null).length;
  if (remaining === 0) {
    hintEl.textContent = "";
  } else {
    hintEl.textContent = `還剩 ${remaining} 顆骰子，繼續點選吧！`;
  }
}

/**
 * 檢查是否五顆全部擲完
 */
function checkAllRolled() {
  const allDone = state.results.every((r) => r !== null);
  if (!allDone) return;

  const total = state.results.reduce(
    (sum, val, i) => sum + val * state.multipliers[i],
    0
  );

  // 在分享卡片中顯示各骰子結果
  const placeLabels = ["萬", "千", "百", "十", "個"];
  shareDiceResult.innerHTML = state.results
    .map(
      (val, i) =>
        `<div class="mini-dice" title="${placeLabels[i]}位">${val}</div>`
    )
    .join("");

  setTimeout(() => {
    amountValue.textContent = `$${total.toLocaleString()}`;
    resultArea.classList.add("show");
  }, 500);
}

/**
 * 使用 html2canvas 截圖分享卡片
 * @returns {Promise<Blob>} 截圖的 Blob 物件
 */
async function captureShareCard() {
  const shareCard = document.getElementById("share-card");
  const canvas = await html2canvas(shareCard, {
    backgroundColor: "#8B0000",
    scale: 2,
    useCORS: true,
  });
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

/**
 * 分享到 Facebook（含截圖下載 + 開啟分享視窗）
 */
async function shareToFacebook() {
  const total = state.results.reduce(
    (sum, val, i) => sum + val * state.multipliers[i],
    0
  );

  const diceStr = state.results.join("、");

  const shareText =
    `🧧🎊 恭賀新禧！新年快樂！🎊🧧\n\n` +
    `我在「新年擲骰子」遊戲中骰出了 ${diceStr}，\n` +
    `紅包金額是 $${total.toLocaleString()} 元！\n\n` +
    `🎉 金蛇年行大運，萬事如意！\n` +
    `🎲 快來試試你的新年手氣吧！`;

  // 1. 下載截圖
  await downloadScreenshot();

  // 2. 複製恭喜文字到剪貼簿
  try {
    await navigator.clipboard.writeText(shareText);
  } catch (e) {
    // 剪貼簿不可用時靜默失敗
  }

  // 3. 提示使用者：截圖已下載、文字已複製
  alert(
    "📷 截圖已下載！\n" +
    "📋 恭喜文字已複製到剪貼簿！\n\n" +
    "接下來會開啟 Facebook，你可以：\n" +
    "1. 貼上文字（Ctrl+V / Cmd+V）\n" +
    "2. 上傳剛才下載的截圖"
  );

  // 4. 開啟 Facebook 建立新貼文
  window.open("https://www.facebook.com/", "_blank");
}

/**
 * 下載結果截圖
 */
async function downloadScreenshot() {
  const blob = await captureShareCard();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "新年擲骰子結果.png";
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * 重新開始遊戲
 */
function resetGame() {
  state.results = [null, null, null, null, null];
  state.isRolling = false;

  diceCubes.forEach((cube) => {
    const scene = cube.parentElement;
    cube.classList.remove("rolled", "rolling");
    scene.classList.remove("rolled-scene");
    cube.style.transform = "rotateX(-20deg) rotateY(20deg)";
  });

  resultArea.classList.remove("show");
  shareDiceResult.innerHTML = "";
  hintEl.textContent = "👆 點選任一顆骰子開始擲骰！";
}

// ===== 初始化 =====
initDiceFaces();

// ===== 事件綁定 =====
diceCubes.forEach((cube, index) => {
  // 點擊骰子場景（scene）而非立方體本身，避免 3D 面的點擊問題
  cube.parentElement.addEventListener("click", () => rollDice(index));
});

btnShare.addEventListener("click", shareToFacebook);
btnDownload.addEventListener("click", downloadScreenshot);
btnRestart.addEventListener("click", resetGame);
