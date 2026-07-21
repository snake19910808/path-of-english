// Path of English — 主程式：畫面與每日訓練循環
"use strict";

const $app = () => document.getElementById("app");
const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; };
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const App = {
  /* ================= 主畫面 ================= */
  renderHome() {
    const s = Store.load();
    const lessonIdx = s.currentLesson;
    const lesson = Course.lesson(lessonIdx);
    const week = Streak.thisWeekCount();
    const due = SRS.dueItems().length;
    const doneToday = !!s.practiceDays[Dates.todayKey()];

    $app().innerHTML = `
      <div class="home">
        <header class="home-head">
          <div class="logo">⚔️ Path of English</div>
          <div class="sub">你的英語之路 · 第一章</div>
        </header>

        <section class="panel stats-row">
          <div class="stat"><div class="stat-num">${SRS.learnedCount()}</div><div class="stat-label">已學會單字</div></div>
          <div class="stat"><div class="stat-num">${Streak.totalDays()}</div><div class="stat-label">累積練習天</div></div>
          <div class="stat"><div class="stat-num">${due}</div><div class="stat-label">今日待複習</div></div>
        </section>

        <section class="panel">
          <div class="panel-title">🔥 本週目標</div>
          <div class="week-bar">
            ${Array.from({ length: 7 }, (_, i) => {
              const k = Dates.weekKeys()[i];
              const hit = !!s.practiceDays[k];
              const isToday = k === Dates.todayKey();
              return `<div class="day-dot ${hit ? "hit" : ""} ${isToday ? "today" : ""}">${"一二三四五六日"[i]}</div>`;
            }).join("")}
          </div>
          <div class="week-note">本週已練 <b>${week}</b> / ${Streak.GOAL} 天${week >= Streak.GOAL ? " — 本週達標！🏆" : ""}</div>
        </section>

        <section class="panel">
          <div class="panel-title">📖 ${doneToday ? "今日已完成訓練" : "今晚的任務"}</div>
          ${lesson
            ? `<div class="lesson-preview"><b>${lesson.title}</b><br><span class="dim">${lesson.intro}</span></div>`
            : `<div class="lesson-preview">第一章全部完成！🎉 目前每天做複習維持記憶，第二章教材即將更新。</div>`}
        </section>

        <div class="bottom-bar">
          <button class="btn btn-ghost" id="btnSettings">⚙️</button>
          <button class="btn btn-primary btn-big" id="btnStart">${doneToday ? "再練一輪 💪" : "開始今日訓練 ▶"}</button>
        </div>
        <div class="version">v0.1.0 MVP</div>
      </div>`;

    document.getElementById("btnStart").onclick = () => Session.start();
    document.getElementById("btnSettings").onclick = () => App.renderSettings();
  },

  /* ================= 設定 ================= */
  renderSettings() {
    const st = Store.load().settings;
    $app().innerHTML = `
      <div class="home">
        <header class="home-head"><div class="logo">⚙️ 設定</div></header>
        <section class="panel">
          <div class="panel-title">🔊 語音速度</div>
          <label class="dim">正常語速：<span id="rateVal">${st.rate}</span></label>
          <input type="range" id="rate" min="0.6" max="1.1" step="0.05" value="${st.rate}">
          <label class="dim">慢速（🐢）：<span id="slowVal">${st.slowRate}</span></label>
          <input type="range" id="slow" min="0.4" max="0.9" step="0.05" value="${st.slowRate}">
          <button class="btn btn-ghost" id="btnTest">試聽 "Good morning."</button>
        </section>
        <section class="panel">
          <div class="panel-title">💾 進度備份</div>
          <p class="dim">下載你的完整學習進度檔，可傳到雲端硬碟或 LINE 保存。換手機時匯入即可還原。</p>
          <div class="row">
            <button class="btn btn-ghost" id="btnExport">⬇ 匯出備份</button>
            <button class="btn btn-ghost" id="btnImport">⬆ 匯入備份</button>
            <input type="file" id="importFile" accept=".json" hidden>
          </div>
        </section>
        <div class="bottom-bar"><button class="btn btn-primary btn-big" id="btnBack">回主畫面</button></div>
      </div>`;

    const st2 = Store.load().settings;
    document.getElementById("rate").oninput = (e) => { st2.rate = +e.target.value; document.getElementById("rateVal").textContent = st2.rate; Store.save(); };
    document.getElementById("slow").oninput = (e) => { st2.slowRate = +e.target.value; document.getElementById("slowVal").textContent = st2.slowRate; Store.save(); };
    document.getElementById("btnTest").onclick = () => Audio2.speak("Good morning.");
    document.getElementById("btnExport").onclick = () => {
      const blob = new Blob([Store.export()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `path-of-english-backup-${Dates.todayKey()}.json`;
      a.click();
    };
    document.getElementById("btnImport").onclick = () => document.getElementById("importFile").click();
    document.getElementById("importFile").onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const data = JSON.parse(r.result);
          if (!data.items) throw new Error("格式不符");
          Store._cache = Object.assign(Store.defaults(), data);
          Store.save();
          alert("進度已還原！");
          App.renderHome();
        } catch (err) { alert("匯入失敗：檔案格式不正確"); }
      };
      r.readAsText(f);
    };
    document.getElementById("btnBack").onclick = () => App.renderHome();
  }
};

