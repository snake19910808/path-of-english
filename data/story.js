// Path of English — 職場劇情與升職系統資料
window.STORY_DATA = {
  titles: [
    { level: 1, title: "外商實習助理", minWords: 0, icon: "🌱", desc: "剛進入外商公司的台灣新人，正在熟悉基礎音標與發音。" },
    { level: 2, title: "倉儲物料助理", minWords: 20, icon: "📦", desc: "掌握基礎單字，能夠辨識倉庫箱子與物品標籤。" },
    { level: 3, title: "硬體測試專員", minWords: 50, icon: "🛠️", desc: "能看懂測試工具與清單，支援硬體樣品測試與報表核對。" },
    { level: 4, title: "資深物料與測試組長", minWords: 80, icon: "⚡", desc: "熟練掌握職場高頻字彙，能在 Teams 上進行簡短英文對話。" },
    { level: 5, title: "外商資深專案主管", minWords: 100, icon: "👑", desc: "解鎖第一章全音標與百字寶庫，能夠流利回應會議與日常派工！" }
  ],

  episodes: [
    {
      id: "ep1",
      title: "Ep.1 報到第一天",
      minLevel: 1,
      minWords: 0,
      summary: "剛進外商公司第一天，在 Teams 上收到主管與同仁的英文打招呼訊息。",
      messages: [
        { sender: "Mark (主管)", avatar: "👨‍💼", text: "Hi! Welcome to the team.", zh: "嗨！歡迎加入我們的團隊。" },
        { sender: "You (你)", avatar: "🧑‍💻", text: "Good morning! Thank you.", zh: "早安！謝謝你。" },
        { sender: "Mark (主管)", avatar: "👨‍💼", text: "No problem. Are you ready?", zh: "不客氣。準備好了嗎？" },
        { sender: "You (你)", avatar: "🧑‍💻", text: "Yes! Let's go!", zh: "是的！我們走吧！" }
      ]
    },
    {
      id: "ep2",
      title: "Ep.2 倉庫的第一批包裹",
      minLevel: 2,
      minWords: 20,
      summary: "收到第一批進口物料箱，主管請你確認標籤與包裝狀況。",
      messages: [
        { sender: "Sarah (物流)", avatar: "👩‍💼", text: "Hi, can you check this box?", zh: "嗨，你能檢查這個箱子嗎？" },
        { sender: "You (你)", avatar: "🧑‍💻", text: "OK. I can do it.", zh: "好的，我做得到。" },
        { sender: "Sarah (物流)", avatar: "👩‍💼", text: "Is it a big bag or a box?", zh: "這是一個大袋子還是一個箱子？" },
        { sender: "You (你)", avatar: "🧑‍💻", text: "It is a big box on the mat.", zh: "這是一個在墊子上的大箱子。" },
        { sender: "Sarah (物流)", avatar: "👩‍💼", text: "Good job!", zh: "做得好！" }
      ]
    },
    {
      id: "ep3",
      title: "Ep.3 緊急料號核對",
      minLevel: 3,
      minWords: 50,
      summary: "貨車送來緊急測試零件，需要在 Teams 上向主管回報出貨狀態。",
      messages: [
        { sender: "Mark (主管)", avatar: "👨‍💼", text: "Did the van arrive?", zh: "客貨車到達了嗎？" },
        { sender: "You (你)", avatar: "🧑‍💻", text: "Yes! I got the pack.", zh: "是的！我拿到包裹了。" },
        { sender: "Mark (主管)", avatar: "👨‍💼", text: "Check this out. Is the chip in the box?", zh: "看看這個。晶片在箱子裡嗎？" },
        { sender: "You (你)", avatar: "🧑‍💻", text: "Yes, I see the red chip.", zh: "是的，我有看到紅色的晶片。" },
        { sender: "Mark (主管)", avatar: "👨‍💼", text: "Great! Show me the test report.", zh: "太棒了！秀測試報告給我看。" }
      ]
    },
    {
      id: "ep4",
      title: "Ep.4 硬體測試支援",
      minLevel: 4,
      minWords: 80,
      summary: "樣品出現問題，協助測試工程師核對產品小提示與設定。",
      messages: [
        { sender: "Alex (工程師)", avatar: "👷", text: "We have a problem with the kit.", zh: "我們的工具組遇到了問題。" },
        { sender: "You (你)", avatar: "🧑‍💻", text: "Let me check the lock.", zh: "讓我檢查一下鎖。" },
        { sender: "Alex (工程師)", avatar: "👷", text: "Good idea. Thank you very much.", zh: "好主意，非常感謝你。" },
        { sender: "You (你)", avatar: "🧑‍💻", text: "No problem. Hold on.", zh: "沒問題，請稍等一下。" }
      ]
    },
    {
      id: "ep5",
      title: "Ep.5 首次英文會議短簡報",
      minLevel: 5,
      minWords: 100,
      summary: "解鎖第一章全發音與 100 高頻字！在晨會中向團隊順利完成簡短報告。",
      messages: [
        { sender: "Mark (主管)", avatar: "👨‍💼", text: "Nice work this week!", zh: "這週工作表現太棒了！" },
        { sender: "You (你)", avatar: "🧑‍💻", text: "Thank you. I think we can win this job.", zh: "謝謝你。我相信我們能拿下這個任務。" },
        { sender: "Team (團隊)", avatar: "👏", text: "Have fun! See you!", zh: "太讚了！再見！" }
      ]
    }
  ]
};
