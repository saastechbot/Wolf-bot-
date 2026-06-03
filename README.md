# 🤖 Wolf-bot

A powerful WhatsApp and Telegram bot built with Baileys and node-telegram-bot-api. Supports commands, auto-replies, and easy deployment on platforms like Railway.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node.js-16+-green)

## ✨ Features

- ✅ **WhatsApp Automation** - Full WhatsApp Web integration using Baileys
- ✅ **Telegram Integration** - Complete Telegram bot support
- ✅ **Command Handler** - Extensible command system with prefix support
- ✅ **Auto Replies** - Automatic responses to incoming messages
- ✅ **Express Server** - Built-in REST API with health checks
- ✅ **Environment Configuration** - Easy setup with .env files
- ✅ **Error Logging** - Comprehensive logging with Pino
- ✅ **Graceful Shutdown** - Clean process termination

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn
- WhatsApp account (for WhatsApp bot)
- Telegram Bot Token (for Telegram bot)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/saastechbot/Wolf-bot-.git
cd Wolf-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
TELEGRAM_BOT_TOKEN=your_token_here
OWNER_NUMBER=+1234567890
OWNER_TELEGRAM=123456789
PORT=3000
PREFIX=!
```

### 4. Start the Bot

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## 📱 WhatsApp Setup

1. Run the bot: `npm start`
2. A QR code will appear in the terminal
3. Scan the QR code with your WhatsApp mobile app (Settings > Linked Devices > Link a Device)
4. The bot will auto-save your session in the `auth/` folder

## 🤖 Telegram Setup

1. Create a bot with [@BotFather](https://t.me/botfather) on Telegram
2. Get your bot token
3. Add it to `.env` as `TELEGRAM_BOT_TOKEN`
4. Start the bot

## 📖 Available Commands

### WhatsApp Commands

```
!ping         - Check if bot is alive
!menu         - Show command menu
!hello        - Get a greeting
!info         - Bot information
!echo [text]  - Echo your message
```

### Telegram Commands

```
/start        - Welcome message
/ping         - Check if bot is alive
/menu         - Show command menu
/help         - Get help
/info         - Bot information
/echo [text]  - Echo your message
```

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/status` | GET | Bot status and uptime |
| `/info` | GET | Bot information |
| `/webhook` | POST | Webhook receiver |

### Example Health Check

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

## 🗂️ Project Structure

```
Wolf-bot/
├── index.js           # Main entry point & Express server
├── config.js          # Configuration management
├── whatsapp.js        # WhatsApp bot logic
├── telegram.js        # Telegram bot logic
├── package.json       # Dependencies
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
├── auth/              # WhatsApp session (auto-created)
├── data/              # Database directory (optional)
└── README.md          # This file
```

## 🔧 Configuration

### config.js

The main configuration file contains:

- **WhatsApp Settings** - Connection, logging, browser config
- **Telegram Settings** - Token, polling options
- **Server Settings** - Port, host configuration
- **Bot Settings** - Prefix, auto-reply settings
- **Feature Flags** - Enable/disable services

### Environment Variables

```env
# WhatsApp
WHATSAPP_ENABLED=true

# Telegram
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN=your_token

# Server
PORT=3000
HOST=localhost

# Bot
PREFIX=!
OWNER_NUMBER=+1234567890
OWNER_TELEGRAM=123456789
AUTO_REPLY=true

# Logging
LOG_LEVEL=error

# Database (optional)
DB_ENABLED=false
DB_TYPE=sqlite
DB_PATH=./data/bot.db
```

## 🚢 Deployment

### Railway

1. Push to GitHub
2. Connect repository to Railway
3. Set environment variables in Railway dashboard
4. Deploy!

### Heroku

```bash
heroku create your-bot-name
git push heroku main
heroku config:set TELEGRAM_BOT_TOKEN=your_token
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t wolf-bot .
docker run -e TELEGRAM_BOT_TOKEN=your_token -p 3000:3000 wolf-bot
```

## 📝 Adding Custom Commands

Edit `whatsapp.js` in the `handleCommand()` function or `telegram.js` to add new commands:

```javascript
case 'yourcommand':
  await sendMessage(jid, 'Response here');
  break;
```

## 🛡️ Security Tips

1. **Keep `.env` secret** - Never commit it to GitHub
2. **Use strong tokens** - Generate secure Telegram bot tokens
3. **Enable error logging** - Monitor bot activity
4. **Validate inputs** - Sanitize user messages
5. **Rate limiting** - Prevent spam and abuse

## 🐛 Troubleshooting

### QR Code not appearing
- Ensure terminal supports UTF-8
- Check WhatsApp is not already connected
- Try running in a different terminal

### Telegram bot not responding
- Verify bot token is correct
- Check internet connection
- Ensure polling is enabled

### WhatsApp session keeps disconnecting
- Clear `auth/` folder and reconnect
- Check device compatibility
- Ensure no other instances are running

## 📊 Monitoring

Check bot status:
```bash
curl http://localhost:3000/status
```

View logs:
```bash
npm run dev  # Enables verbose logging
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**saastechbot**

- GitHub: [@saastechbot](https://github.com/saastechbot)
- Repository: [Wolf-bot-](https://github.com/saastechbot/Wolf-bot-)

## 🙏 Acknowledgments

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) - Telegram API
- [Express.js](https://expressjs.com/) - Web framework
- [Pino](https://getpino.io/) - Logger

## 💬 Support

For issues and questions:
- Open an [Issue](https://github.com/saastechbot/Wolf-bot-/issues)
- Check [Discussions](https://github.com/saastechbot/Wolf-bot-/discussions)
- Read the troubleshooting section above

## 📜 Disclaimer

This bot is for educational purposes. Use responsibly and follow platform terms of service.

---

**Made with ❤️ by saastechbot**

⭐ If you find this helpful, please star the repository!
