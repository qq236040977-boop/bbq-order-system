#!/data/data/com.termux/files/usr/bin/bash
# 老六烧烤点单系统 - 安卓启动脚本
# 在 Termux 中运行: bash start.sh

echo "🍖 老六烧烤点单系统启动中..."
echo ""

# 安装依赖（首次运行）
if [ ! -d "node_modules" ]; then
  echo "📦 首次运行，安装依赖..."
  npm install
  echo ""
fi

# 启动服务器（后台运行）
echo "🚀 启动服务器..."
node server.js &
SERVER_PID=$!
sleep 2

# 获取 ngrok 公网地址
echo ""
echo "🌐 请在新 Termux 会话中运行:"
echo "   ngrok http 3000"
echo ""
echo "📱 然后在浏览器打开:"
echo "   http://localhost:3000/setup.html"
echo ""
echo "   把 ngrok 地址填入设置页，生成二维码贴桌上"
echo ""
echo "⏹ 按 Ctrl+C 停止服务器"

# 等待服务器进程
wait $SERVER_PID
