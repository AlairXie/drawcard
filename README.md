# StreakSprint (连胜冲刺)

一个纯前端的小游戏 MVP：抽卡 → 冲刺计时 → 提交产出物 → 结算分数与连胜。

## 为什么 `npm install` 会失败

在当前运行环境里，`npm install` 请求会先走 `HTTP_PROXY/HTTPS_PROXY=http://proxy:8080`，
但该代理对外部 npm 源连接返回 `403 Forbidden`（CONNECT 隧道被拒绝），导致依赖无法下载。

### 复现现象

- `npm install` 报错：`403 Forbidden - GET https://registry.npmjs.org/...`
- `curl -I https://registry.npmjs.org/@types/node` 报错：`CONNECT tunnel failed, response 403`

## 解决方案

### 方案 A（推荐）：使用可用的企业/本地 npm Registry

将 npm registry 配置为你可访问的内网仓库（如 Nexus/Artifactory/Verdaccio）：

```bash
npm config set registry https://<your-private-registry>/
npm install
```

### 方案 B：修复代理配置（若必须走代理）

确保代理地址、端口、认证信息正确：

```bash
export HTTP_PROXY=http://<user>:<pass>@<proxy-host>:<port>
export HTTPS_PROXY=http://<user>:<pass>@<proxy-host>:<port>
npm config set proxy "$HTTP_PROXY"
npm config set https-proxy "$HTTPS_PROXY"
npm install
```

### 方案 C：允许直连（若网络策略允许）

```bash
unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy npm_config_http_proxy npm_config_https_proxy
npm install
```

> 注意：若组织网络默认禁用直连公网，方案 C 会失败，这是预期行为。

## 本地启动

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## GitHub 部署（GitHub Pages）

仓库已提供 `.github/workflows/deploy.yml`。启用方式：

1. 将代码推送到 GitHub 仓库。
2. 进入 **Settings → Pages**，Source 选择 **GitHub Actions**。
3. 触发 `main` 分支工作流后自动发布。

如果你的仓库是私有仓库或有自定义权限策略，请确保：
- Actions 有 `pages: write` 与 `id-token: write` 权限；
- 仓库允许 GitHub Actions 部署 Pages。
