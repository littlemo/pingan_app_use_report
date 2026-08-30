const aiWealthData = {
  dataStatus: "complete",
  overview: {
    date: "2026-08-30 起",
    version: "10.7.1.0（AI 财富专享内测）",
    score: 3,
    maxScore: 5,
    device: "iPhone 17 Pro",
    os: "iOS 26.6"
  },
  highlights: [
    {
      title: "本轮评测关注重点",
      points: [
        "集团资产查询及综合账户授权流程",
        "AI 收益分析、ETF 横向对比和工具调用稳定性",
        "基金/ETF 添加自选股等可执行操作的意图识别"
      ]
    },
    {
      title: "当前总体观察",
      points: [
        "AI 财富功能覆盖资产查询、诊断和选品等多个场景",
        "授权管理面板已支持授权和取消授权，但入口及批量操作仍可优化",
        "部分对话出现权限识别错误、答非所问或工具调用循环"
      ]
    }
  ],
  issues: [
    {
      id: 1, priority: "P1", severity: "重要", module: "UI交互优化", title: "授权触发中断对话，授权管理入口不够明确",
      description: "授权主要在对话触发到对应数据节点时弹出；完成一次授权后，对话会被中断，只展示资产情况，未继续输出综合诊断。通过对话找到的综合账户信息授权面板支持查看授权状态、授权和取消授权，但入口较隐蔽，暂未观察到批量授权能力。",
      time: "2026-08-30", screenshots: ["imgs/ai-wealth/ai-wealth-asset-query-authorization.png", "imgs/ai-wealth/ai-wealth-service-agreement-authorization.png", "imgs/ai-wealth/ai-wealth-asset-query-partial-result-redacted.jpg", "imgs/ai-wealth/ai-wealth-authorization-management.png"], videos: [], steps: ["进入快捷服务并发起集团资产查询", "按提示完成一次或多次授权", "观察授权后的对话是否继续输出综合诊断", "通过对话进入综合账户信息授权面板"],
      expectedResult: "授权流程应连续完成；用户可通过明确入口整体查看权限状态，并支持批量授权和取消授权。",
      actualResult: "授权节点会中断对话；授权管理面板虽存在，但入口不够明确，且需要逐项操作。"
    },
    {
      id: 2, priority: "P1", severity: "重要", module: "功能逻辑 Bug", title: "处理 ETF 横向对比时陷入工具调用循环",
      description: "处理股息率及 ETF 横向对比消息时，信息收集、工具调用异常、ETF 筛选等状态重复循环，未能正常结束并返回回答。",
      time: "2026-08-30", screenshots: ["imgs/ai-wealth/ai-wealth-tool-loop-failure.png", "imgs/ai-wealth/ai-wealth-tool-loop-failure-02.png"], videos: [], steps: ["发送股息率及 ETF 横向对比问题", "观察已完成思考区域中的工具调用状态", "等待系统结束处理"],
      expectedResult: "工具调用异常时应及时终止循环，明确提示失败原因，并提供重试、调整问题或人工服务入口。",
      actualResult: "相同处理状态反复出现，持续重试直至超过最大重试次数，任务失败。"
    },
    {
      id: 3, priority: "P1", severity: "重要", module: "模型对话Bug", title: "已授权账户仍被提示无权限或返回不匹配内容",
      description: "用户希望查询股票账户或其他账户的收益率情况并进行分析，授权管理面板显示相关账户已授权，但对话仍提示没有权限、要求重新授权，或未稳定回应当前收益分析问题。",
      time: "2026-08-30", screenshots: ["imgs/ai-wealth/ai-wealth-account-return-response-mismatch.png", "imgs/ai-wealth/ai-wealth-account-return-analysis-redacted.png", "imgs/ai-wealth/ai-wealth-authorization-status-followup.png"], videos: [], steps: ["完成相关账户授权", "询问具体收益率、收益来源或投资分布", "对比授权状态与对话回复"],
      expectedResult: "系统应识别已授权账户范围并完成收益率、收益来源及账户/产品分布分析；数据不足时说明具体权限或数据缺口。",
      actualResult: "已授权后仍提示无权限或要求重新授权，部分回复与用户当前问题不匹配。"
    },
    {
      id: 4, priority: "P2", severity: "一般", module: "模型对话Bug", title: "请求添加基金到自选股时返回无关行情内容",
      description: "用户请求将港股通红利 ETF 广发或代码 520900 添加到自选股，实际收到的是自选股涨跌幅汇总和行情列表，与提问消息完全无关。",
      time: "2026-08-30", screenshots: ["imgs/ai-wealth/ai-wealth-add-fund-to-watchlist-response-mismatch-01.png", "imgs/ai-wealth/ai-wealth-add-fund-to-watchlist-response-mismatch-02.png"], videos: [], steps: ["请求将指定基金/ETF 添加到自选股", "观察对话是否执行添加或提示权限限制"],
      expectedResult: "识别添加自选意图并执行添加；无权限时明确说明限制，并提供手动添加路径。",
      actualResult: "返回自选股行情汇总，与添加自选请求无关。"
    },
    {
      id: 5, priority: "P2", severity: "一般", module: "UI交互优化", title: "输入法回车键为换行，发送操作不符合常用交互",
      description: "调起输入法后，键盘右下角显示“换行”，用户输入完成后下意识点击右下角无法直接发送消息，而是插入换行；用户还需要将手指移到产品输入框右侧的发送按钮，手指移动行程较长。",
      time: "2026-08-30", screenshots: ["imgs/ai-wealth/ai-wealth-input-keyboard-newline.png", "imgs/ai-wealth/ai-wealth-input-keyboard-send-reference.jpg"], videos: [], steps: ["进入快捷服务对话输入框", "调起系统输入法并输入消息", "点击键盘右下角按键，观察消息是否发送"],
      expectedResult: "输入法右下角应提供发送操作，用户输入完成后可直接发送；如需换行，应提供明确的替代操作。",
      actualResult: "输入法右下角为“换行”，点击后不会发送消息，必须再点击产品输入框右侧发送按钮。"
    },
    {
      id: 6, priority: "P2", severity: "一般", module: "UI交互优化", title: "基金信息卡片左侧区域缺少详情页入口",
      description: "回复消息中的基金信息卡片目前仅“加自选”按钮绑定了操作，点击左侧基金名称和信息区域没有任何反应。",
      time: "2026-08-30", screenshots: ["imgs/ai-wealth/ai-wealth-fund-card-no-detail-entry.png"], videos: [], steps: ["发起基金对比或推荐类提问", "点击回复中的基金信息卡片左侧名称或信息区域", "观察是否进入基金详情页"],
      expectedResult: "点击基金卡片主体可进入对应基金详情页；点击“加自选”按钮继续执行收藏操作。",
      actualResult: "只有“加自选”按钮有绑定事件，点击卡片左侧区域无任何响应。"
    },
    {
      id: 7, priority: "P1", severity: "重要", module: "功能逻辑 Bug", title: "基金卡片加自选后生成错误记录且详情数据为空",
      description: "仅在快捷服务对话返回的基金信息卡片上点击“加自选”时复现：自选列表中出现额外的错误自选记录，进入该记录的基金详情页后页面内容为空，仅显示基金名称。正常从自选页搜索基金并在基金详情页点击“加自选”未复现该问题。",
      time: "2026-08-30", screenshots: ["imgs/ai-wealth/ai-wealth-watchlist-extra-invalid-record.jpg", "imgs/ai-wealth/ai-wealth-invalid-fund-detail-empty.png"], videos: [], steps: ["在快捷服务对话返回的基金卡片上点击“加自选”", "进入自选列表观察新增记录", "点击新增记录进入基金详情页", "对比从自选页搜索基金后在详情页点击“加自选”的正常路径"],
      expectedResult: "点击加自选后应仅新增一条有效自选记录，基金代码、行情和详情数据应完整可用。",
      actualResult: "对话基金卡片路径下自选列表出现额外错误记录，错误记录详情页仅显示基金名称，其余内容为空；自选页搜索并从详情页加自选的正常路径未出现该问题。"
    }
  ],
  statistics: {
    bySeverity: { "严重": 0, "重要": 4, "一般": 3, "轻微": 0 },
    byModule: { "UI交互优化": 3, "功能逻辑 Bug": 2, "模型对话Bug": 2 }
  },
  evaluation: {
    scoreReason: {
      positives: ["覆盖资产查询、收益分析、ETF 对比和可执行操作等 AI 财富场景", "授权管理面板已提供授权状态查看和取消授权能力"],
      deductions: [
        { reason: "稳定性", score: -0.7, description: "ETF 横向对比出现工具调用循环并最终失败" },
        { reason: "权限一致性", score: -0.5, description: "已授权账户仍被提示无权限或要求重复授权" },
        { reason: "意图理解", score: -0.4, description: "添加自选股请求返回无关行情内容" },
        { reason: "授权体验", score: -0.2, description: "授权流程中断对话，管理面板入口和批量授权能力不足" },
        { reason: "输入效率", score: -0.2, description: "输入法回车键行为与常用发送习惯不一致，增加发送操作成本" }
      ]
    },
    roadmap: [
      { phase: "第一阶段", type: "urgent", title: "稳定性与权限一致性治理", content: "增加工具调用循环检测和明确失败态；统一授权状态、数据范围与对话侧权限校验。" },
      { phase: "第二阶段", type: "improve", title: "对话意图与操作闭环", content: "完善收益分析问题理解、基金/ETF 实体解析和添加自选操作路由，避免答非所问。" },
      { phase: "第三阶段", type: "optimize", title: "授权管理体验优化", content: "提供明确的授权管理入口，支持整体查看权限状态和批量授权/取消授权。" }
    ]
  },
  summary: {
    overviewText: "本次 AI 财富专享内测当前已记录 7 条问题，覆盖授权流程、工具调用稳定性、收益分析权限识别、基金添加自选、输入交互、基金信息卡片和自选股数据。综合评测评分为 3/5。",
    highlight: "AI 财富功能场景覆盖较广，但应优先修复工具调用循环、权限状态不一致和操作意图路由问题",
    points: ["已记录 7 条问题，其中 P1 重要问题 4 条", "问题归纳为 UI交互优化 3 条、功能逻辑 Bug 2 条、模型对话Bug 2 条", "所有证据图片均使用项目内归档资源，账户金额已脱敏"],
    footer: "建议优先治理工具调用失败、权限校验和自选数据写入，再完善操作型意图识别及交互入口"
  }
};
