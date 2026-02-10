# 🧧 新年擲骰子 — 骰出你的紅包金額！

一個充滿過年喜慶風格的網頁小遊戲，擲出五顆 3D 骰子來決定你的紅包金額！

## 🎮 遊戲玩法

1. 畫面上有五顆 3D 骰子，分別對應 **萬、千、百、十、個** 位數
2. 點選任一顆骰子即可擲出，順序不限
3. 每顆骰子只能擲一次，不可重擲
4. 五顆全部擲完後，系統會計算並顯示你的紅包金額
5. 可以截圖並分享到 Facebook，跟朋友比比手氣！

## 🔢 金額計算方式

每顆骰子會擲出 1～6 的點數，乘上對應位數的倍數後加總：

```
紅包金額 = 萬位骰子 × 10,000 + 千位骰子 × 1,000 + 百位骰子 × 100 + 十位骰子 × 10 + 個位骰子 × 1
```

- 最小金額：**$11,111**（全部擲出 1）
- 最大金額：**$66,666**（全部擲出 6）

## ✨ 功能特色

- **3D 骰子動畫** — 使用 CSS 3D Transform 打造真實的骰子翻滾效果，含 easeOut 緩停動畫
- **過年喜慶風格** — 深紅色漸層背景、金色裝飾、搖擺燈籠、煙火動畫
- **截圖分享** — 使用 html2canvas 產生精美的結果截圖，可下載或直接分享
- **Facebook 分享** — 一鍵分享結果到 Facebook，附帶新年祝賀語
- **響應式設計 (RWD)** — 支援桌面、平板、手機、極小螢幕四種尺寸斷點

## 🛠️ 技術架構

純靜態網頁，無需後端伺服器：

- **HTML5** — 頁面結構與 3D 骰子 DOM
- **CSS3** — 3D Transform、Grid 佈局、多斷點 RWD、過年風格動畫
- **JavaScript (ES6)** — 遊戲邏輯、requestAnimationFrame 動畫、Web Share API
- **html2canvas** — 截圖功能（CDN 引入）

## 🚀 部署方式（Cloudflare Workers）

本專案使用 [Cloudflare Workers](https://workers.cloudflare.com/) 以靜態資源方式部署，完全免費。

專案包含 `wrangler.jsonc` 設定檔，透過 `assets` 指定靜態資源目錄：

```jsonc
{
  "name": "roll-5-dice",
  "compatibility_date": "2026-02-10",
  "assets": {
    "directory": "./"
  }
}
```

### 前置準備

- 一個 [Cloudflare 帳號](https://dash.cloudflare.com/sign-up)
- 此專案已推送到 GitHub

### 設定步驟

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左側選單點選 **Workers & Pages**
3. 點選 **Create** → **Pages** → **Connect to Git**
4. 選擇 GitHub，授權 Cloudflare 存取你的儲存庫
5. 選取 `roll-5-dice` 儲存庫
6. 建置設定：
   - **專案名稱**：`roll-5-dice`（會產生 `roll-5-dice.pages.dev` 網址）
   - **Production branch**：`main`
   - **Framework preset**：`None`
   - **建置指令（Build command）**：`npx wrangler deploy`
   - **建置輸出目錄（Build output directory）**：留空
7. 點選 **Save and Deploy**

### 自訂網域（選用）

1. 部署成功後，進入專案設定 → **Custom domains**
2. 點選 **Set up a custom domain**
3. 輸入你的網域（例如 `dice.example.com`）
4. Cloudflare 會自動設定 DNS 記錄與 SSL 憑證

### 自動部署

設定完成後，每次 push 到 `main` 分支，Cloudflare 會自動重新部署。

## 📁 專案結構

```
roll-5-dice/
├── index.html      # 主頁面（含 3D 骰子結構）
├── style.css       # 樣式表（3D 骰子、過年風格、RWD）
├── script.js       # 遊戲邏輯（動畫、截圖、分享）
├── wrangler.jsonc  # Cloudflare Workers 部署設定
└── README.md       # 專案說明
```

## 📱 響應式設計

支援四種螢幕尺寸斷點：

| 斷點 | 螢幕寬度 | 骰子大小 |
|------|----------|----------|
| 桌面 | > 768px | 80px |
| 平板 | ≤ 768px | 70px |
| 手機 | ≤ 480px | 56px |
| 極小螢幕 | ≤ 360px | 48px |

## 📄 授權

本專案採用 MIT 授權條款。
