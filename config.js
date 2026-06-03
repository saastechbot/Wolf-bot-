// Configuration file for Wolf-bot
require('dotenv').config();

const config = {
  // WhatsApp Bot Configuration
  whatsapp: {
    autoReconnect: true,
    printQRInTerminal: true,
    logger: process.env.LOG_LEVEL || 'error',
    browser: ['Chrome', 'Chrome', '120'],
    sessionId: 'Wolf-bot-session'
  },

  // Telegram Bot Configuration
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN || '',
    polling: {
      interval: 300,
      autoStart: true,
      params: {
        timeout: 10,
        limit: 100,
        allowed_updates: ['message']
      }
    }
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  },

  // Bot Settings
  bot: {
    prefix: process.env.PREFIX || '!',
    owner: process.env.OWNER_NUMBER || '', // WhatsApp number with country code
    ownerTelegram: process.env.OWNER_TELEGRAM || '', // Telegram chat ID
    autoReply: process.env.AUTO_REPLY === 'true' || true,
    welcomeMessage: process.env.WELCOME_MESSAGE || 'Welcome to Wolf-bot! 🤖'
  },

  // Database Configuration (optional)
  database: {
    enabled: process.env.DB_ENABLED === 'true' || false,
    type: process.env.DB_TYPE || 'sqlite',
    path: process.env.DB_PATH || './data/bot.db'
  },

  // Feature Flags
  features: {
    whatsapp: process.env.WHATSAPP_ENABLED !== 'false' || true,
    telegram: process.env.TELEGRAM_ENABLED !== 'false' || true,
    autoReply: true,
    commandHandler: true,
    errorLogging: true
  }
};

module.exports = config;
