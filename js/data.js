const reportData = {
  overview: {
    date: "2026-04-06 ~ 2026-04-07",
    version: "10.6.3",
    score: 4,
    maxScore: 5
  },
  highlights: [
    {
      title: "产品架构设计完整清晰",
      points: [
        "核心模块规划合理，选股、盯盘、持仓查询等功能划分明确",
        "财小安IP形象统一，品牌识别度高",
        "从信息查询到辅助决策的产品思路清晰"
      ]
    },
    {
      title: "AI能力持续迭代提升",
      points: [
        "Agent能力相较于上一版本有明显提升，不再局限于纯对话交互",
        "新增Skill功能支持下单等具体操作，向实用型工具迈出重要一步",
        "能够理解复杂的金融相关问题，并提供多维度分析（消息面、技术面、情绪面等）",
        "引入来源引用机制，试图提升AI回答的可信度和可追溯性"
      ]
    },
    {
      title: "用户体验有基础保障",
      points: [
        "界面设计风格统一，财小安形象友好亲和",
        "语音播放功能贴心，适合金融资讯的长文本阅读场景",
        "历史消息记录完整，方便用户回溯过往分析",
        "延伸问题设计合理，引导用户深入探索"
      ]
    },
    {
      title: "专业性方向明确",
      points: [
        "针对金融场景做了专门优化，提供涨跌分布、资金走势等专业数据展示",
        "试图整合多维度信息（收盘数据、消息面、技术面、情绪面）进行综合分析",
        "来源引用设计体现了对金融内容可信度的重视"
      ]
    },
    {
      title: "功能创新值得肯定",
      points: [
        "五大选股功能的差异化设计思路正确",
        "从纯聊天工具向可执行操作的Agent转型方向清晰",
        "财小安频道的产品形态有特色，区别于传统券商APP"
      ]
    }
  ],
  issues: [
    {
      id: 1,
      priority: "P0",
      severity: "严重",
      module: "盯盘功能",
      title: "点击引用来源文章导致APP闪退",
      description: "点击引用来源文章后APP发生闪退，严重影响使用体验。",
      time: "2026-04-06 23:18",
      screenshots: ["imgs/IMG_8334.PNG", "imgs/IMG_8335.PNG", "imgs/IMG_8336.PNG"],
      videos: ["imgs/ScreenRecording_04-06-2026 23-35-59_1.MP4"]
    },
    {
      id: 2,
      priority: "P0",
      severity: "严重",
      module: "盯盘功能",
      title: "来源引用标注错误",
      description: "「何帆教授“九层股市利益金字塔”理论」一段引用来源标注为“④”，但点击后看到④的内容与此无关，真正有关的是第九条引用来源。",
      time: "2026-04-06 23:18",
      screenshots: [],
      videos: []
    },
    {
      id: 3,
      priority: "P1",
      severity: "重要",
      module: "持仓查询",
      title: "个人持仓信息未接入数据源",
      description: "个人持仓信息仍未接入到模型数据源中，无法查询“我都持有哪些股票”。",
      time: "2026-04-07 02:08",
      screenshots: ["imgs/IMG_8359.PNG"],
      videos: []
    },
    {
      id: 4,
      priority: "P1",
      severity: "重要",
      module: "盯盘功能",
      title: "历史消息跳转时丢失时间信息",
      description: "点击盯盘中历史消息的延伸问题，跳转后未包含历史消息中的时间信息，返回了错误日期的分析结果。",
      time: "2026-04-06 23:40",
      screenshots: ["imgs/IMG_8339.PNG"],
      videos: []
    },
    {
      id: 5,
      priority: "P1",
      severity: "重要",
      module: "盯盘功能",
      title: "涨跌分布等数据无法正常展示",
      description: "涨跌分布、总成交额、资金走势内容很快闪过一条“正在总结”文案，然后就显示“暂无数据”。",
      time: "2026-04-06",
      screenshots: [],
      videos: ["imgs/ScreenRecording_04-06-2026 23-46-09_1.MP4"]
    },
    {
      id: 6,
      priority: "P1",
      severity: "重要",
      module: "选股功能",
      title: "财小安回答样式渲染错误",
      description: "财小安回答中存在样式渲染错误，在两端文字中间空出了大量错误空行。",
      time: "2026-04-06 22:47",
      screenshots: ["imgs/IMG_8331.PNG"],
      videos: []
    },
    {
      id: 7,
      priority: "P2",
      severity: "一般",
      module: "选股功能",
      title: "语音播放时希望高亮当前句子",
      description: "语音播放回复消息时，希望可以将当前阅读的句子高亮，方便长文本阅读时进行位置定位。",
      time: "",
      screenshots: [],
      videos: []
    },
    {
      id: 8,
      priority: "P2",
      severity: "一般",
      module: "选股功能",
      title: "支持从指定段落开始朗读",
      description: "由于模型回复信息较多，建议支持用户从指定段落开始朗读，避免用户走神漏听后只能完整重头听的窘境。",
      time: "",
      screenshots: [],
      videos: []
    },
    {
      id: 9,
      priority: "P2",
      severity: "一般",
      module: "选股功能",
      title: "专业名词语音阅读不够严谨",
      description: "部分专业名词的语音阅读错误，对于专业的金融服务产品不够严谨。例如“ROE”应该三个字母分开阅读（R-O-E），但实际TTS错误地将其作为一个单词朗读。",
      time: "",
      screenshots: [],
      videos: []
    },
    {
      id: 10,
      priority: "P3",
      severity: "轻微",
      module: "选股功能",
      title: "五大选股功能头像区分度不足",
      description: "财小安频道选股功能下，五大选股功能的财小安头像区分度不够。当前只有右下角的小图标有区分性，建议头像本身也根据板块特性调整虚拟形象，会更有辨识度一些。",
      time: "",
      screenshots: [],
      videos: []
    }
  ],
  statistics: {
    bySeverity: {
      "严重": 2,
      "重要": 4,
      "一般": 3,
      "轻微": 1
    },
    byModule: {
      "选股功能": 5,
      "盯盘功能": 3,
      "持仓查询": 2
    }
  }
};
