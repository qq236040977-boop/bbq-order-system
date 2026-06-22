# 春萍烧烤点单系统 - 部署指南

## 免费部署到 Render.com（推荐）

### 第一步：创建 GitHub 仓库
1. 访问 https://github.com 并登录
2. 点击右上角 `+` → `New repository`
3. 仓库名填 `bbq-order-system`，点 `Create repository`
4. 复制仓库地址（类似 `https://github.com/你的用户名/bbq-order-system.git`）

### 第二步：推送代码到 GitHub
在本地项目目录运行：
```bash
cd C:\Users\linkai\WorkBuddy\2026-06-22-15-27-07\bbq-order-system
git remote add origin https://github.com/你的用户名/bbq-order-system.git
git branch -M main
git push -u origin main
```

### 第三步：部署到 Render
1. 访问 https://render.com 并注册（用 GitHub 账号登录最快）
2. 点 `New +` → `Web Service`
3. 连接你的 GitHub 仓库 `bbq-order-system`
4. 按默认设置，点 `Create Web Service`
5. 等待 2-3 分钟，部署完成！

### 第四步：获取公网地址
部署完成后，Render 会给你一个地址，类似：
```
https://bbq-order-system.onrender.com
```

把这个地址发给商家：
- **商家后台**：`https://bbq-order-system.onrender.com/admin.html`
- **顾客点单**：`https://bbq-order-system.onrender.com`

---

## 注意事项
- Render 免费版会在 15 分钟无访问后休眠，下次访问需要等待 30 秒唤醒
- 如果需要始终保持在线，可以升级到付费版（$7/月）
- 数据存储在云端，不会丢失

## 问题排查
如果部署失败，检查：
1. `package.json` 中的 `start` 脚本是否正确
2. `render.yaml` 是否存在
3. GitHub 仓库是否包含完整代码
