# 🤖 Simon Tech Bot v2.0

A production-ready Node.js bot with **Telegram control system** and **WhatsApp automation** using Baileys pairing code.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node.js-18+-green)

## ✨ Features

- ✅ **Telegram Control System** - Full command interface via Telegram
- ✅ **WhatsApp Pairing** - Secure pairing code generation
- ✅ **Session Management** - Auto-save and restore sessions
- ✅ **Multi-User Support** - Handle multiple WhatsApp accounts
- ✅ **Command System** - `.menu`, `.ping`, `.uptime`, `.speed`
- ✅ **Production Ready** - Error handling, logging, graceful shutdown
- ✅ **Express API** - Health checks and status endpoints

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Telegram Bot Token (from @BotFather)
- Active Telegram account
- WhatsApp installed on a phone

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd simon-bot
npm install
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` with your credentials:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_id_here
PORT=3000
NODE_ENV=production
LOG_LEVEL=error
```

**Get Telegram Bot Token:**
1. Open Telegram and search for @BotFather
2. Send `/newbot`
3. Choose a name and username
4. Copy the token

**Get Your Telegram Chat ID:**
1. Search for @userinfobot
2. Send `/start`
3. Your ID will be displayed

### 3. Start the Bot

```bash
npm start
```

You should see:

```
╔════════════════════════════════════╗
║   🤖 SIMON TECH BOT v2.0 STARTED   ║
╚════════════════════════════════════╝

Telegram: Connected
WhatsApp: Ready for pairing
```

## 📱 Usage

### Telegram Commands

#### `/start`

Welcome message with bot info

```
/start
```

#### `/help`

List all available commands and phone format examples

```
/help
```

#### `/connect <phone>` or `/pair <phone>`

Connect a WhatsApp account using pairing code

```
/connect 2348012345678
/pair 12125552368
```

**Phone Format:**
- Use international format WITHOUT + or spaces
- Must include country code
- Examples:
  - 🇳🇬 Nigeria: `2348012345678`
  - 🇺🇸 USA: `12125552368`
  - 🇬🇧 UK: `447911123456`
  - 🇫🇷 France: `33123456789`

### WhatsApp Commands

After successful connection, use these commands in WhatsApp:

#### `.menu`

Show bot menu with all available commands

```
.menu
```

#### `.ping`

Check bot response speed (latency)

```
.ping
```

Response:
```
🏓 Pong!
⚡ Response time: 145ms
```

#### `.uptime`

Show how long the bot has been running

```
.uptime
```

Response:
```
⏱️ Bot Uptime
2h 15m 42s
```

#### `.speed`

Performance check (memory, CPU, uptime)

```
.speed
```

Response:
```
⚡ Performance Check

Memory: 45.32 MB
CPU User: 12.50ms
CPU System: 8.30ms
Uptime: 8142.50s
```

## 🔄 Connection Flow

```
┌─────────────────────────────────────────────────────┐
│ 1. User sends /connect with phone number            │
│    /connect 2348012345678                           │
└─────────────┬───────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────┐
│ 2. Bot validates phone number format                │
└─────────────┬───────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────┐
│ 3. Bot connects to WhatsApp via Baileys             │
└─────────────┬───────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────┐
│ 4. Bot requests pairing code                        │
│    sock.requestPairingCode(phoneNumber)             │
└─────────────┬───────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────┐
│ 5. Bot sends code to Telegram user                  │
│    Example: 423-456-789                             │
└─────────────┬───────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────┐
│ 6. User enters code in WhatsApp Linked Devices      │
│    Settings → Linked Devices → Link a Device       │
└─────────────┬───────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────┐
│ 7. WhatsApp connection established                  │
│    Bot can now receive and send messages            │
└─────────────────────────────────────────────────────┘
```

## 🗂️ Project Structure

```
simon-bot/
├── index.js              # Main entry point
├── package.json          # Dependencies
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── src/
│   ├── whatsapp.js       # WhatsApp connection & commands
│   └── utils.js          # Utility functions
├── sessions/             # WhatsApp sessions (auto-created)
├── auth/                 # Auth data (auto-created)
└── logs/                 # Log files (auto-created)
```

## 💾 Session Management

Sessions are automatically saved in `sessions/auth_<chatId>/` directory.

**Benefits:**
- No need to re-authenticate
- Quick reconnection
- Persistent bot state
- Multi-user support

