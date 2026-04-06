# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 项目概述

这是**平安证券预发布版本体验报告**项目，用于记录和展示平安证券APP 10.6.3版本的用户体验测试结果。

### 核心文件

| 文件 | 说明 |
|------|------|
| `平安证券预发布版本体验报告.md` | 主体验报告文档，包含完整的测试结果 |
| `.omc/plans/平安证券体验报告静态页面计划.md` | 静态报告页面的实施计划 |
| `imgs/` | 测试截图和视频目录 |

### 平安证券设计风格

参考官网：https://stock.pingan.com/

- **主色调**: 平安品牌蓝 `#1E88E5`
- **强调色**: 平安橙 `#FF6B00`
- **辅助色**: 灰色系 `#333333`, `#666666`, `#F5F7FA`
- **严重程度标识**: 红P0、橙P1、蓝P2、绿P3

---

## 常用命令

### Git 提交

使用 `/gc` 命令生成符合 Conventional Commits 规范的提交信息。

提交类型：
- `docs`: 文档相关修改
- `feat`: 新增功能
- `fix`: 修复问题
- `style`: 格式调整

### 技能调用

| 技能 | 用途 |
|------|------|
| `/plan` | 创建实施计划 |
| `/gc` | 生成 git 提交信息 |
| `/oh-my-claudecode:team` | 团队协作开发 |

---

## 注意事项

1. **图片引用**: 使用 markdown 图片语法 `![描述](imgs/文件名.PNG)`
2. **中文沟通**: 全局使用中文进行沟通
3. **Git 规范**: 遵循 Conventional Commits 规范，提交信息使用中文描述

