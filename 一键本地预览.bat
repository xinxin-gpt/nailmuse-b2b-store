@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Dedxc B2B Website Preview

echo ========================================
echo   美甲 B2B 独立站 - 本地预览
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 电脑还没有安装 Node.js。
  echo 请先安装 Node.js LTS 版本，然后重新双击本文件。
  echo 官网：https://nodejs.org/
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [1/2] 首次运行，正在安装网站依赖...
  call npm install
  if errorlevel 1 (
    echo.
    echo [错误] 依赖安装失败，请检查网络后重试。
    pause
    exit /b 1
  )
) else (
  echo [1/2] 网站依赖已经安装。
)

echo [2/2] 正在启动网站...
echo 浏览器将打开：http://localhost:3000
echo 后台导入页：http://localhost:3000/admin/import
echo.
echo 关闭本窗口即可停止预览。

start "" cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:3000"
call npm run dev

pause
