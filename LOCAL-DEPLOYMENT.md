# 🚀 Deploy Your Momentum PWA Locally

## Quick Local Deployment

### Option 1: Simple HTTP Server
```bash
# Install a simple server
npm install -g http-server

# Build your app
npm run build

# Serve the built files
cd dist
http-server -p 8080 -a 0.0.0.0
```

### Option 2: Python Server
```bash
# Build your app
npm run build

# Serve with Python
cd dist
python -m http.server 8080
```

### Option 3: Node.js Server
```bash
# Build your app
npm run build

# Serve with Node.js
cd dist
npx serve -p 8080
```

## 📱 Install on iPhone

1. **Find your computer's IP address:**
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`

2. **Open Safari on iPhone:**
   - Go to: `http://YOUR_IP:8080`
   - Example: `http://192.168.1.100:8080`

3. **Install the app:**
   - Tap the Share button (square with arrow)
   - Tap "Add to Home Screen"
   - Tap "Add" - Done! 🎉

## ✅ What You Get:
- ✅ **Real app icon** on home screen
- ✅ **Works offline** completely
- ✅ **Stores all your data** locally
- ✅ **No internet needed** after first visit
- ✅ **Native app experience**

## 🔧 Troubleshooting

### "Add to Home Screen" Not Available
- Make sure you're using **Safari** (not Chrome)
- Try **refreshing** the page
- Check that the URL starts with **http://**

### App Won't Work Offline
- **First visit** while connected to your local server
- **Wait** for it to fully load
- **Close and reopen** - now works offline!

### Can't Access from iPhone
- Make sure both devices are on **same WiFi**
- Check **firewall settings** on your computer
- Try **different port** if 8080 doesn't work

---

**🎉 Your app is now a real iOS app!** It stores all data locally and works offline!
