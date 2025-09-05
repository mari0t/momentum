@echo off
echo Refreshing desktop icon cache...
taskkill /f /im explorer.exe
timeout /t 2 /nobreak >nul
start explorer.exe
echo Desktop refreshed! Check your shortcut now.
pause
