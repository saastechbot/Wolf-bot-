require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const pino = require('pino');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { connectWhatsApp, disconnectWhatsApp, getSessionPath, sendWhatsAppMessage } = require('./src/whatsapp');
const { formatPhoneNumber, validatePhoneNumber } = require('./src/utils');

const logger = pino({ level: process.env.LOG_LEVEL || 'error' });
const app = express();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// State management
const userState = new Map();
const whatsappSessions = new Map();

// Middleware
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ============================================
// TELEGRAM BOT HANDLERS
// ============================================

/**
 * /start command - Welcome message
 */
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeText = `
🤖 **SIMON TECH BOT v2.0**

👋 Welcome to Simon Tech Bot!

I'm a powerful WhatsApp automation bot controlled via Telegram.

**Available Commands:**
/help - Show all available commands
/connect <phone> - Connect to WhatsApp
/pair <phone> - Alias of connect

**Phone Format:**
📱 Use international format
📍 Example: 2348012345678 (Nigeria)
📍 Example: 12125552368 (USA)

**Features:**
✅ Telegram control system
✅ WhatsApp automation
✅ Session management
✅ Pairing code system

Type /help for more information.
  `;
  bot.sendMessage(chatId, welcomeText, { parse_mode: 'Markdown' });
  logger.info(`User ${chatId} started bot`);
});

/**
 * /help command - List all commands
 */
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpText = `
📚 **HELP - AVAILABLE COMMANDS**

**Control Commands:**
/start - Welcome message
/help - This message
/connect <phone> - Connect WhatsApp
/pair <phone> - Connect WhatsApp (alias)

**Phone Number Format:**
Use international format without + or spaces

Examples:
• 2348012345678 (Nigeria)
• 12125552368 (USA)
• 447911123456 (UK)
• 33123456789 (France)

**Flow:**
1️⃣ Send /connect with phone number
2️⃣ Bot generates WhatsApp pairing code
3️⃣ You receive the code via Telegram
4️⃣ Enter code in WhatsApp Linked Devices
5️⃣ WhatsApp bot becomes active

**WhatsApp Commands (After Connection):**
.menu - Show bot menu
.ping - Check bot response speed
.uptime - Show bot uptime
.speed - Performance check

**Support:**
If you have issues:
• Check phone number format
• Ensure WhatsApp is installed
• Try again after 1 minute
  `;
  bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

/**
 * /connect and /pair commands - Connect to WhatsApp
 */