/* ================= 每日訓練循環 ================= */
const Session = {
  steps: [], idx: 0,
  stats: null, wrongIds: null, lesson: null, isReviewOnly: false,

  start() {
    const s = Store.load();
    this.lesson = Course.lesson(s.currentLesson);
    this.isReviewOnly = !this.lesson;
    this.stats = { newWords: 0, shadowed: 0, quizTotal: 0, quizCorrect: 0, reviewed: 0 };
    this.wrongIds = new Set();

    this.steps = [];
    if (SRS.dueItems().length) this.steps.push({ name: "暖身複習", run: () => this.stepReview() });
    if (this.lesson) {
      this.steps.push({ name: "發音規則", run: () => this.stepPhonics() });
      this.steps.push({ name: "拼讀單字", run: () => this.stepWords() });
      this.steps.push({ name: "句子跟讀", run: () => this.stepPhrases() });
      this.steps.push({ name: "提取測驗", run: () => this.stepQuiz() });
      this.steps.push({ name: "錯題加強", run: () => this.stepWrong() });
    }
    this.steps.push({ name: "今日成果", run: () => this.stepSummary() });

    this.idx = 0;
    this.runStep();
  },

  runStep() {
    if (this.idx >= this.steps.length) return App.renderHome();
    Sfx.step();
    this.steps[this.idx].run();
  },
  next() { this.idx++; this.runStep(); },

  // 每步驟共用外框（含進度條與跳過鈕）
  frame(bodyHtml, { showSkip = true } = {}) {
    const pct = Math.round((this.idx / this.steps.length) * 100);
    $app().innerHTML = `
      <div class="session">
        <div class="top-bar">
          <div class="hp-wrap"><div class="hp" style="width:${pct}%"></div></div>
          <div class="step-label">${this.steps[this.idx].name}（${this.idx + 1}/${this.steps.length}）
            ${showSkip ? `<button class="skip" id="btnSkip">跳過 ›</button>` : ""}
          </div>
        </div>
        <div class="session-body" id="body">${bodyHtml}</div>
      </div>`;
    const sk = document.getElementById("btnSkip");
    if (sk) sk.onclick = () => this.next();
    return document.getElementById("body");
  },

  /* ---------- 1. 暖身複習 ---------- */
  stepReview() {
    const due = shuffle(SRS.dueItems()).slice(0, 20);
    let qIdx = 0;
    const askNext = () => {
      if (qIdx >= due.length) return this.next();
      const id = due[qIdx++];
      const item = Course.findItem(id);
      if (!item) return askNext();
      this.stats.reviewed++;
      Quiz.mcq(this, item, (ok) => { SRS.mark(id, ok); if (!ok) this.wrongIds.add(id); setTimeout(askNext, ok ? 700 : 1600); },
        `複習 ${qIdx}/${due.length}`);
    };
    askNext();
  },

  /* ---------- 2. 發音規則 ---------- */
  stepPhonics() {
    const cards = this.lesson.phonics;
    let i = 0;
    const show = () => {
      if (i >= cards.length) return this.next();
      const c = cards[i];
      const body = this.frame(`
        <div class="card">
          <div class="tag">新聲音 ${i + 1}/${cards.length}</div>
          <div class="big-letter">${c.letter}</div>
          <div class="sound-label">聲音：/${c.sound}/</div>
          <p class="tip">💡 ${c.tip}</p>
          <div class="example dim">範例字：<b>${c.example}</b></div>
          <div class="row center">
            <button class="btn btn-ghost" id="p1">🔊 聽</button>
            <button class="btn btn-ghost" id="p2">🐢 慢速</button>
            <button class="btn btn-ghost" id="p3">🔊 範例字</button>
          </div>
        </div>
        <div class="bottom-bar"><button class="btn btn-primary btn-big" id="nx">跟著唸 3 次，下一個 →</button></div>`);
      body.querySelector("#p1").onclick = () => Audio2.speak(c.letter === "a" || c.letter === "e" || c.letter === "i" || c.letter === "o" || c.letter === "u" ? c.example : c.letter);
      body.querySelector("#p2").onclick = () => Audio2.speak(c.example, { slow: true });
      body.querySelector("#p3").onclick = () => Audio2.speak(c.example);
      body.querySelector("#nx").onclick = () => { i++; show(); };
      Audio2.speak(c.example);
    };
    show();
  },

  /* ---------- 3. 拼讀單字（含跟讀錄音） ---------- */
  stepWords() {
    const words = this.lesson.words;
    let i = 0;
    const show = () => {
      if (i >= words.length) return this.next();
      const w = words[i];
      SRS.ensure(w.en); // 進入學習系統，明天開始複習
      const it = SRS.get(w.en); it.due = Dates.addDays(Dates.todayKey(), 1); Store.save();
      this.stats.newWords++;
      Shadow.card(this, { en: w.en, zh: w.zh, tag: `新單字 ${i + 1}/${words.length}` }, () => { i++; show(); });
    };
    show();
  },

  /* ---------- 4. 句子跟讀 ---------- */
  stepPhrases() {
    const ph = this.lesson.phrases;
    let i = 0;
    const show = () => {
      if (i >= ph.length) return this.next();
      const p = ph[i];
      SRS.ensure(p.en);
      const it = SRS.get(p.en); it.due = Dates.addDays(Dates.todayKey(), 1); Store.save();
      Shadow.card(this, { en: p.en, zh: p.zh, tag: `今日短句 ${i + 1}/${ph.length}` }, () => { i++; show(); });
    };
    show();
  },

  /* ---------- 5. 提取測驗 ---------- */
  stepQuiz() {
    const words = this.lesson.words;
    // 題目組：每字一題選擇 + 一題拼字磚；抽 3 字做「開口說」
    const tasks = [];
    shuffle(words).forEach(w => tasks.push({ type: "mcq", w }));
    shuffle(words).forEach(w => tasks.push({ type: "tiles", w }));
    shuffle(words).slice(0, 3).forEach(w => tasks.push({ type: "say", w }));

    let i = 0;
    const askNext = () => {
      if (i >= tasks.length) return this.next();
      const t = tasks[i++];
      const done = (ok) => {
        this.stats.quizTotal++;
        if (ok) this.stats.quizCorrect++; else this.wrongIds.add(t.w.en);
        SRS.mark(t.w.en, ok);
        setTimeout(askNext, ok ? 700 : 1600);
      };
      const label = `測驗 ${i}/${tasks.length}`;
      if (t.type === "mcq") Quiz.mcq(this, { ...t.w, type: "word" }, done, label);
      else if (t.type === "tiles") Quiz.tiles(this, t.w, done, label);
      else Quiz.sayIt(this, t.w, done, label);
    };
    askNext();
  },

  /* ---------- 6. 錯題加強 ---------- */
  stepWrong() {
    const ids = Array.from(this.wrongIds);
    if (!ids.length) return this.next();
    let i = 0;
    const askNext = () => {
      if (i >= ids.length) return this.next();
      const item = Course.findItem(ids[i++]);
      if (!item) return askNext();
      Quiz.mcq(this, item, (ok) => setTimeout(askNext, ok ? 700 : 1600), `錯題加強 ${i}/${ids.length}`);
    };
    askNext();
  },

  /* ---------- 7. 今日成果 ---------- */
  stepSummary() {
    const st = this.stats;
    const acc = st.quizTotal ? Math.round((st.quizCorrect / st.quizTotal) * 100) : null;
    Streak.logToday(st);

    const s = Store.load();
    if (this.lesson && !this.isReviewOnly) s.currentLesson++;
    Store.save();

    const nextLesson = Course.lesson(s.currentLesson);
    const week = Streak.thisWeekCount();

    this.frame(`
      <div class="card summary">
        <div class="tag gold">🏆 今日成果</div>
        <div class="sum-grid">
          ${st.newWords ? `<div class="sum-item"><b>${st.newWords}</b><span>新單字入庫</span></div>` : ""}
          ${st.shadowed ? `<div class="sum-item"><b>${st.shadowed}</b><span>句/字跟讀完成</span></div>` : ""}
          ${st.reviewed ? `<div class="sum-item"><b>${st.reviewed}</b><span>舊字複習</span></div>` : ""}
          ${acc !== null ? `<div class="sum-item"><b>${acc}%</b><span>測驗正確率</span></div>` : ""}
        </div>
        <div class="week-note">🔥 本週已練 <b>${week}</b>/${Streak.GOAL} 天${week >= Streak.GOAL ? " — 達標！" : ""}</div>
        ${nextLesson ? `
          <div class="teaser">
            <div class="panel-title">📺 下集預告</div>
            <b>${nextLesson.title}</b><br>
            <span class="dim">${nextLesson.intro}</span>
          </div>` : `<div class="teaser">🎉 第一章完結！新章節即將上線，這幾天持續複習保持手感。</div>`}
      </div>
      <div class="bottom-bar"><button class="btn btn-primary btn-big" id="nx">收工，明天見 👋</button></div>`,
      { showSkip: false });
    document.getElementById("nx").onclick = () => App.renderHome();
  }
};

