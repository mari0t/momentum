@echo off
echo 🔨 Building Momentum App...
echo.

REM Build the app
npm run build

echo.
echo ✅ Build complete! 
echo 🚀 Starting production preview...
echo 🌐 Opening in browser...
echo.

REM Start preview server
npm run preview

pause