**Structure:**
```
sessions/
├── auth_123456789/
│   ├── creds.json
│   ├── pre-keys/
│   └── app-state-sync-key-id/
└── auth_987654321/
    └── ...
```

## 🌐 API Endpoints

### Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-06-03T12:00:00.000Z",
  "activeSessions": 2,
  "uptime": 3600.5
}
```

### Status

```bash
GET /status
```

Response:
```json
{
  "bot": "Simon Tech Bot v2.0",
  "telegram": "connected",
  "sessions": [
    {
      "chatId": 123456789,
      "phoneNumber": "2348012345678",
      "createdAt": "2024-06-03T12:00:00.000Z"
    }
  ],
  "uptime": 3600
}
```

## ⚙️ Configuration

### Environment Variables

```env
# TELEGRAM
TELEGRAM_BOT_TOKEN      # Required: Bot token from @BotFather
TELEGRAM_CHAT_ID        # Optional: Your Telegram chat ID

# SERVER
PORT                    # Server port (default: 3000)
HOST                    # Server host (default: localhost)
NODE_ENV                # Environment (production/development)

# LOGGING
LOG_LEVEL               # Logging level (error/warn/info/debug)

# BAILEYS
BAILEYS_LOG_LEVEL       # Baileys logger level
BAILEYS_BROWSER_TYPE    # Browser type (Chrome/Firefox/Safari)

# STORAGE
SESSION_DIR             # Session storage directory
AUTH_DIR                # Auth storage directory
```

## 🔒 Security

### Best Practices

1. **Keep `.env` secret** - Never commit to Git
2. **Use strong tokens** - Generated by @BotFather
3. **Validate inputs** - Phone numbers are validated
4. **Secure sessions** - Stored locally with proper permissions
5. **HTTPS only** - Use in production
6. **Rate limiting** - Implement to prevent abuse

### Session Protection

- Sessions stored in `auth_<chatId>/` folders
- Credentials stored securely
- Not shared between users
- Auto-cleanup on disconnect

## 🐛 Troubleshooting

### Bot not responding

```
❌ Problem: Bot doesn't reply to commands
✅ Solution:
   1. Check TELEGRAM_BOT_TOKEN is correct
   2. Verify internet connection
   3. Restart bot: npm start
```

### Invalid phone number

```
❌ Problem: "Invalid phone number format"
✅ Solution:
   • Use international format: 2348012345678
   • Don't use + or spaces
   • Include country code
   • Use /help to see examples
```

### Pairing code not generated

```
❌ Problem: "Failed to generate pairing code"
✅ Solution:
   1. Check phone number format
   2. Ensure WhatsApp is installed on phone
   3. Check internet connection
   4. Try again after 1 minute
```

### Session not persisting

```
❌ Problem: Bot disconnects after restart
✅ Solution:
   1. Check sessions/ folder exists
   2. Verify write permissions
   3. Check disk space
   4. Delete sessions/ and reconnect
```

## 📊 Logs

View logs with:

```bash
# Development mode (verbose)
npm run dev

# Production mode (errors only)
LOG_LEVEL=error npm start

# Change log level
LOG_LEVEL=info npm start
```

## 🚀 Deployment

### Docker

```bash
# Build
docker build -t simon-bot .

# Run
docker run -e TELEGRAM_BOT_TOKEN=your_token -p 3000:3000 simon-bot
```

### Railway

1. Push to GitHub
2. Connect to Railway
3. Set `TELEGRAM_BOT_TOKEN` environment variable
4. Deploy

### Heroku

```bash
heroku create your-app-name
heroku config:set TELEGRAM_BOT_TOKEN=your_token
git push heroku main
```

## 📝 Scripts

```bash
# Start production server
npm start

# Start with auto-reload (development)
npm run dev

# Test
npm test
```

## 🤝 Contributing

Contributions welcome! Please:

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file

## 👤 Author

**saastechbot**

- GitHub: [@saastechbot](https://github.com/saastechbot)
- Project: [Simon Tech Bot](https://github.com/saastechbot/Wolf-bot-)

## 🙏 Acknowledgments

- [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) - Telegram API
- [Express.js](https://expressjs.com/) - Web framework
- [Pino](https://getpino.io/) - Logger

## 📞 Support

- Open an issue: [GitHub Issues](https://github.com/saastechbot/Wolf-bot-/issues)
- Check documentation: [README.md](./README.md)
- View examples: [Commands Guide](./COMMANDS.md)

---

**Made with ❤️ by saastechbot**

⭐ If you find this helpful, please star the repository!
