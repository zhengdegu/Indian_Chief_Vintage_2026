@echo off
setlocal
title Chief Vintage - Local 3D Preview
cd /d "%~dp0"

set "CHIEF_NODE="
for /f "delims=" %%F in ('where node.exe 2^>nul') do if not defined CHIEF_NODE set "CHIEF_NODE=%%F"
if not defined CHIEF_NODE if exist "%ProgramFiles%\nodejs\node.exe" set "CHIEF_NODE=%ProgramFiles%\nodejs\node.exe"
if not defined CHIEF_NODE if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "CHIEF_NODE=%LOCALAPPDATA%\Programs\nodejs\node.exe"
if not defined CHIEF_NODE (
  echo Node.js was not found. Install Node.js LTS, then run this file again.
  echo https://nodejs.org/
  pause
  exit /b 1
)

"%CHIEF_NODE%" -e "const [ma,mi]=process.versions.node.split('.').map(Number);process.exit(ma>22||(ma===22&&mi>=12)||(ma===20&&mi>=19)?0:1)"
if errorlevel 1 (
  echo This page needs Node.js 20.19+ or 22.12+. Please install a current LTS version.
  pause
  exit /b 1
)
for %%F in ("%CHIEF_NODE%") do set "CHIEF_NODE_DIR=%%~dpF"
set "PATH=%CHIEF_NODE_DIR%;%PATH%"
set "CHIEF_NPM=%CHIEF_NODE_DIR%node_modules\npm\bin\npm-cli.js"
if not exist "%CHIEF_NPM%" (
  echo npm was not found beside Node.js. Reinstall Node.js with npm included.
  pause
  exit /b 1
)

powershell.exe -NoProfile -Command "try { $p = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4173' -TimeoutSec 2; if ($p.StatusCode -eq 200 -and $p.Content -match 'CHIEF VINTAGE') { exit 0 } } catch {}; exit 1" >nul 2>&1
if not errorlevel 1 (
  start "" "http://127.0.0.1:4173"
  echo The Chief Vintage preview is already running.
  exit /b 0
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Installing local dependencies...
  "%CHIEF_NODE%" "%CHIEF_NPM%" ci --no-audit --no-fund
  if errorlevel 1 (
    echo Dependency installation failed. Check the network and retry.
    pause
    exit /b 1
  )
)

echo Opening http://127.0.0.1:4173 when the server is ready.
echo Keep this window open. Press Ctrl+C to stop the preview.
start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "$u = 'http://127.0.0.1:4173'; for ($i=0; $i -lt 60; $i++) { try { $p = Invoke-WebRequest -UseBasicParsing -Uri $u -TimeoutSec 2; if ($p.StatusCode -eq 200 -and $p.Content -match 'CHIEF VINTAGE') { Start-Process $u; exit } } catch {}; Start-Sleep -Milliseconds 500 }"
"%CHIEF_NODE%" "%CHIEF_NPM%" run dev -- --strictPort
if errorlevel 1 (
  echo The preview server could not start. Port 4173 may be occupied by another app.
  pause
  exit /b 1
)
endlocal
