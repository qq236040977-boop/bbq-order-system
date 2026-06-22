# 春萍烧烤点单系统 - 测试版打包指南

## 🚀 方案一：PWA安装（推荐，最简单）

### 测试步骤：
1. 确保手机和电脑在同一WiFi
2. 查看电脑局域网IP：
   ```bash
   ipconfig | grep IPv4
   ```
3. 启动服务器：`node server.js`
4. 手机浏览器访问：`http://您的IP:3000/admin.html`
5. Chrome浏览器菜单 → "安装应用" 或 "添加到主屏幕"

✅ **优点**：无需打包，立即测试，像原生APP一样使用

---

## 📱 方案二：Cordova打包APK

### 环境准备：
```bash
# 安装Cordova
npm install -g cordova

# 验证安装
cordova --version
```

### 创建项目：
```bash
# 创建Cordova项目
cordova create bbq-app com.bbqorder "春萍烧烤管理"

# 进入项目
cd bbq-app

# 添加Android平台
cordova platform add android

# 复制网页文件到 www 文件夹
copy ..\public\* www\
```

### 构建APK：
```bash
# 构建Debug版APK
cordova build android

# 生成的APK位置：
# platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

### 安装测试：
1. 将 `app-debug.apk` 传到手机
2. 手机设置 → 允许安装未知来源应用
3. 点击APK文件安装

---

## 🔧 方案三：修改服务器地址

打开 `www/js/index.js`（Cordova项目自动生成），修改服务器地址：

```javascript
// 原来
var serverUrl = 'http://localhost:3000';

// 改为您的局域网IP
var serverUrl = 'http://192.168.1.100:3000';
```

---

## ⚠️ 注意事项

1. **测试时**：手机和服务器必须在同一局域网
2. **正式发布**：需要公网IP或域名 + HTTPS
3. **震动权限**：Cordova需要安装震动插件
   ```bash
   cordova plugin add cordova-plugin-vibration
   ```
4. **声音播放**：Cordova需要安装媒体插件
   ```bash
   cordova plugin add cordova-plugin-media
   ```

---

## 🎯 最简测试流程（推荐）

**不用打包，直接测试：**

1. 电脑启动服务器：`node server.js`
2. 手机连接同一WiFi
3. 手机浏览器打开：`http://电脑IP:3000/admin.html`
4. 测试所有功能（下单、提醒、设备管理）
5. 如果满意，再打包成APK

**需要我帮您执行哪一步？**
