const TelegramBot = require('node-telegram-bot-api');
const pino = require('pino');
const config = require('./config');

const logger = pino({ level: 'info' });
let bot;

/**
 * Initialize Telegram bot
 */
function initializeTelegram() {
  try {
    if (!config.telegram.token) {
      logger.warn('Telegram token not configured, skipping Telegram initialization');
      return null;
    }

    logger.info('Initializing Telegram bot...');

    bot = new TelegramBot(config.telegram.token, config.telegram.polling);

    // Handle /start command
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const welcome = `
🤖 Welcome to Wolf-bot!

I'm a powerful automation bot that can help you with various tasks.

Available commands:
/menu - Show available commands
/help - Get help
/info - Bot information
/echo [text] - Echo your message
/ping - Check if bot is alive
      `;
      bot.sendMessage(chatId, welcome);
      logger.info(`Telegram /start command from ${chatId}`);
    });

    // Handle /menu command
    bot.onText(/\/menu/, (msg) => {
      const chatId = msg.chat.id;
      sendTelegramMenu(chatId);
    });

    // Handle /ping command
    bot.onText(/\/ping/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, '🏓 Pong!');
      logger.info(`Telegram /ping command from ${chatId}`);
    });

    // Handle /help command
    bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      const helpText = `
📚 *Help Guide*

*Available Commands:*
/start - Welcome message
/menu - Show menu
/help - This message
/info - Bot information
/echo [text] - Echo message
/ping - Check bot status

*How to use:*
1. Type a command starting with /
2. Follow any prompts
3. Get instant responses

Need more help? Contact the bot owner.
      `;
      bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
    });

    // Handle /info command
    bot.onText(/\/info/, (msg) => {
      const chatId = msg.chat.id;
      const infoText = `
ℹ️ *Bot Information*

*Name:* Wolf-bot
*Version:* 1.0.0
*Platform:* Telegram & WhatsApp
*Status:* Active ✅

Built with ❤️ by saastechbot
      `;
      bot.sendMessage(chatId, infoText, { parse_mode: 'Markdown' });
    });

    // Handle /echo command
    bot.onText(/\/echo(.+)?/, (msg, match) => {
      const chatId = msg.chat.id;
      const echoText = (match[1] || '').trim() || 'Nothing to echo!';
      bot.sendMessage(chatId, `📢 ${echoText}`);
      logger.info(`Telegram /echo command from ${chatId}`);
    });

    // Handle all other text messages
    bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      // Skip if message is a command
      if (text && text.startsWith('/')) {
        return;
      }

      // Auto reply
      if (config.bot.autoReply) {
        const autoReply = `
Thanks for your message! 👋

I'm Wolf-bot, your automation assistant.

Type /menu to see available commands.
        `;
        bot.sendMessage(chatId, autoReply);
        logger.info(`Auto-reply sent to ${chatId}`);
      }
    });

    // Handle errors
    bot.on('error', (error) => {
      logger.error('Telegram bot error:', error);
    });

    logger.info('✅ Telegram bot initialized successfully!');
    return bot;
  } catch (error) {
    logger.error('Error initializing Telegram bot:', error);
    return null;
  }
}

/**
 * Send menu to Telegram user
 */
function sendTelegramMenu(chatId) {
  const menu = `
╔════════════════════════╗
║    🤖 WOLF-BOT MENU    ║
╚════════════════════════╝

/start - Welcome message
/ping - Check if bot is alive
/menu - Show this menu
/help - Get help
/info - Bot information
/echo [text] - Echo your message

Made with ❤️ by saastechbot
  `;

  bot.sendMessage(chatId, menu);
  logger.info(`Menu sent to ${chatId}`);
}

/**
 * Send message via Telegram
 */
function sendTelegramMessage(chatId, text, options = {}) {
  try {
    bot.sendMessage(chatId, text, options);
    logger.info(`Telegram message sent to ${chatId}`);
  } catch (error) {
    logger.error('Error sending Telegram message:', error);
  }
}

/**
 * Broadcast message to owner
 */
function notifyOwner(text) {
  if (config.bot.ownerTelegram && bot) {
    try {
      bot.sendMessage(config.bot.ownerTelegram, text);
      logger.info('Notification sent to owner');
    } catch (error) {
      logger.error('Error notifying owner:', error);
    }
  }
}

/**
 * Check if Telegram bot is ready
 */
function isTelegramReady() {
  return bot !== null && bot !== undefined;
}

/**
 * Stop Telegram bot
 */
function stopTelegram() {
  if (bot) {
    bot.stopPolling();
    logger.info('Telegram bot stopped');
  }
}

module.exports = {
  initializeTelegram,
  sendTelegramMessage,
  notifyOwner,
  isTelegramReady,
  stopTelegram,
};
