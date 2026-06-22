#!/bin/bash
# 春萍烧烤 - 自动重连隧道脚本
# 用法: nohup bash tunnel.sh &

LOG="/tmp/bbq-tunnel.log"
PORT=3000

while true; do
  echo "[$(date)] 启动隧道..." >> "$LOG"
  
  # 启动 serveo.net 隧道
  ssh -o StrictHostKeyChecking=no \
      -o ServerAliveInterval=30 \
      -o ServerAliveCountMax=3 \
      -o ExitOnForwardFailure=yes \
      -R 80:localhost:$PORT \
      serveo.net >> "$LOG" 2>&1 &
  
  SSH_PID=$!
  echo "[$(date)] SSH PID: $SSH_PID" >> "$LOG"
  
  # 等待获取URL
  sleep 5
  URL=$(grep -o 'https://[^ ]*\.serveousercontent\.com' "$LOG" | tail -1)
  
  if [ -n "$URL" ]; then
    echo "[$(date)] 隧道已建立: $URL" >> "$LOG"
    # 将URL写入文件，方便读取
    echo "$URL" > /tmp/bbq-url.txt
  fi
  
  # 等待SSH进程退出（断线时会退出）
  wait $SSH_PID
  
  echo "[$(date)] 隧道断开，5秒后重连..." >> "$LOG"
  sleep 5
done
