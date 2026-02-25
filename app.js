const RANKS = ["青铜", "白银", "黄金", "铂金", "钻石", "星耀", "王者"];
const STARS_PER_RANK = 3;
const STORAGE_KEY = "study-king-mvp";

const defaultCards = [
  { id: crypto.randomUUID(), name: "改简历一句", action: "把项目经历改成结果导向一句", lootHint: "保存简历并写下改动", tag: "简历", enabledToday: true },
  { id: crypto.randomUUID(), name: "复述题解3行", action: "看一道题并复述核心思路3行", lootHint: "记录三行文字", tag: "算法", enabledToday: true },
  { id: crypto.randomUUID(), name: "英语口语1分钟", action: "围绕今日主题口述1分钟", lootHint: "写下关键词", tag: "英语", enabledToday: true },
];

const state = loadState();
let currentCard = null;
let canRedraw = true;
let timerId = null;
let remainingSec = 600;
let activeRun = null;

const el = {
  modeSelect: document.getElementById("modeSelect"),
  singleTagSelect: document.getElementById("singleTagSelect"),
  cardForm: document.getElementById("cardForm"),
  cardName: document.getElementById("cardName"),
  cardAction: document.getElementById("cardAction"),
  cardLootHint: document.getElementById("cardLootHint"),
  cardTag: document.getElementById("cardTag"),
  cardList: document.getElementById("cardList"),
  drawBtn: document.getElementById("drawBtn"),
  redrawBtn: document.getElementById("redrawBtn"),
  drawResult: document.getElementById("drawResult"),
  timerDisplay: document.getElementById("timerDisplay"),
  startTimerBtn: document.getElementById("startTimerBtn"),
  finishEarlyBtn: document.getElementById("finishEarlyBtn"),
  abandonBtn: document.getElementById("abandonBtn"),
  lootForm: document.getElementById("lootForm"),
  settleBtn: document.getElementById("settleBtn"),
  settleResult: document.getElementById("settleResult"),
  saveTomorrowBtn: document.getElementById("saveTomorrowBtn"),
  historyList: document.getElementById("historyList"),
};

