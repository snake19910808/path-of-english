// Path of English — 核心引擎：儲存 / 間隔重複(SRS) / 語音
"use strict";

/* ---------- 日期工具 ---------- */
const Dates = {
  todayKey(d = new Date()) {
    const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  },
  addDays(key, n) {
    const d = new Date(key + "T00:00:00");
    d.setDate(d.getDate() + n);
    return Dates.todayKey(d);
  },
  // 本週(一~日)的所有日期 key
  weekKeys(d = new Date()) {
    const day = (d.getDay() + 6) % 7; // 週一=0
    const mon = new Date(d); mon.setDate(d.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => {
      const x = new Date(mon); x.setDate(mon.getDate() + i);
      return Dates.todayKey(x);
    });
  }
};

/* ---------- 進度儲存（localStorage） ---------- */
const Store = {
  KEY: "poe_progress_v1",
  _cache: null,
  defaults() {
    return {
      version: 1,
      currentLesson: 0,          // 下一堂要上的課 index
      items: {},                  // 每個單字/句子的 SRS 狀態 { box, due, seen, correct, wrong }
      practiceDays: {},           // { "2026-07-21": {newWords, shadowed, quizTotal, quizCorrect} }
      restCards: { month: "", used: 0 },
      settings: { rate: 0.85, slowRate: 0.65 }
    };
  },
  load() {
    if (this._cache) return this._cache;
    try {
      const raw = localStorage.getItem(this.KEY);
      this._cache = raw ? Object.assign(this.defaults(), JSON.parse(raw)) : this.defaults();
    } catch (e) { this._cache = this.defaults(); }
    return this._cache;
  },
  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this._cache)); } catch (e) { /* 儲存滿載時靜默 */ }
  },
  export() { return JSON.stringify(this.load(), null, 2); }
};

/* ---------- 間隔重複（Leitner 盒） ---------- */
// box 1..5，答對升一盒，答錯回 box1；間隔天數如下
const SRS = {
  INTERVALS: { 1: 1, 2: 2, 3: 4, 4: 7, 5: 15 },
  get(id) {
    const s = Store.load();
    return s.items[id] || null;
  },
  ensure(id) {
    const s = Store.load();
    if (!s.items[id]) {
      s.items[id] = { box: 1, due: Dates.todayKey(), seen: 0, correct: 0, wrong: 0 };
    }
    return s.items[id];
  },
  mark(id, ok) {
    const it = this.ensure(id);
    it.seen++;
    if (ok) {
      it.correct++;
      it.box = Math.min(5, it.box + 1);
    } else {
      it.wrong++;
      it.box = 1;
    }
    it.due = Dates.addDays(Dates.todayKey(), this.INTERVALS[it.box]);
    Store.save();
  },
  dueItems() {
    const s = Store.load(), today = Dates.todayKey();
    return Object.entries(s.items)
      .filter(([, it]) => it.due <= today)
      .map(([id]) => id);
  },
  learnedCount() {
    const s = Store.load();
    return Object.values(s.items).filter(it => it.box >= 2).length;
  },
  totalSeen() { return Object.keys(Store.load().items).length; }
};

/* ---------- Streak（寬容型：週 5 天達標） ---------- */
const Streak = {
  GOAL: 5,
  logToday(stats) {
    const s = Store.load(), key = Dates.todayKey();
    const day = s.practiceDays[key] || { newWords: 0, shadowed: 0, quizTotal: 0, quizCorrect: 0 };
    day.newWords += stats.newWords || 0;
    day.shadowed += stats.shadowed || 0;
    day.quizTotal += stats.quizTotal || 0;
    day.quizCorrect += stats.quizCorrect || 0;
    s.practiceDays[key] = day;
    Store.save();
  },
  thisWeekCount() {
    const s = Store.load();
    return Dates.weekKeys().filter(k => s.practiceDays[k]).length;
  },
  totalDays() { return Object.keys(Store.load().practiceDays).length; }
};

/* ---------- 語音（v0.1 用裝置 TTS；預生成音檔於第二版接入） ---------- */
const Audio2 = {
  _voice: null,
  init() {
    const pick = () => {
      const vs = speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith("en"));
      // 優先 en-US 的 Google/Natural 聲音
      this._voice =
        vs.find(v => v.lang === "en-US" && /Google|Natural/i.test(v.name)) ||
        vs.find(v => v.lang === "en-US") || vs[0] || null;
    };
    pick();
    if (typeof speechSynthesis !== "undefined") {
      speechSynthesis.onvoiceschanged = pick;
    }
  },
  speak(text, { slow = false } = {}) {
    return new Promise(resolve => {
      if (typeof speechSynthesis === "undefined") return resolve();
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const st = Store.load().settings;
      u.lang = "en-US";
      if (this._voice) u.voice = this._voice;
      u.rate = slow ? st.slowRate : st.rate;
      u.onend = resolve; u.onerror = resolve;
      speechSynthesis.speak(u);
    });
  }
};

/* ---------- 錄音（跟讀回放） ---------- */
const Recorder = {
  _stream: null, _rec: null, _chunks: [], lastUrl: null,
  async start() {
    if (!navigator.mediaDevices) throw new Error("此環境不支援錄音");
    this._stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this._chunks = [];
    this._rec = new MediaRecorder(this._stream);
    this._rec.ondataavailable = e => this._chunks.push(e.data);
    this._rec.start();
  },
  stop() {
    return new Promise(resolve => {
      if (!this._rec) return resolve(null);
      this._rec.onstop = () => {
        const blob = new Blob(this._chunks, { type: this._rec.mimeType || "audio/webm" });
        if (this.lastUrl) URL.revokeObjectURL(this.lastUrl);
        this.lastUrl = URL.createObjectURL(blob);
        this._stream.getTracks().forEach(t => t.stop());
        this._rec = null; this._stream = null;
        resolve(this.lastUrl);
      };
      this._rec.stop();
    });
  },
  play() {
    return new Promise(resolve => {
      if (!this.lastUrl) return resolve();
      const a = new Audio(this.lastUrl);
      a.onended = resolve; a.onerror = resolve;
      a.play().catch(resolve);
    });
  }
};

/* ---------- 音效 ---------- */
const Sfx = {
  _ctx: null,
  _beep(freq, dur, type = "sine", gain = 0.08) {
    try {
      this._ctx = this._ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = this._ctx.createOscillator(), g = this._ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.value = gain;
      o.connect(g); g.connect(this._ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, this._ctx.currentTime + dur);
      o.stop(this._ctx.currentTime + dur);
    } catch (e) { /* 無音效環境 */ }
  },
  correct() { this._beep(880, 0.12); setTimeout(() => this._beep(1320, 0.18), 90); },
  wrong() { this._beep(200, 0.25, "square", 0.05); },
  step() { this._beep(660, 0.1, "triangle"); }
};

/* ---------- 課程查詢 ---------- */
const Course = {
  lesson(i) { return window.COURSE.lessons[i] || null; },
  count() { return window.COURSE.lessons.length; },
  // 從所有課程找出某個 id 的內容（複習題用）
  findItem(id) {
    for (const l of window.COURSE.lessons) {
      for (const w of l.words) if (w.en === id) return { type: "word", ...w };
      for (const p of l.phrases) if (p.en === id) return { type: "phrase", ...p };
    }
    return null;
  },
  // 目前已學到的所有單字（出干擾選項用）
  wordsUpTo(lessonIdx) {
    const out = [];
    window.COURSE.lessons.slice(0, lessonIdx + 1).forEach(l => out.push(...l.words));
    return out;
  }
};
