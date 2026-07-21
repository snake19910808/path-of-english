// Path of English — 教材資料 Ch.1 自然發音基礎
// 結構：每課 = 發音規則(phonics) + 拼讀單字(words) + 跟讀短句(phrases)
// 單字全部只用「已學過的字母發音」組成，學了規則立刻能拼讀
window.COURSE = {
  chapter: 1,
  title: "第一章：聲音的規則",
  lessons: [
    {
      id: "c1l1",
      title: "s · a · t · p",
      intro: "今天認識 4 個字母的「聲音」。英文字母有名字（A=欸）也有聲音（a=æ），拼字時用的是聲音。",
      phonics: [
        { letter: "s", sound: "ss", tip: "像蛇的嘶嘶聲「ㄙ~」，牙齒輕碰、吹氣，喉嚨不出聲。", example: "sun" },
        { letter: "a", sound: "æ", tip: "嘴巴張大像咬蘋果，短促地說「ㄝ+ㄚ」之間的音。", example: "apple" },
        { letter: "t", sound: "t", tip: "舌尖彈上排牙齦後方，短促「ㄊ」，不拖尾音。", example: "top" },
        { letter: "p", sound: "p", tip: "雙唇閉住再爆開「ㄆ」，手掌放嘴前能感覺到氣。", example: "pen" }
      ],
      words: [
        { en: "at", zh: "在（某處）" },
        { en: "sat", zh: "坐（過去式）" },
        { en: "pat", zh: "輕拍" },
        { en: "tap", zh: "輕敲；水龍頭" },
        { en: "sap", zh: "樹液" }
      ],
      phrases: [
        { en: "Hi!", zh: "嗨！" },
        { en: "Good morning.", zh: "早安。" }
      ]
    },
    {
      id: "c1l2",
      title: "i · n",
      intro: "加入 2 個新聲音，你能拼的字馬上變多。注意：學過的字母會一直回來複習。",
      phonics: [
        { letter: "i", sound: "ɪ", tip: "短促的「一」，嘴巴放鬆不用力，比中文的「一」更短。", example: "in" },
        { letter: "n", sound: "n", tip: "舌尖頂上牙齦，鼻子出聲「ㄋ~」，捏住鼻子會發不出來。", example: "net" }
      ],
      words: [
        { en: "it", zh: "它" },
        { en: "in", zh: "在裡面" },
        { en: "sit", zh: "坐" },
        { en: "pin", zh: "別針" },
        { en: "tin", zh: "錫罐" },
        { en: "tip", zh: "小提示；小費" },
        { en: "nap", zh: "小睡" },
        { en: "pan", zh: "平底鍋" },
        { en: "ant", zh: "螞蟻" }
      ],
      phrases: [
        { en: "Thank you.", zh: "謝謝你。" },
        { en: "You're welcome.", zh: "不客氣。" }
      ]
    },
    {
      id: "c1l3",
      title: "m · d",
      intro: "今天的兩個音都很好認，重點放在「拼讀速度」：看到字，直接唸出來。",
      phonics: [
        { letter: "m", sound: "m", tip: "雙唇閉起來哼「ㄇ~」，像覺得食物好吃的 mmm。", example: "map" },
        { letter: "d", sound: "d", tip: "舌尖位置跟 t 一樣，但喉嚨出聲，是「有聲版的 t」。", example: "dad" }
      ],
      words: [
        { en: "mat", zh: "墊子" },
        { en: "map", zh: "地圖" },
        { en: "man", zh: "男人" },
        { en: "mad", zh: "生氣的" },
        { en: "dad", zh: "爸爸" },
        { en: "sad", zh: "難過的" },
        { en: "did", zh: "做了（過去式）" },
        { en: "and", zh: "和；以及" }
      ],
      phrases: [
        { en: "Good night.", zh: "晚安。" },
        { en: "See you.", zh: "再見。" }
      ]
    },
    {
      id: "c1l4",
      title: "g · o",
      intro: "注意 o 的聲音跟字母名字完全不同——這正是為什麼要學自然發音。",
      phonics: [
        { letter: "g", sound: "g", tip: "喉嚨深處出聲「ㄍ」，短促有力。", example: "go" },
        { letter: "o", sound: "ɑ", tip: "嘴巴張圓說短促的「ㄚ+ㄛ」之間的音，像被嚇到的「喔！」。", example: "dog" }
      ],
      words: [
        { en: "go", zh: "去" },
        { en: "got", zh: "得到（過去式）" },
        { en: "dog", zh: "狗" },
        { en: "dot", zh: "點" },
        { en: "not", zh: "不" },
        { en: "on", zh: "在上面" },
        { en: "top", zh: "頂端" },
        { en: "pot", zh: "鍋子" },
        { en: "nod", zh: "點頭" }
      ],
      phrases: [
        { en: "Let's go!", zh: "我們走吧！" },
        { en: "No problem.", zh: "沒問題。" }
      ]
    },
    {
      id: "c1l5",
      title: "c · k",
      intro: "c 和 k 常常是同一個聲音「ㄎ」。什麼時候用哪個？先不用背規則，看多了自然會有感覺。",
      phonics: [
        { letter: "c", sound: "k", tip: "喉嚨深處短促「ㄎ」，跟 k 同音。c 常出現在 a、o 前面。", example: "cat" },
        { letter: "k", sound: "k", tip: "跟 c 一樣的「ㄎ」。k 常出現在 i、e 前面。", example: "kid" }
      ],
      words: [
        { en: "cat", zh: "貓" },
        { en: "can", zh: "能夠；罐頭" },
        { en: "cap", zh: "棒球帽" },
        { en: "cot", zh: "行軍床" },
        { en: "kid", zh: "小孩" },
        { en: "kit", zh: "工具組" }
      ],
      phrases: [
        { en: "OK.", zh: "好的。" },
        { en: "I can do it.", zh: "我做得到。" }
      ]
    },
    {
      id: "c1l6",
      title: "e · u · r",
      intro: "三個新母音／子音一次到位。r 是中文沒有的音，多練幾次，捲舌但舌頭不碰任何地方。",
      phonics: [
        { letter: "e", sound: "ɛ", tip: "短促的「ㄝ」，嘴角稍微往兩邊拉。", example: "red" },
        { letter: "u", sound: "ʌ", tip: "放鬆說短促的「ㄚ」，像肚子被打到的「呃」。", example: "up" },
        { letter: "r", sound: "r", tip: "舌頭往後捲但不碰上顎，嘴唇稍圓。跟中文的「ㄖ」不同，要更捲。", example: "run" }
      ],
      words: [
        { en: "red", zh: "紅色" },
        { en: "ten", zh: "十" },
        { en: "pen", zh: "筆" },
        { en: "net", zh: "網子" },
        { en: "run", zh: "跑" },
        { en: "sun", zh: "太陽" },
        { en: "up", zh: "向上" },
        { en: "us", zh: "我們（受詞）" },
        { en: "rat", zh: "老鼠" }
      ],
      phrases: [
        { en: "Good idea.", zh: "好主意。" },
        { en: "Are you OK?", zh: "你還好嗎？" }
      ]
    },
    {
      id: "c1l7",
      title: "h · b · f · l",
      intro: "第一週最終課！學完這 4 個音，26 個字母你已掌握 19 個聲音，能拼讀超過 50 個真實單字。",
      phonics: [
        { letter: "h", sound: "h", tip: "輕輕哈氣「ㄏ」，像對鏡子呵氣，喉嚨不出聲。", example: "hat" },
        { letter: "b", sound: "b", tip: "雙唇爆開跟 p 一樣，但喉嚨出聲，是「有聲版的 p」。", example: "big" },
        { letter: "f", sound: "f", tip: "上排牙齒輕咬下唇吹氣「ㄈ」，喉嚨不出聲。", example: "fun" },
        { letter: "l", sound: "l", tip: "舌尖頂上牙齦出聲「ㄌ~」，尾音可以拉長。", example: "leg" }
      ],
      words: [
        { en: "hat", zh: "帽子" },
        { en: "hot", zh: "熱的" },
        { en: "him", zh: "他（受詞）" },
        { en: "bat", zh: "球棒；蝙蝠" },
        { en: "big", zh: "大的" },
        { en: "bag", zh: "袋子；包包" },
        { en: "bed", zh: "床" },
        { en: "fun", zh: "有趣" },
        { en: "leg", zh: "腿" },
        { en: "let", zh: "讓" }
      ],
      phrases: [
        { en: "Good job!", zh: "做得好！" },
        { en: "Have fun!", zh: "玩得開心！" }
      ]
    }
  ]
};
