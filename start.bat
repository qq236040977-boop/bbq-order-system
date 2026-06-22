@echo off
chcp 65001 >nul
title 老六烧烤点单系统
echo.
echo   🍖 烧烤小炒点单系统 v1.0
echo   ──────────────────────────
echo.
echo   启动中...
echo.
cd /d "%~dp0"
node server.js
pause
