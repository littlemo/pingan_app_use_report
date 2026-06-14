const v1067Data = {
  dataStatus: "complete",
  overview: {
    date: "2026-06-13 ~ 2026-06-14",
    version: "10.6.7",
    score: 4,
    maxScore: 5,
    device: "iPhone 17 Pro",
    os: "iOS 26.5.1"
  },
  highlights: [
    {
      title: "财小安功能持续优化",
      points: [
        "财小安对话能力和上下文理解持续提升",
        "新增ETF相关功能支持，扩展了产品覆盖面",
        "收藏功能等小细节持续完善，用户体验稳步提升"
      ]
    },
    {
      title: "交互体验有优化空间",
      points: [
        "消息工具按钮位置设计合理",
        "整体界面风格统一，视觉体验良好"
      ]
    }
  ],
  issues: [
    {
      id: 1,
      priority: "P0",
      severity: "严重",
      module: "对话体验",
      title: "回复消息末尾出现tool回调元数据json，被TTS阅读",
      description: "回复消息末尾中出现了tool回调的元数据json，且会被TTS阅读出来，泄露内部数据结构且严重影响用户体验，应尽快修复",
      time: "2026-06-14",
      screenshots: ["imgs/IMG_0231-20260614154046-kv9amxa.png"],
      videos: [],
      steps: [],
      expectedResult: "不应暴露内部元数据，消息展示应该干净整洁",
      actualResult: "tool回调元数据泄露在消息中且被TTS朗读"
    },
    {
      id: 2,
      priority: "P1",
      severity: "重要",
      module: "消息功能",
      title: "消息收藏后快捷菜单没有体现已收藏状态",
      description: "消息收藏后，再次长按消息弹出的快捷菜单中没有体现出已收藏过，只有再次点击后才会弹模态窗口告知消息已收藏。可优化体验，直接在快捷菜单中将空心五星替换为实心五星，从而告知客户该条消息已收藏，或者将\"收藏\"文案改为\"取消\"，从而减少用户的操作",
      time: "2026-06-14",
      screenshots: ["imgs/IMG_0229-20260614154548-nc54van.png", "imgs/IMG_0230-20260614154632-bodwxw8.png"],
      videos: [],
      steps: [],
      expectedResult: "快捷菜单应体现收藏状态，避免用户重复操作",
      actualResult: "收藏状态没有在快捷菜单中体现"
    },
    {
      id: 3,
      priority: "P1",
      severity: "重要",
      module: "对话体验",
      title: "已登录且有权限时回复消息仍为脱敏数据",
      description: "在我已登录且有高端理财权限的前提下，回复的消息中却都是脱敏的数据，直接点击该条数据跳转进去可以看到完整的信息",
      time: "2026-06-14",
      screenshots: ["imgs/IMG_0238-20260614154816-3cp33ek.png", "imgs/IMG_0242-20260614154828-ozvllzo.png"],
      videos: [],
      steps: [],
      expectedResult: "已登录且有权限时应该直接展示完整数据，不应该脱敏",
      actualResult: "回复的数据是脱敏的，但点进去能看到完整数据"
    },
    {
      id: 4,
      priority: "P2",
      severity: "一般",
      module: "消息功能",
      title: "历史消息没有左下角的工具按钮组",
      description: "历史消息没有左下角的工具按钮组，不方便分享历史消息",
      time: "2026-06-14",
      screenshots: ["imgs/IMG_0246-20260614153653-eqeivt4.png", "imgs/IMG_0247-20260614153610-klxj60v.png"],
      videos: [],
      steps: [],
      expectedResult: "历史消息应该和新消息一样有工具按钮组",
      actualResult: "历史消息缺少工具按钮组"
    },
    {
      id: 5,
      priority: "P2",
      severity: "一般",
      module: "产品展示",
      title: "基金产品清单列表在移动端显示体验不佳",
      description: "基金产品清单列表的显示方式在移动端体验不佳，基金名称被省略过多。建议改为卡片式，将基金名称作为标题行单占一行，从而尽可能展示完整的基金名称，将相关数据指标以数据块的形式展示",
      time: "2026-06-14",
      screenshots: ["imgs/IMG_0244-20260614153728-fhpnzrz.png", "imgs/IMG_0245-20260614153758-1s224ch.png"],
      videos: [],
      steps: [],
      expectedResult: "基金名称应该完整展示，列表设计更适合移动端",
      actualResult: "基金名称被省略过多，信息展示不充分"
    },
    {
      id: 6,
      priority: "P2",
      severity: "一般",
      module: "入口交互",
      title: "iOS系统在部分交易页面长按无法唤起财小安服务",
      description: "iOS系统在部分交易页面长按无法唤起财小安服务，建议不要做这种隐性交互逻辑，不同设备的兼容性很难处理，可以通过右上角的快捷服务作为入口，或者单独提供悬浮球支持，让用户明确知道这里可以触发财小安",
      time: "2026-06-14",
      screenshots: [],
      videos: [],
      steps: [],
      expectedResult: "财小安入口应该明确且跨平台兼容",
      actualResult: "部分iOS页面长按无法唤起财小安"
    },
    {
      id: 7,
      priority: "P3",
      severity: "轻微",
      module: "产品展示",
      title: "功能缺失，无法支持对指定ETF基金的简单回测需求",
      description: "功能缺失，无法支持对指定ETF基金的简单回测需求",
      time: "2026-06-14",
      screenshots: ["imgs/IMG_0249-20260614160554-lxm1tp6.png"],
      videos: [],
      steps: [],
      expectedResult: "应支持对ETF基金的回测分析需求",
      actualResult: "ETF回测功能缺失"
    },
    {
      id: 8,
      priority: "P3",
      severity: "轻微",
      module: "对话体验",
      title: "无法回答自己的能力信息",
      description: "功能缺失，无法回答自己的能力信息，建议在其设定中增加skill汇总简述功能，从而可以回复此类能力范围的问题",
      time: "2026-06-14",
      screenshots: ["imgs/IMG_0250-20260614160924-9wiml8x.png"],
      videos: [],
      steps: [],
      expectedResult: "应该能够回答自己的功能和能力范围",
      actualResult: "无法回答关于自身能力的问题"
    }
  ],
  statistics: {
    bySeverity: {
      "严重": 1,
      "重要": 2,
      "一般": 3,
      "轻微": 2
    },
    byModule: {
      "对话体验": 3,
      "消息功能": 2,
      "产品展示": 2,
      "入口交互": 1
    }
  },
  evaluation: {
    scoreReason: {
      positives: [
        "财小安功能持续迭代，用户体验稳步提升",
        "新增ETF相关功能，产品覆盖面扩大",
        "收藏等细节功能在完善中",
        "整体界面风格统一，视觉体验良好"
      ],
      deductions: [
        { reason: "稳定性问题", score: -0.4, description: "tool回调元数据泄露的P0问题需优先修复" },
        { reason: "功能完整性", score: -0.3, description: "ETF回测和能力介绍功能缺失" },
        { reason: "交互细节", score: -0.2, description: "收藏状态、历史消息按钮等细节需优化" },
        { reason: "数据处理", score: -0.1, description: "已登录用户数据仍被脱敏" }
      ]
    },
    roadmap: [
      {
        phase: "第一阶段",
        type: "urgent",
        title: "紧急修复",
        content: "优先修复tool回调元数据泄露问题，这是严重影响体验且可能有安全风险的P0问题"
      },
      {
        phase: "第二阶段",
        type: "improve",
        title: "功能完善",
        content: "修复收藏状态显示问题、历史消息工具按钮问题、数据脱敏逻辑问题，补充ETF回测和能力介绍功能"
      },
      {
        phase: "第三阶段",
        type: "optimize",
        title: "体验优化",
        content: "优化基金列表移动端显示，优化财小安唤起交互方式，提供更明确的入口"
      }
    ]
  },
  summary: {
    overviewText: "本次对平安证券10.6.7版本进行了测试，总体来看，财小安功能持续优化，但也发现了一些需要修复的问题。最严重的是tool回调元数据泄露问题，需要优先修复。",
    highlight: "平安证券10.6.7版本财小安功能持续优化，但有P0级别问题需要紧急修复",
    points: [
      "财小安功能持续迭代提升",
      "新增ETF相关功能支持",
      "有一个P0严重问题需要优先修复",
      "整体体验有改进空间"
    ],
    footer: "建议优先修复tool回调元数据泄露问题，再完善其他功能和优化体验"
  }
};