/* ================= 跟讀卡（聽 → 錄 → 對比） ================= */
const Shadow = {
  card(session, { en, zh, tag }, onDone) {
    const body = session.frame(`
      <div class="card">
        <div class="tag">${tag}</div>
        <div class="big-word">${en}</div>
        <div class="zh">${zh}</div>
        <div class="row center">
          <button class="btn btn-ghost" id="p1">🔊 聽</button>
          <button class="btn btn-ghost" id="p2">🐢 慢速</button>
        </div>
        <div class="rec-zone">
          <button class="btn btn-rec" id="rec">🎙️ 按住跟讀</button>
          <div class="rec-hint dim" id="hint">聽完原音 → 按住按鈕開口模仿 → 放開自動對比</div>
        </div>
      </div>
      <div class="bottom-bar"><button class="btn btn-primary btn-big" id="nx">下一個 →</button></div>`);

    body.querySelector("#p1").onclick = () => Audio2.speak(en);
    body.querySelector("#p2").onclick = () => Audio2.speak(en, { slow: true });
    body.querySelector("#nx").onclick = () => { session.stats.shadowed++; onDone(); };

    const btn = body.querySelector("#rec"), hint = body.querySelector("#hint");
    let recording = false;
    const startRec = async (e) => {
      e.preventDefault();
      if (recording) return;
      try {
        await Recorder.start();
        recording = true;
        btn.classList.add("recording");
        btn.textContent = "⏺ 錄音中…放開結束";
      } catch (err) {
        hint.textContent = "⚠️ 無法使用麥克風（請允許權限）。先用「聽→跟唸」也可以。";
      }
    };
    const stopRec = async (e) => {
      e.preventDefault();
      if (!recording) return;
      recording = false;
      btn.classList.remove("recording");
      btn.textContent = "🎙️ 按住跟讀";
      await Recorder.stop();
      hint.textContent = "▶ 自動對比：原音 → 你的聲音";
      await Audio2.speak(en);
      await Recorder.play();
      hint.textContent = "差在哪？再錄一次，或前進下一個。";
    };
    btn.addEventListener("pointerdown", startRec);
    btn.addEventListener("pointerup", stopRec);
    btn.addEventListener("pointerleave", (e) => recording && stopRec(e));

    Audio2.speak(en);
  }
};

