# StreakSprint (连胜冲刺)

一个纯前端的小游戏 MVP：抽卡 → 冲刺计时 → 提交产出物 → 结算分数与连胜。

## 你问的：GitHub 部署能不能不跑 `npm install`？

可以。当前仓库已改成 **预构建部署模式**：

- GitHub Actions **不执行** `npm install` / `npm ci`
- 只检查仓库里是否存在 `dist/`
- 直接把 `dist/` 上传并发布到 GitHub Pages

对应工作流文件：`.github/workflows/deploy.yml`。

## 使用步骤（无 npm install 的 GitHub 部署）

1. 在你本地机器构建：

```bash
npm install
npm run build
```

2. 把生成的 `dist/` 一起提交并推送到 `main`：

```bash
git add dist .github/workflows/deploy.yml
git commit -m "chore: deploy prebuilt dist to pages"
git push origin main
```

3. GitHub 仓库里开启 Pages：
   - Settings → Pages
   - Source 选择 **GitHub Actions**

之后每次你本地重新构建并提交 `dist/`，push 到 `main` 就会自动部署。

## 注意事项

- 这种方式的代价是：`dist/` 属于构建产物，会进入 Git 历史（仓库体积会增长）。
- 若你以后网络恢复，建议切回“CI 内构建”模式（在 Actions 里 `npm ci && npm run build`），不再提交 `dist/`。
