// Path of English — PoE 風格星空天賦樹模組
const SkillTree = {
  nodes: [
    { id: "core", title: "聲音覺醒 (Core)", branch: "core", icon: "🌌", x: 50, y: 15, reqWords: 0, desc: "開啟 Path of English 英語天賦之路，掌握聲音發音規則。" },
    
    // 🔊 聽力辨識分支 (Left)
    { id: "l1", parent: "core", title: "短母音聽覺", branch: "listening", icon: "🎧", x: 25, y: 35, reqWords: 10, desc: "建立短母音 (a/i/o/e/u) 的敏銳聽力耳。" },
    { id: "l2", parent: "l1", title: "慢速原音對比", branch: "listening", icon: "🔊", x: 18, y: 55, reqWords: 30, desc: "解鎖錄音對比與 0.7x 慢速聽力發音調校。" },
    { id: "l3", parent: "l2", title: "雙聲線辨音", branch: "listening", icon: "👂", x: 15, y: 75, reqWords: 60, desc: "掌握 sh/ch/th 雙字母組合的精準聽力辨識。" },
    { id: "l4", parent: "l3", title: "職場會議耳", branch: "listening", icon: "📡", x: 12, y: 92, reqWords: 100, desc: "解鎖外商職場情境對話聽力理解。" },

    // 🗣️ 口說提取分支 (Right)
    { id: "s1", parent: "core", title: "單音跟讀模仿", branch: "speaking", icon: "🗣️", x: 75, y: 35, reqWords: 10, desc: "第一天即開口，聽了立刻模仿正確發音。" },
    { id: "s2", parent: "s1", title: "主動檢索說出", branch: "speaking", icon: "🧠", x: 82, y: 55, reqWords: 30, desc: "看中文能在腦中檢索並大聲說出對應單字。" },
    { id: "s3", parent: "s2", title: "限時反應口說", branch: "speaking", icon: "⏱️", x: 85, y: 75, reqWords: 60, desc: "在 5 秒計時收緊下精準提取正確英文字句。" },
    { id: "s4", parent: "s3", title: "職場口說實戰", branch: "speaking", icon: "🎙️", x: 88, y: 92, reqWords: 100, desc: "具備外商簡短對話與 Teams 回覆的發音自信。" },

    // 🔤 字彙鍛造分支 (Center)
    { id: "v1", parent: "core", title: "基礎字母發音", branch: "vocab", icon: "🔤", x: 50, y: 40, reqWords: 20, desc: "掌握首批 19 個基礎字母聲音規則。" },
    { id: "v2", parent: "v1", title: "26字母全解鎖", branch: "vocab", icon: "✨", x: 50, y: 60, reqWords: 50, desc: "解鎖包含 j/v/w/x/y/z 在內的 26 字母完整拼音。" },
    { id: "v3", parent: "v2", title: "組合音寶庫", branch: "vocab", icon: "💎", x: 50, y: 78, reqWords: 80, desc: "精通 sh/ch/th/ck/ing 等職場關鍵組合字彙。" },
    { id: "v4", parent: "v3", title: "百字成就榮耀", branch: "vocab", icon: "👑", x: 50, y: 95, reqWords: 103, desc: "達成第一章 103 高頻單字完全掌握！" }
  ],

  render(containerEl) {
    const learnedWords = SRS ? SRS.learnedCount() : 0;

    // 計算各節點解鎖狀態
    const nodesStatus = this.nodes.map(n => {
      const isUnlocked = learnedWords >= n.reqWords;
      return { ...n, isUnlocked };
    });

    // 繪製 SVG 連接線
    let svgLinesHtml = "";
    nodesStatus.forEach(n => {
      if (n.parent) {
        const parentNode = nodesStatus.find(p => p.id === n.parent);
        if (parentNode) {
          const isLineActive = parentNode.isUnlocked && n.isUnlocked;
          svgLinesHtml += `
            <line 
              x1="${parentNode.x}%" y1="${parentNode.y}%" 
              x2="${n.x}%" y2="${n.y}%" 
              class="tree-line ${isLineActive ? 'active' : ''}" 
            />`;
        }
      }
    });

    // 繪製節點 HTML
    let nodesHtml = nodesStatus.map(n => {
      return `
        <div 
          class="tree-node ${n.branch} ${n.isUnlocked ? 'unlocked' : 'locked'}" 
          style="left: ${n.x}%; top: ${n.y}%;"
          data-id="${n.id}"
          title="${n.title}"
        >
          <div class="node-icon">${n.icon}</div>
          <div class="node-label">${n.title}</div>
        </div>`;
    }).join("");

    containerEl.innerHTML = `
      <div class="skilltree-card card">
        <div class="skilltree-header">
          <div class="tag">PoE 星空天賦樹 🌌</div>
          <div class="st-stats-bar">
            <span>掌握單字：<b class="gold-text">${learnedWords}</b> / 103</span>
            <span>已點亮節點：<b class="gold-text">${nodesStatus.filter(n => n.isUnlocked).length}</b> / ${this.nodes.length}</span>
          </div>
        </div>
        <div class="skilltree-viewport">
          <svg class="tree-svg">${svgLinesHtml}</svg>
          <div class="tree-nodes-wrap">${nodesHtml}</div>
        </div>
      </div>
      <div id="st-modal" class="modal-overlay" style="display:none;"></div>`;

    // 繫結點擊事件
    containerEl.querySelectorAll(".tree-node").forEach(el => {
      el.onclick = () => {
        const nodeId = el.dataset.id;
        const targetNode = nodesStatus.find(n => n.id === nodeId);
        if (targetNode) {
          this.showNodeModal(containerEl, targetNode, learnedWords);
        }
      };
    });
  },

  showNodeModal(containerEl, node, currentWords) {
    const modalEl = containerEl.querySelector("#st-modal");
    const isUnlocked = currentWords >= node.reqWords;

    modalEl.innerHTML = `
      <div class="modal-card card">
        <div class="modal-head">
          <span class="modal-icon">${node.icon}</span>
          <h3>${node.title}</h3>
        </div>
        <p class="modal-desc">${node.desc}</p>
        <div class="modal-req">
          <span>解鎖門檻：掌握 <b>${node.reqWords}</b> 個單字</span>
          <span class="badge ${isUnlocked ? 'badge-good' : 'badge-bad'}">
            ${isUnlocked ? '✅ 已點亮天賦' : `🔒 尚差 ${node.reqWords - currentWords} 字`}
          </span>
        </div>
        <button class="btn btn-primary" id="close-modal">確定</button>
      </div>`;

    modalEl.style.display = "flex";
    modalEl.querySelector("#close-modal").onclick = () => {
      modalEl.style.display = "none";
    };
    modalEl.onclick = (e) => {
      if (e.target === modalEl) modalEl.style.display = "none";
    };
    Sfx.correct();
  }
};