/* ================= 題型 ================= */
const Quiz = {
  /* 選擇題：看中文＋聽音 → 選英文 */
  mcq(session, item, onDone, label) {
    const s = Store.load();
    const pool = Course.wordsUpTo(Math.max(0, s.currentLesson)).filter(w => w.en !== item.en);
    const opts = shuffle([item.en, ...shuffle(pool).slice(0, 3).map(w => w.en)]);
    const body = session.frame(`
      <div class="card">
        <div class="tag">${label}</div>
        <div class="quiz-q">
          <div class="zh big-zh">${item.zh}</div>
          <button class="btn btn-ghost" id="p1">🔊 再聽一次</button>
        </div>
        <div class="options">
          ${opts.map(o => `<button class="btn btn-opt" data-v="${o}">${o}</button>`).join("")}
        </div>
        <div class="feedback" id="fb"></div>
      </div>`);
    body.querySelector("#p1").onclick = () => Audio2.speak(item.en);
    Audio2.speak(item.en);

    let answered = false;
    body.querySelectorAll(".btn-opt").forEach(b => {
      b.onclick = () => {
        if (answered) return;
        answered = true;
        const ok = b.dataset.v === item.en;
        b.classList.add(ok ? "right" : "wrong");
        if (!ok) {
          body.querySelector(`[data-v="${item.en}"]`).classList.add("right");
          body.querySelector("#fb").textContent = `正確答案：${item.en}`;
          Sfx.wrong();
        } else { Sfx.correct(); }
        onDone(ok);
      };
    });
  },

  /* 拼字磚：看中文＋聽音 → 點字母磚拼出單字（含提示梯） */
  tiles(session, w, onDone, label) {
    const decoys = shuffle("bcdfghjklmnprstvwz".split("").filter(c => !w.en.includes(c))).slice(0, 2);
    const tiles = shuffle([...w.en.split(""), ...decoys]);
    let typed = "", hinted = false, answered = false;

    const body = session.frame(`
      <div class="card">
        <div class="tag">${label} · 拼字</div>
        <div class="quiz-q">
          <div class="zh big-zh">${w.zh}</div>
          <button class="btn btn-ghost" id="p1">🔊 聽發音</button>
        </div>
        <div class="slots" id="slots"></div>
        <div class="tiles" id="tiles">
          ${tiles.map((c, i) => `<button class="tile" data-i="${i}" data-c="${c}">${c}</button>`).join("")}
        </div>
        <div class="row center">
          <button class="btn btn-ghost" id="del">⌫ 刪除</button>
          <button class="btn btn-ghost" id="hintBtn">💡 提示</button>
          <button class="btn btn-primary" id="chk">確認</button>
        </div>
        <div class="feedback" id="fb"></div>
      </div>`);

    const slots = body.querySelector("#slots"), fb = body.querySelector("#fb");
    const renderSlots = () => {
      slots.innerHTML = w.en.split("").map((_, i) =>
        `<div class="slot ${typed[i] ? "filled" : ""}">${typed[i] || ""}</div>`).join("");
    };
    renderSlots();
    body.querySelector("#p1").onclick = () => Audio2.speak(w.en);
    Audio2.speak(w.en);

    body.querySelectorAll(".tile").forEach(t => {
      t.onclick = () => {
        if (answered || typed.length >= w.en.length || t.disabled) return;
        typed += t.dataset.c;
        t.disabled = true;
        renderSlots();
      };
    });
    body.querySelector("#del").onclick = () => {
      if (answered || !typed) return;
      const c = typed[typed.length - 1];
      typed = typed.slice(0, -1);
      const t = Array.from(body.querySelectorAll(".tile")).find(x => x.disabled && x.dataset.c === c);
      if (t) t.disabled = false;
      renderSlots();
    };
    body.querySelector("#hintBtn").onclick = () => {
      if (hinted || answered) return;
      hinted = true;
      fb.textContent = `提示：開頭是「${w.en[0]}」`;
    };
    body.querySelector("#chk").onclick = () => {
      if (answered) return;
      if (typed.length < w.en.length) { fb.textContent = "還沒拼完喔"; return; }
      if (typed === w.en) {
        answered = true;
        slots.classList.add("all-right");
        Sfx.correct();
        onDone(true);
      } else if (!hinted) {
        // 提示梯：第一次錯 → 給提示再試
        hinted = true;
        Sfx.wrong();
        fb.textContent = `再試一次！提示：開頭是「${w.en[0]}」`;
        typed = "";
        body.querySelectorAll(".tile").forEach(t => (t.disabled = false));
        renderSlots();
      } else {
        answered = true;
        Sfx.wrong();
        fb.textContent = `正確拼法：${w.en}`;
        typed = w.en; renderSlots();
        onDone(false);
      }
    };
  },

  /* 開口說（不限時版）：看中文 → 開口 → 自我核對 */
  sayIt(session, w, onDone, label) {
    const body = session.frame(`
      <div class="card">
        <div class="tag">${label} · 開口說 🗣️</div>
        <div class="quiz-q">
          <div class="zh big-zh">${w.zh}</div>
          <p class="dim">不限時。在腦中找到這個英文字，<b>大聲說出來</b>，然後掀開答案核對。</p>
        </div>
        <button class="btn btn-primary btn-big" id="reveal">我說出來了，掀開答案</button>
        <div class="reveal-zone" id="rz" hidden>
          <div class="big-word">${w.en}</div>
          <button class="btn btn-ghost" id="p1">🔊 聽正確發音</button>
          <div class="row center">
            <button class="btn btn-good" id="yes">✅ 我說對了</button>
            <button class="btn btn-bad" id="no">❌ 沒說出來</button>
          </div>
        </div>
      </div>`);
    body.querySelector("#reveal").onclick = (e) => {
      e.target.hidden = true;
      body.querySelector("#rz").hidden = false;
      Audio2.speak(w.en);
    };
    body.querySelector("#p1").onclick = () => Audio2.speak(w.en);
    body.querySelector("#yes").onclick = () => { Sfx.correct(); onDone(true); };
    body.querySelector("#no").onclick = () => { Sfx.wrong(); onDone(false); };
  }
};

/* ================= 啟動 ================= */
window.addEventListener("DOMContentLoaded", () => {
  Audio2.init();
  App.renderHome();
});
