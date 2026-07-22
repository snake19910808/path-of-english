// Path of English — 職場劇情與升職系統模組
const Story = {
  // 取得目前主角稱號
  getCurrentTitle(learnedCount) {
    const titles = window.STORY_DATA.titles;
    let current = titles[0];
    for (let t of titles) {
      if (learnedCount >= t.minWords) {
        current = t;
      }
    }
    return current;
  },

  // 取得下一級稱號門檻
  getNextTitle(learnedCount) {
    const titles = window.STORY_DATA.titles;
    for (let t of titles) {
      if (learnedCount < t.minWords) {
        return t;
      }
    }
    return null; // 已達最高級
  },

  render(containerEl) {
    const learnedWords = SRS ? SRS.learnedCount() : 0;
    const currentTitle = this.getCurrentTitle(learnedWords);
    const nextTitle = this.getNextTitle(learnedWords);
    const episodes = window.STORY_DATA.episodes;

    // 計算升職進度條 %
    let progressPercent = 100;
    if (nextTitle) {
      const prevMin = currentTitle.minWords;
      const nextMin = nextTitle.minWords;
      progressPercent = Math.min(100, Math.max(0, Math.round(((learnedWords - prevMin) / (nextMin - prevMin)) * 100)));
    }

    let epListHtml = episodes.map(ep => {
      const isUnlocked = learnedWords >= ep.minWords;
      return `
        <div class="ep-item card ${isUnlocked ? 'unlocked' : 'locked'}" data-id="${ep.id}">
          <div class="ep-head">
            <div class="ep-title">${ep.title}</div>
            <span class="badge ${isUnlocked ? 'badge-good' : 'badge-bad'}">
              ${isUnlocked ? '✅ 閱讀劇情' : `🔒 需掌握 ${ep.minWords} 字`}
            </span>
          </div>
          <p class="ep-summary">${ep.summary}</p>
        </div>`;
    }).join("");

    containerEl.innerHTML = `
      <div class="story-container">
        <!-- 升職卡片 -->
        <div class="card story-hero-card">
          <div class="tag">職場升職系統 💼</div>
          <div class="hero-body">
            <div class="hero-icon">${currentTitle.icon}</div>
            <div class="hero-info">
              <h2>${currentTitle.title}</h2>
              <p class="dim">${currentTitle.desc}</p>
            </div>
          </div>
          <div class="hero-progress">
            <div class="row between text-small">
              <span>升職進度 (Lv.${currentTitle.level})</span>
              <span>${nextTitle ? `距下一級還需 ${nextTitle.minWords - learnedWords} 字` : '最高職場成就！'}</span>
            </div>
            <div class="hp-wrap">
              <div class="hp-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>
        </div>

        <!-- 劇情列表 -->
        <div class="story-episodes">
          <h3 class="section-title">外商生存劇情</h3>
          <div class="ep-list">${epListHtml}</div>
        </div>
      </div>
      <div id="story-modal" class="modal-overlay" style="display:none;"></div>`;

    // 點擊劇情進入閱讀
    containerEl.querySelectorAll(".ep-item.unlocked").forEach(el => {
      el.onclick = () => {
        const epId = el.dataset.id;
        const ep = episodes.find(e => e.id === epId);
        if (ep) {
          this.playEpisodeModal(containerEl, ep);
        }
      };
    });
  },

  playEpisodeModal(containerEl, ep) {
    const modalEl = containerEl.querySelector("#story-modal");

    let messagesHtml = ep.messages.map(msg => `
      <div class="chat-msg ${msg.sender.includes('You') ? 'msg-me' : 'msg-other'}">
        <div class="msg-avatar">${msg.avatar}</div>
        <div class="msg-content">
          <div class="msg-sender">${msg.sender}</div>
          <div class="msg-bubble">
            <div class="msg-en">${msg.text}</div>
            <div class="msg-zh">${msg.zh}</div>
          </div>
        </div>
      </div>`).join("");

    modalEl.innerHTML = `
      <div class="modal-card card story-chat-modal">
        <div class="modal-head between">
          <h3>${ep.title}</h3>
          <button class="btn btn-ghost btn-sm" id="close-chat">✕ 關閉</button>
        </div>
        <div class="teams-chat-body">${messagesHtml}</div>
        <button class="btn btn-primary" id="done-chat">看完劇情，繼續加油！</button>
      </div>`;

    modalEl.style.display = "flex";
    modalEl.querySelector("#close-chat").onclick = () => (modalEl.style.display = "none");
    modalEl.querySelector("#done-chat").onclick = () => (modalEl.style.display = "none");
    modalEl.onclick = (e) => {
      if (e.target === modalEl) modalEl.style.display = "none";
    };

    Sfx.correct();
  }
};