bot.onText(/\/(?:connect|pair)\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const phoneNumber = match[1].trim();

  try {
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      const errorMsg = `❌ **Invalid phone number format**

You entered: ${phoneNumber}

Please use international format:
• 2348012345678 (Nigeria)
• 12125552368 (USA)
• 447911123456 (UK)

Example: /connect 2348012345678`;
      bot.sendMessage(chatId, errorMsg, { parse_mode: 'Markdown' });
      return;
    }

    // Check if already connecting
    if (userState.has(chatId) && userState.get(chatId).connecting) {
      bot.sendMessage(chatId, '⏳ Already connecting to WhatsApp. Please wait...');
      return;
    }

    // Set connecting state
    userState.set(chatId, { connecting: true, phoneNumber });

    // Send processing message
    const processingMsg = await bot.sendMessage(chatId, '⏳ Connecting to WhatsApp...\n🔄 Please wait...');

    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);

    logger.info(`User ${chatId} requesting WhatsApp connection for ${formattedPhone}`);

    // Connect to WhatsApp
    const sessionPath = getSessionPath(chatId);
    const sock = await connectWhatsApp(sessionPath, chatId, logger);

    // Request pairing code
    bot.editMessageText('📱 Requesting WhatsApp pairing code...\n🔄 Please wait...', {
      chat_id: chatId,
      message_id: processingMsg.message_id,
    });

    const pairingCode = await sock.requestPairingCode(formattedPhone);

    // Store session
    whatsappSessions.set(chatId, {
      sock,
      sessionPath,
      phoneNumber: formattedPhone,
      createdAt: new Date(),
    });

    // Send pairing code
    const codeMsg = `
✅ **WhatsApp Pairing Code Generated!**

🔐 Your Pairing Code: \`${pairingCode}\`

📱 **Next Steps:**
1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
3. Click "Link a Device"
4. Enter this code when prompted:
\`${pairingCode}\`

⏰ Code expires in 10 minutes

ℹ️ Don't share this code with anyone!
    `;

    bot.editMessageText(codeMsg, {
      chat_id: chatId,
      message_id: processingMsg.message_id,
      parse_mode: 'Markdown',
    });

    // Clear connecting state after timeout
    setTimeout(() => {
      if (userState.has(chatId)) {
        userState.delete(chatId);
      }
    }, 600000); // 10 minutes

    logger.info(`Pairing code sent to user ${chatId}`);
  } catch (error) {
    logger.error(`Error connecting WhatsApp for user ${chatId}:`, error);

    const errorResponse = `❌ **Connection Error**

${error.message}

Troubleshooting:
• Check phone number format
• Ensure WhatsApp is installed
• Try again after 1 minute
• Check internet connection`;

    bot.sendMessage(chatId, errorResponse, { parse_mode: 'Markdown' });

    // Clear state
    if (userState.has(chatId)) {
      userState.delete(chatId);
    }
  }
});

/**
 * Handle all other messages (user input)
 */
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Skip if already a command
  if (text && text.startsWith('/')) {
    return;
  }

  // Send help message for unknown input
  const helpMsg = `ℹ️ Unknown command

Use /help to see available commands`;
  bot.sendMessage(chatId, helpMsg);
});

/**
 * Handle Telegram errors
 */
bot.on('error', (error) => {
  logger.error('Telegram bot error:', error);
});

// ============================================
// EXPRESS ROUTES
// ============================================

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeSessions: whatsappSessions.size,
    uptime: process.uptime(),
  });
});

/**
 * Status endpoint
 */
app.get('/status', (req, res) => {
  res.json({
    bot: 'Simon Tech Bot v2.0',
    telegram: 'connected',
    sessions: Array.from(whatsappSessions.entries()).map(([chatId, session]) => ({
      chatId,
      phoneNumber: session.phoneNumber,
      createdAt: session.createdAt,
    })),
    uptime: Math.floor(process.uptime()),
  });
});

// ============================================
// SERVER STARTUP
// ============================================

/**
 * Start server
 */
function startServer() {
  // Create required directories
  const dirs = [process.env.SESSION_DIR || './sessions', process.env.AUTH_DIR || './auth'];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });

  app.listen(PORT, process.env.HOST || 'localhost', () => {
    logger.info(`
╔════════════════════════════════════╗
║   🤖 SIMON TECH BOT v2.0 STARTED   ║
╚════════════════════════════════════╝

Telegram: Connected
WhatsApp: Ready for pairing

Server: http://${process.env.HOST || 'localhost'}:${PORT}
Health: http://${process.env.HOST || 'localhost'}:${PORT}/health
Status: http://${process.env.HOST || 'localhost'}:${PORT}/status

Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing'}
Chat ID: ${TELEGRAM_CHAT_ID ? '✅ Set' : '⚠️ Optional'}

Ready to pair WhatsApp accounts!
    `);
  });
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');

  // Disconnect all WhatsApp sessions
  for (const [chatId, session] of whatsappSessions) {
    try {
      await disconnectWhatsApp(session.sock);
      logger.info(`Disconnected WhatsApp session for user ${chatId}`);
    } catch (error) {
      logger.error(`Error disconnecting session ${chatId}:`, error);
    }
  }

  process.exit(0);
});

// Start the server
startServer();

module.exports = { bot, whatsappSessions, userState };
