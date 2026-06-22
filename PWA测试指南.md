# 📱 春萍烧烤 PWA 安装测试指南

## ✅ 已完成配置

- ✅ `manifest.json` - PWA应用清单
- ✅ `sw.js` - Service Worker（离线缓存）
- ✅ `generate-icon.html` - 图标生成器
- ✅ `index.html` 和 `admin.html` 已注册Service Worker

---

## 🎨 第一步：生成图标文件

1. **启动服务器**（如果未启动）
   ```
   cd C:\Users\linkai\WorkBuddy\2026-06-22-15-27-07\bbq-order-system
   node server.js
   ```

2. **打开图标生成器**
   浏览器访问：`http://localhost:3000/generate-icon.html`

3. **下载图标**
   - 页面会自动生成两个图标
   - 点击「⬇️ 下载图标」按钮
   - 保存 `icon-192.png` 和 `icon-512.png`

4. **放入指定目录**
   将下载的图标文件放到：
   ```
   C:\Users\linkai\WorkBuddy\2026-06-22-15-27-07\bbq-order-system\public\
   ```

---

## 📱 第二步：PWA安装测试

### 方式A：安卓手机 Chrome 安装

1. **确保手机和电脑在同一WiFi**
2. **查看电脑局域网IP**
   ```bash
   ipconfig | findstr IPv4
   ```
   例如：`192.168.1.100`

3. **手机浏览器访问**
   ```
   http://192.168.1.100:3000
   ```

4. **安装到桌面**
   - Chrome菜单（⋮）→ 「安装应用」或「添加到主屏幕」
   - 桌面会出现「春萍烧烤」图标
   - 点击图标，像原生APP一样全屏运行

### 方式B：电脑 Chrome 安装

1. 打开 `http://localhost:3000`
2. 地址栏右侧会出现「安装」图标（⊕）
3. 点击安装，创建桌面快捷方式

---

## 🔔 第三步：测试新订单提醒

1. **打开管理后台**
   `http://localhost:3000/admin.html`

2. **允许通知权限**
   浏览器询问时，点「允许」

3. **测试提醒**
   - 滚动到设置页底部
   - 点击「🔔 测试提醒」
   - 应该听到：叮咚声 + 语音播报"您的店铺有新订单啦请注意查收"

4. **真实测试**
   - 用手机/另一台设备打开顾客端
   - 提交一个测试订单
   - 管理后台应该立即收到提醒

---

## ⚙️ 设置页功能清单

在管理后台 → 设置页，向下滚动可以看到：

### 🔔 新订单提醒设置
- ✅ 声音提醒（叮咚声）
- ✅ 震动提醒（仅手机）
- ✅ 语音播报
- ✅ 浏览器通知

### 📱 设备管理
- ✅ 绑定此设备（最多5台）
- ✅ 查看已绑定设备列表
- ✅ 解绑设备

---

## 🚨 常见问题

### Q1：图标不显示？
- 确认 `icon-192.png` 和 `icon-512.png` 已放到 `public/` 目录
- 清除浏览器缓存后重新访问

### Q2：安装按钮不出现？
- 确认使用 **HTTPS** 或 **localhost**
- Chrome要求：必须有 `manifest.json` 和 Service Worker
- 访问至少30秒后，安装按钮才会出现

### Q3：通知不工作？
- 检查浏览器是否阻止了通知权限
- Chrome设置 → 隐私设置和安全性 → 网站设置 → 通知 → 允许

### Q4：手机震动不工作？
- 震动仅在真实手机上有效，电脑浏览器不支持
- 确保手机没有开启"勿扰模式"

---

## 📦 第三步：打包成APK（可选）

如果PWA测试满意，可以打包成真正的Android APK：

### 方案1：使用 HBuilderX（最简单）
1. 下载 HBuilderX
2. 导入项目为"Web App"
3. 发行 → 原生App云打包 → Android
4. 等待打包完成，下载APK

### 方案2：使用 Cordova
```bash
npm install -g cordova
cordova create bbq-app com.bbqorder bbq-app
cd bbq-app
cordova platform add android
# 将 public/ 目录内容复制到 www/
cordova build android
```

---

## 📋 测试检查清单

- [ ] 图标文件已生成并放到 `public/` 目录
- [ ] 顾客端可以正常点单
- [ ] 管理后台可以接收新订单提醒
- [ ] 声音提醒正常工作
- [ ] 语音播报说"您的店铺有新订单啦请注意查收"
- [ ] 设备管理可以绑定/解绑
- [ ] PWA可以安装到手机桌面
- [ ] 离线时（断网）仍能打开应用（Service Worker缓存）

---

**测试完成后告诉我结果，有问题我立即修复！**
