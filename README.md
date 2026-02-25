# 学习王者（微行动）

一个纯前端、无后端的网页小游戏：**抽卡开局 → 冲刺计时 → 提交战利品 → 结算段位星星**。

## 核心特性（MVP）

- 1 分钟开局：抽卡即开打，减少选择阻力
- 3/10/15 分钟冲刺：支持“提前完成”
- 战利品提交：文本必填，链接/截图说明/文件路径可选
- 王者式结算：胜负、星星变化、连胜、保星卡
- 卡池管理：新增/删除/勾选“今日启用”
- 本地持久化：刷新不丢，断网可用

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## GitHub Pages 部署（不在 CI 执行 npm install）

当前仓库采用**预构建部署模式**：

- Actions 不执行 `npm install` / `npm ci`
- 直接发布仓库里的 `dist/`

操作步骤：

1. 本地构建

```bash
npm install
npm run build
```

2. 提交 `dist/` 并推送

```bash
git add dist .github/workflows/deploy.yml
git commit -m "chore: deploy prebuilt dist"
git push origin main
```

3. GitHub 仓库设置
   - Settings → Pages
   - Source 选择 **GitHub Actions**

## 历史记录存储在哪里？

历史记录保存在浏览器 **LocalStorage**（当前域名本地存储）中。

主要键名：

- `ss_records_v1`：历史对局记录（战绩、战利品、星星变化）
- `ss_stats_v1`：用户统计（段位、星星、连胜等）
- `ss_cards_v1`：卡池数据
- `ss_today_state_v1`：当日进行中状态

## LocalStorage 大小有多大？

- 常见浏览器单域名可用空间通常约 **5MB ~ 10MB**（实现与浏览器有关）
- 本项目主要存文本，MVP 阶段一般可存数千条记录
- 若你长期高频使用，建议后续加入“导出 JSON/清理历史”功能

## 注意事项

- 预构建部署会让 `dist/` 进入 Git 历史，仓库体积会增长。
- 网络恢复后，建议切回 CI 构建模式（`npm ci && npm run build`）。