init();

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const base = {
    mode: "mixed",
    singleTag: "",
    cards: defaultCards,
    rankIndex: 0,
    stars: 0,
    streak: 0,
    firstLossShieldDate: "",
    history: [],
    tomorrowTip: "",
    savedTomorrowTip: "",
  };
  if (!raw) return base;
  try {
    return { ...base, ...JSON.parse(raw) };
  } catch {
    return base;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function init() {
  el.modeSelect.value = state.mode;
  bindEvents();
  renderTagOptions();
  renderCards();
  renderHistory();
  updateTimer(remainingSec);
  renderSettlement("等待本局结束");
}

function bindEvents() {
  el.modeSelect.addEventListener("change", () => {
    state.mode = el.modeSelect.value;
    saveState();
  });
  el.singleTagSelect.addEventListener("change", () => {
    state.singleTag = el.singleTagSelect.value;
    saveState();
  });
  el.cardForm.addEventListener("submit", addCard);
  el.drawBtn.addEventListener("click", () => drawCard(false));
  el.redrawBtn.addEventListener("click", () => drawCard(true));
  el.startTimerBtn.addEventListener("click", startTimer);
  el.finishEarlyBtn.addEventListener("click", () => stopRun("early"));
  el.abandonBtn.addEventListener("click", () => stopRun("abandon"));
  el.lootForm.addEventListener("submit", submitLoot);
  el.saveTomorrowBtn.addEventListener("click", () => {
    state.savedTomorrowTip = state.tomorrowTip;
    saveState();
    el.saveTomorrowBtn.textContent = "已保存为明日提示";
    el.saveTomorrowBtn.disabled = true;
  });
}

function renderTagOptions() {
  const tags = [...new Set(state.cards.map(c => c.tag).filter(Boolean))];
  const options = ["<option value=''>全部标签</option>", ...tags.map(t => `<option value="${t}">${t}</option>`)].join("");
  el.singleTagSelect.innerHTML = options;
  el.singleTagSelect.value = state.singleTag || "";
}

function addCard(e) {
  e.preventDefault();
  state.cards.unshift({
    id: crypto.randomUUID(),
    name: el.cardName.value.trim(),
    action: el.cardAction.value.trim(),
    lootHint: el.cardLootHint.value.trim(),
    tag: el.cardTag.value.trim(),
    enabledToday: true,
  });
  e.target.reset();
  saveState();
  renderTagOptions();
  renderCards();
}

function renderCards() {
  el.cardList.innerHTML = "";
  state.cards.forEach(card => {
    const box = document.createElement("article");
    box.className = "card-item";
    box.innerHTML = `
      <header>
        <strong>${card.name}</strong>
        <span>${card.tag ? `<span class='chip'>${card.tag}</span>` : ""}</span>
      </header>
      <div>${card.action}</div>
      <small class='muted'>产出提示：${card.lootHint}</small>
      <div class='row'>
        <label><input type='checkbox' ${card.enabledToday ? "checked" : ""}/> 今日启用</label>
        <button>编辑</button>
        <button class='bad'>删除</button>
      </div>`;
    const [toggle, editBtn, delBtn] = box.querySelectorAll("input,button");
    toggle.addEventListener("change", () => {
      card.enabledToday = toggle.checked;
      saveState();
    });
    editBtn.addEventListener("click", () => editCard(card.id));
    delBtn.addEventListener("click", () => {
      state.cards = state.cards.filter(c => c.id !== card.id);
      saveState();
      renderTagOptions();
      renderCards();
    });
    el.cardList.appendChild(box);
  });
}

function editCard(id) {
  const card = state.cards.find(c => c.id === id);
  if (!card) return;
  const name = prompt("卡名", card.name);
  if (!name) return;
  const action = prompt("最小行动", card.action);
  if (!action) return;
  const lootHint = prompt("产出提示", card.lootHint);
  if (!lootHint) return;
  const tag = prompt("标签", card.tag || "") ?? "";
  card.name = name.trim();
  card.action = action.trim();
  card.lootHint = lootHint.trim();
  card.tag = tag.trim();
  saveState();
  renderTagOptions();
  renderCards();
}

function availableCards() {
  let cards = state.cards.filter(c => c.enabledToday);
  if (state.mode === "single" && state.singleTag) {
    cards = cards.filter(c => c.tag === state.singleTag);
  }
  return cards;
}

function drawCard(isRedraw) {
  if (isRedraw && !canRedraw) return;
  const pool = availableCards();
  if (!pool.length) {
    el.drawResult.textContent = "没有可抽卡：请先勾选今日启用卡片。";
    return;
  }
  currentCard = pool[Math.floor(Math.random() * pool.length)];
  if (isRedraw) canRedraw = false;
  el.redrawBtn.disabled = !canRedraw;
  el.startTimerBtn.disabled = false;
  el.drawResult.classList.remove("muted");
  el.drawResult.textContent = `本局任务：${currentCard.name}\n行动：${currentCard.action}\n产出提示：${currentCard.lootHint}`;
}

function selectedDurationMin() {
  return Number(document.querySelector("input[name='duration']:checked").value);
}

function startTimer() {
  if (!currentCard) return;
  const min = selectedDurationMin();
  remainingSec = min * 60;
  activeRun = {
    date: new Date().toISOString(),
    cardId: currentCard.id,
    cardName: currentCard.name,
    durationMin: min,
    abandoned: false,
  };
  el.startTimerBtn.disabled = true;
  el.finishEarlyBtn.disabled = false;
  el.abandonBtn.disabled = false;
  el.settleBtn.disabled = true;
  updateTimer(remainingSec);
  clearInterval(timerId);
  timerId = setInterval(() => {
    remainingSec -= 1;
    updateTimer(remainingSec);
    if (remainingSec <= 0) stopRun("timeout");
  }, 1000);
}

function stopRun(reason) {
  clearInterval(timerId);
  el.finishEarlyBtn.disabled = true;
  el.abandonBtn.disabled = true;
  if (!activeRun) return;
  activeRun.abandoned = reason === "abandon";
  activeRun.endReason = reason;
  el.settleBtn.disabled = false;
  if (reason === "abandon") {
    settle(null, true);
  }
}

function updateTimer(sec) {
  const mm = String(Math.max(0, Math.floor(sec / 60))).padStart(2, "0");
  const ss = String(Math.max(0, sec % 60)).padStart(2, "0");
  el.timerDisplay.textContent = `${mm}:${ss}`;
}

function submitLoot(e) {
  e.preventDefault();
  const loot = {
    text: document.getElementById("lootText").value.trim(),
    link: document.getElementById("lootLink").value.trim(),
    screenshot: document.getElementById("lootScreenshot").value.trim(),
    file: document.getElementById("lootFile").value.trim(),
  };
  if (!loot.text && !loot.link && !loot.screenshot && !loot.file) {
    alert("至少提交一种产出物");
    return;
  }
  settle(loot, false);
  e.target.reset();
}

function settle(loot, forcedLose) {
  const today = new Date().toISOString().slice(0, 10);
  const isWin = !forcedLose && !!loot && !activeRun?.abandoned;
  let starChange = 0;
  let shieldUsed = false;

  if (isWin) {
    state.streak += 1;
    starChange = 1;
  } else {
    state.streak = 0;
    if (state.firstLossShieldDate !== today) {
      state.firstLossShieldDate = today;
      starChange = 0;
      shieldUsed = true;
    } else {
      starChange = -1;
    }
  }

  applyStars(starChange);
  const rewards = isWin ? `金币+${state.streak >= 2 ? 2 : 1}，经验+${state.streak >= 2 ? 2 : 1}` : "安慰徽章+1";
  state.tomorrowTip = buildTomorrowTip();

  const resultText = [
    `本局结果：${isWin ? "胜利" : "败北"}`,
    `星星变化：${starChange > 0 ? "+1★" : starChange < 0 ? "-1★" : "保星"}${shieldUsed ? "（今日首次败北触发保星卡）" : ""}`,
    `当前段位：${RANKS[state.rankIndex]} ${state.stars}/${STARS_PER_RANK}★`,
    `连胜状态：${state.streak > 0 ? `连胜 x${state.streak}` : "已中断"}`,
    `掉落奖励：${rewards}`,
    `明天30秒下一步：${state.tomorrowTip}`,
  ].join("\n");

  renderSettlement(resultText, isWin);
  state.history.unshift({
    date: today,
    time: new Date().toLocaleTimeString("zh-CN", { hour12: false }),
    cardName: activeRun?.cardName ?? currentCard?.name ?? "未抽卡",
    loot,
    isWin,
    starChange,
    rank: RANKS[state.rankIndex],
    stars: state.stars,
    streak: state.streak,
  });

  resetRound();
  saveState();
  renderHistory();
}

function applyStars(delta) {
  if (delta === 0) return;
  state.stars += delta;
  if (state.stars >= STARS_PER_RANK) {
    state.stars = 0;
    state.rankIndex = Math.min(RANKS.length - 1, state.rankIndex + 1);
  }
  if (state.stars < 0) {
    if (state.rankIndex > 0) {
      state.rankIndex -= 1;
      state.stars = STARS_PER_RANK - 1;
    } else {
      state.stars = 0;
    }
  }
}

function buildTomorrowTip() {
  const tips = [
    "打开今天的产出文档，补一行数字结果。",
    "打开 LeetCode 收藏夹，先看1题题目再决定做不做。",
    "把今天卡片动作压缩成30秒版本并执行一次。",
    "先写一句‘我现在开始’，然后做30秒热身。",
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

function renderSettlement(text, isWin = null) {
  el.settleResult.textContent = text;
  el.settleResult.classList.remove("muted", "ok", "bad");
  if (isWin === true) el.settleResult.classList.add("ok");
  if (isWin === false) el.settleResult.classList.add("bad");
  if (isWin === null) el.settleResult.classList.add("muted");
  el.saveTomorrowBtn.disabled = !state.tomorrowTip;
  el.saveTomorrowBtn.textContent = "保存“明天30秒下一步”";
}

function renderHistory() {
  if (!state.history.length) {
    el.historyList.innerHTML = "<p class='muted'>暂无战绩</p>";
    return;
  }
  el.historyList.innerHTML = state.history.slice(0, 20).map(h => `
    <article>
      <strong>${h.date} ${h.time}</strong>｜${h.cardName}<br/>
      ${h.isWin ? "胜利" : "败北"}｜星星${h.starChange > 0 ? "+1★" : h.starChange < 0 ? "-1★" : "保星"}｜${h.rank} ${h.stars}/${STARS_PER_RANK}★｜连胜x${h.streak}<br/>
      产出：${h.loot ? [h.loot.text, h.loot.link, h.loot.screenshot, h.loot.file].filter(Boolean).join(" / ") : "无"}
    </article>`).join("");
}

function resetRound() {
  currentCard = null;
  canRedraw = true;
  activeRun = null;
  clearInterval(timerId);
  remainingSec = 600;
  updateTimer(remainingSec);
  el.drawResult.textContent = "尚未抽卡";
  el.drawResult.classList.add("muted");
  el.redrawBtn.disabled = true;
  el.startTimerBtn.disabled = true;
  el.finishEarlyBtn.disabled = true;
  el.abandonBtn.disabled = true;
  el.settleBtn.disabled = true;
}
