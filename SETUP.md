# 📋 Wolf-bot Setup Guide

Complete step-by-step setup instructions for Wolf-bot.

## Table of Contents

1. [Local Development](#local-development)
2. [WhatsApp Configuration](#whatsapp-configuration)
3. [Telegram Configuration](#telegram-configuration)
4. [Deployment](#deployment)
5. [Troubleshooting](#troubleshooting)

---

## Local Development

### Step 1: Prerequisites

Ensure you have:
- Node.js 16+ installed
- npm or yarn package manager
- Git installed
- A text editor (VS Code, Sublime, etc.)

Check versions:
```bash
node --version  # Should be v16+
npm --version   # Should be v7+
git --version   # Should be v2+
```

### Step 2: Clone Repository

```bash
git clone https://github.com/saastechbot/Wolf-bot-.git
cd Wolf-bot-
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs:
- `@whiskeysockets/baileys` - WhatsApp Web API
- `node-telegram-bot-api` - Telegram API
- `express` - Web framework
- `pino` - Logger
- `dotenv` - Environment variables

### Step 4: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Enable/disable services
WHATSAPP_ENABLED=true
TELEGRAM_ENABLED=true

# Telegram Bot Token (required if TELEGRAM_ENABLED=true)
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather

# Server Configuration
PORT=3000
HOST=localhost

# Bot Settings
PREFIX=!
OWNER_NUMBER=+1234567890
OWNER_TELEGRAM=123456789
AUTO_REPLY=true

# Logging
LOG_LEVEL=error
```

### Step 5: Start the Bot

```bash
npm start
```

You should see:
```
🚀 Starting Wolf-bot...
✅ WhatsApp service ready
✅ Telegram service ready
✅ Wolf-bot is now running!
```

---

## WhatsApp Configuration

### Getting WhatsApp Ready

1. **Start the bot:**
   ```bash
   npm start
   ```

2. **Scan QR Code:**
   - A QR code will appear in your terminal
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices > Link a Device
   - Scan the QR code with your phone

3. **Connection Established:**
   - Once scanned, the bot is connected
   - Session files are saved in `auth/` folder
   - You can now send commands to the bot

### Testing WhatsApp Commands

Send these messages to your WhatsApp account from another device/account:

```
!ping      → Bot responds: 🏓 Pong!
!menu      → Bot shows command menu
!hello     → Bot greets you
!info      → Bot info displayed
!echo hi   → Bot echoes: 📢 hi
```

### WhatsApp Best Practices

- **Don't share session files** - They contain your authentication
- **One instance at a time** - Don't run bot on multiple devices
- **Regular backups** - Save `auth/` folder periodically
- **Monitor logs** - Check for connection issues

---

## Telegram Configuration

### Step 1: Create Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Choose a name for your bot
4. Choose a username (must end with "bot")
5. BotFather will give you a token

### Step 2: Configure Bot

1. Copy the token from BotFather
2. Open `.env` file
3. Add token to `TELEGRAM_BOT_TOKEN`:
   ```env
   TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
   ```

### Step 3: Test Bot

1. Start the bot:
   ```bash
   npm start
   ```

2. Find your bot on Telegram by username
3. Send `/start` command
4. Bot should respond with welcome message

### Testing Telegram Commands

```
/start     → Welcome message
/ping      → Bot responds: 🏓 Pong!
/menu      → Bot shows command menu
/help      → Help information
/info      → Bot info
/echo hi   → Bot echoes: 📢 hi
```

### Setting Telegram User ID

1. Find your Telegram ID:
   - Search for [@userinfobot](https://t.me/userinfobot)
   - Send `/start`
   - It will show your ID

2. Add to `.env`:
   ```env
   OWNER_TELEGRAM=123456789
   ```

---

## Deployment

### Option 1: Railway (Recommended)

1. **Create Railway Account**
   - Visit [Railway.app](https://railway.app)
   - Sign in with GitHub

2. **Deploy**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `Wolf-bot-` repository
   - Railway auto-deploys

3. **Configure Environment**
   - Go to project settings
   - Add environment variables:
     ```
     TELEGRAM_BOT_TOKEN=your_token
     WHATSAPP_ENABLED=false    (optional, WhatsApp doesn't work well on Railway)
     TELEGRAM_ENABLED=true
     PORT=3000
     ```

4. **QR Code Limitation**
   - WhatsApp QR code can't be scanned on Railway
   - Consider running WhatsApp locally, Telegram on Railway

### Option 2: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create App**
   ```bash
   heroku create your-wolf-bot-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=your_token
   heroku config:set WHATSAPP_ENABLED=false
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View Logs**
   ```bash
   heroku logs --tail
   ```

### Option 3: Docker

1. **Create Dockerfile** (already included)

2. **Build Image**
   ```bash
   docker build -t wolf-bot:latest .
   ```

3. **Run Container**
   ```bash
   docker run \
     -e TELEGRAM_BOT_TOKEN=your_token \
     -e WHATSAPP_ENABLED=false \
     -p 3000:3000 \
     wolf-bot:latest
   ```

### Option 4: VPS (Ubuntu/Debian)

1. **SSH into Server**
   ```bash
   ssh user@your_server_ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository**
   ```bash
   git clone https://github.com/saastechbot/Wolf-bot-.git
   cd Wolf-bot-
   ```

4. **Install Dependencies**
   ```bash
   npm install --production
   ```

5. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your credentials
   ```

6. **Run with PM2** (for persistence)
   ```bash
   npm install -g pm2
   pm2 start index.js --name "wolf-bot"
   pm2 startup
   pm2 save
   ```

7. **Check Status**
   ```bash
   pm2 status
   pm2 logs wolf-bot
   ```

---

## Troubleshooting

### WhatsApp Issues

**Problem: QR code not showing**
- Solution: Use a terminal that supports UTF-8
- Try: `npm start 2>&1 | tee bot.log`

**Problem: "Already logged in"**
- Solution: Delete `auth/` folder and restart
- Command: `rm -rf auth/ && npm start`

**Problem: Connection drops frequently**
- Solution: Ensure no other WhatsApp Web sessions
- Check: Log out from WhatsApp Web on other devices

### Telegram Issues

**Problem: Bot not responding**
- Check token is correct in `.env`
- Verify bot username exists on Telegram
- Restart bot: `npm start`

**Problem: "401 Unauthorized"**
- Token is invalid or expired
- Get new token from @BotFather

### General Issues

**Problem: "Port already in use"**
- Solution: Change PORT in .env or kill process
- Command: `lsof -ti:3000 | xargs kill -9`

**Problem: "Cannot find module"**
- Solution: Reinstall dependencies
- Command: `rm -rf node_modules && npm install`

**Problem: Bot crashes on startup**
- Check `.env` file syntax
- Look for errors in logs
- Verify all required variables are set

---

## Testing API Endpoints

### Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-06-03T12:00:00Z",
  "uptime": "1234s",
  "services": {
    "whatsapp": true,
    "telegram": true
  }
}
```

### Status Check

```bash
curl http://localhost:3000/status
```

### Info Check

```bash
curl http://localhost:3000/info
```

---

## Next Steps

1. ✅ Complete setup
2. 📱 Test WhatsApp and Telegram
3. 🎨 Customize commands
4. 🚀 Deploy to your platform
5. 📊 Monitor with logs

---

## Additional Resources

- [Baileys Documentation](https://github.com/WhiskeySockets/Baileys)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Express Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**Need help?** Open an issue on GitHub: [Wolf-bot- Issues](https://github.com/saastechbot/Wolf-bot-/issues)
