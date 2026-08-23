const v1070Data = {
  dataStatus: "complete",
  overview: {
    date: "2026-08-18 ~ 2026-08-25",
    version: "10.7.0.0",
    score: 3.5,
    maxScore: 5,
    device: "iPhone 17 Pro",
    os: "iOS 26.6"
  },
  internalTest: {
    testScope: "iOS App Store 下载；鸿蒙不参与本轮测试；Android 环境未补录",
    feedback: "通过微信二维码填写问卷；建议较多时可整理 Word 私发",
    prizes: "第1名1500元万里通积分；第2-5名800元/人；第6-10名300元/人；参与奖：大米",
    criteria: "参与积极性 + 意见反馈有效性",
    skipped: [
      "策略交易涨停买卖新增两种触发模式：当前版本未灰度，跳过测试",
      "策略交易网格交易功能升级：当前版本未灰度，跳过测试"
    ]
  },
  highlights: [
    {
      title: "重点功能覆盖",
      points: [
        "完成自选页全部自选设置、表头模板、顶部指数栏设置测试",
        "完成行情页机会栏目、板块 AI 分析和成分股 AI 分析测试",
        "完成底部财小安半屏 IM 交互测试"
      ]
    },
    {
      title: "产品方向值得肯定",
      points: [
        "通过 AI 分析增强板块、成分股和市场信息获取能力",
        "自选和指数栏配置能力持续扩展，覆盖 ETF 与非 ETF 场景",
        "财小安支持半屏唤起，降低了进入智能服务的操作成本"
      ]
    }
  ],
  issues: [
    {
      id: 1, priority: "P2", severity: "一般", module: "自选页", title: "全部自选设置缺少 AI 智能分组能力",
      description: "当收藏的股票数量较多时，依靠人工逐只整理和分类成本较高，属于重复性体力操作。建议由用户描述分组标准，由大模型对已收藏自选股进行分类。",
      time: "2026-08-24", screenshots: ["imgs/v1070-watchlist-all-groups.png"], videos: [], steps: ["进入自选页 → 右上角设置 → 更多设置 → 全部自选设置", "准备较多自选股并尝试分类"],
      expectedResult: "支持用户自定义分类标准，由 AI 生成分组；AI 分类与手动分类并存，不覆盖既有手动分组。",
      actualResult: "当前未提供 AI 智能分组能力，人工分类成本较高。"
    },
    {
      id: 2, priority: "P2", severity: "一般", module: "自选页", title: "自选表头缺少按投资风格划分的预置模板",
      description: "当前默认模板只有一个，无法同时满足不同类型投资者的信息关注需求。建议提供价值投资、交易等多套模板。",
      time: "2026-08-24", screenshots: ["imgs/v1070-watchlist-header-template-default.png"], videos: [], steps: ["进入自选页 → 自选股 → 设置 → 设置表头"],
      expectedResult: "用户可选择适合投资风格的模板，并继续编辑、保存和调用。",
      actualResult: "当前默认模板只有一个，尚未提供按投资风格区分的多套预置模板。"
    },
    {
      id: 3, priority: "P2", severity: "一般", module: "自选页", title: "多指数模式下指数与右侧功能图标被截断",
      description: "顶部指数栏设置为多指数模式后，指数区域与右侧功能图标区域交界处出现截断，右侧功能图标区域过窄。",
      time: "2026-08-24", screenshots: ["imgs/v1070-watchlist-index-bar-clipped-01.png", "imgs/v1070-watchlist-index-bar-clipped-02.png"], videos: [], steps: ["进入自选页顶部指数栏设置", "配置多个指数并返回自选页观察展示"],
      expectedResult: "指数卡片和功能图标均完整可见，布局稳定并适配不同指数数量。",
      actualResult: "部分指数和右侧功能图标被切断，视觉呈现异常。"
    },
    {
      id: 4, priority: "P2", severity: "一般", module: "自选页", title: "ETF 与非 ETF 的指数栏管理缺少配置对象说明",
      description: "从 ETF 与非 ETF 标签进入右上角设置时，展示的功能设置项不同，但页面没有说明当前配置对象受到入口页面隐式影响。",
      time: "2026-08-24", screenshots: ["imgs/v1070-index-bar-config-etf-entry.png", "imgs/v1070-index-bar-config-etf-management.png", "imgs/v1070-index-bar-config-non-etf-entry.png", "imgs/v1070-index-bar-config-non-etf-management.png"], videos: [], steps: ["分别从 ETF 和非 ETF 标签进入右上角设置", "对比指数栏管理和功能设置内容"],
      expectedResult: "设置页提供 ETF 与非 ETF 两个子 Tab，用户可主动切换并独立调整两类功能顺序。",
      actualResult: "同一入口因进入页面不同而展示不同设置项，但没有任何解释或切换提示。"
    },
    {
      id: 5, priority: "P1", severity: "重要", module: "行情页", title: "机会栏目 AI 消息缺少来源文章链接",
      description: "板块解读和消息面内容基于 AI 分析生成，但消息条目没有来源文章地址，用户无法核验信息可信度和完整上下文。",
      time: "2026-08-24", screenshots: ["imgs/v1070-market-opportunity-ai-no-source-link.png"], videos: [], steps: ["进入行情 → 行业/概念板块 → 板块详情 → 机会", "查看板块解读和消息面内容"],
      expectedResult: "消息条目提供来源标题、媒体和可点击原文；不能跳转时说明限制。",
      actualResult: "AI 生成内容未提供消息来源文章地址。"
    },
    {
      id: 6, priority: "P1", severity: "重要", module: "行情页", title: "成分股 AI 分析默认逐条加载造成性能与信息密度问题",
      description: "开启分析后每条成分股下方展示两行 AI 摘要。快速滚屏时部分条目加载不及时，并可能对用户未关注的企业提前发起分析请求，造成资源浪费和服务器压力；同时列表文字量明显增加。",
      time: "2026-08-24", screenshots: ["imgs/v1070-opportunity-component-ai-inline-summary.png"], videos: [], steps: ["进入行情 → 行业/概念板块 → 板块详情 → 机会 → 成分股", "开启分析并快速滚动列表"],
      expectedResult: "列表仅加载基础数据；每行提供 AI 分析入口，用户主动点击后进入分析页并发起请求；移除表头全局分析开关。",
      actualResult: "通过表头开关后逐条展示 AI 摘要，存在加载不及时、资源浪费和列表混乱问题。"
    },
    {
      id: 7, priority: "P2", severity: "一般", module: "财小安", title: "半屏 IM 查看来源时形成嵌套弹窗",
      description: "底部财小安半屏 IM 完成对话后查看回答来源，会在半屏弹窗中继续弹出约 3/4 屏窗口，形成层层嵌套。",
      time: "2026-08-24", screenshots: ["imgs/v1070-wealth-xiaoan-half-screen-nested-source.png"], videos: [], steps: ["长按底部财小安唤起半屏 IM", "完成一次对话并查看回答来源"],
      expectedResult: "半屏 IM 右上角提供全屏切换入口，复杂内容在全屏容器中展示，返回路径清晰。",
      actualResult: "来源内容继续叠加 3/4 屏窗口，出现多层嵌套交互。"
    }
  ],
  statistics: {
    bySeverity: { "严重": 0, "重要": 2, "一般": 5, "轻微": 0 },
    byModule: { "自选页": 4, "行情页": 2, "财小安": 1 }
  },
  evaluation: {
    scoreReason: {
      positives: ["AI 分析覆盖板块和成分股场景", "自选页配置能力持续增强", "财小安半屏唤起降低使用门槛"],
      deductions: [
        { reason: "AI 可信度", score: -0.6, description: "机会栏目消息缺少来源链接，AI 分析难以核验" },
        { reason: "性能与资源", score: -0.5, description: "成分股 AI 摘要逐条加载可能造成无效计算和滚动加载压力" },
        { reason: "交互体验", score: -0.3, description: "指数栏布局截断、配置对象隐式切换和半屏嵌套弹窗需要优化" },
        { reason: "功能效率", score: -0.2, description: "自选分组和表头模板仍有进一步提升空间" }
      ]
    },
    roadmap: [
      { phase: "第一阶段", type: "urgent", title: "可信度与性能治理", content: "为 AI 消息补充可验证来源；将成分股 AI 分析改为用户主动触发，移除全局开关并完善加载/缓存策略。" },
      { phase: "第二阶段", type: "improve", title: "交互结构优化", content: "修复指数栏多指数布局截断，增加 ETF/非 ETF 配置子 Tab，并为半屏财小安增加全屏切换。" },
      { phase: "第三阶段", type: "optimize", title: "效率能力增强", content: "增加 AI 智能分组和按投资风格提供的自选表头预置模板。" }
    ]
  },
  summary: {
    overviewText: "本次对平安证券 APP 10.7.0.0 进行了内测体验，测试设备为 iPhone 17 Pro、iOS 26.6。共记录 7 条问题与改进建议，另有 2 项因未灰度开放而跳过。整体版本持续强化 AI 分析和自选配置能力，但在 AI 来源可追溯性、按需加载、布局适配和弹窗层级方面仍有明显优化空间。",
    highlight: "10.7.0.0 AI 能力和自选配置持续增强，但应优先治理 AI 可信度与按需加载问题",
    points: ["共记录 7 条问题与改进建议", "P1 重要问题 2 条，集中在 AI 来源和性能资源", "P2 体验问题 5 条，覆盖自选页、行情页和财小安", "2 项交易功能因未灰度开放跳过测试"],
    footer: "建议优先补充 AI 消息来源并改为用户主动触发分析，再优化指数栏布局、配置层级和财小安弹窗体验"
  }
};
