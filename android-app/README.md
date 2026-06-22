# 春萍烧烤点单系统 - Android App

## 项目说明
这是一个基于WebView的Android应用，用于访问烧烤店点单系统的管理后台。

## 开发环境要求
- Android Studio Hedgehog | 2023.1.1+ 或更新版本
- Android SDK 33+
- Java 11+

## 构建步骤

### 方法一：使用 Android Studio（推荐）

1. 打开 Android Studio
2. 选择 "Open an Existing Project"
3. 选择 `android-app` 文件夹
4. 等待 Gradle 同步完成
5. 连接手机或启动模拟器
6. 点击 "Run" 按钮（绿色三角形）

### 方法二：命令行构建

```bash
cd android-app
./gradlew.bat assembleDebug
```

生成的 APK 位置：
`app/build/outputs/apk/debug/app-debug.apk`

## 配置说明

### 修改服务器地址

打开 `app/src/main/java/com/bbqorder/MainActivity.java`，修改：

```java
// 第 24 行
webView.loadUrl("http://您的服务器IP:3000/admin.html");
```

### 允许 HTTP 流量

已在 `network_security_config.xml` 中配置，允许访问局域网地址。

## 功能特性

- ✅ WebView 加载管理后台
- ✅ 支持 JavaScript
- ✅ 支持本地存储（LocalStorage）
- ✅ 支持震动提醒
- ✅ 支持声音播放
- ✅ 返回键导航网页历史

## 注意事项

1. 手机和服务器必须在同一局域网
2. 服务器地址必须是 HTTPS 或配置网络安全策略
3. 测试时建议先用 HTTP，正式发布必须改用 HTTPS

## 简化方案（无需 Android Studio）

如果您没有 Android Studio，可以使用以下工具快速打包：

### 使用 HBuilderX（推荐中国开发者）

1. 下载 HBuilderX：https://www.dcloud.io/hbuilderx.html
2. 新建项目 → 选择"5+ App"
3. 将 `public` 文件夹内容复制到项目
4. 修改 `manifest.json` 中的入口页面
5. 点击"发行" → "原生App-云打包"

### 使用 Capacitor（需要 Node.js）

```bash
npm install -g @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init bbq-order com.bbqorder
npx cap add android
npx cap build android
```
