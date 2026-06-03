const express = require('express');
const pino = require('pino');
const config = require('./config');
const { initializeWhatsApp, isWhatsAppConnected, disconnectWhatsApp } = require('./whatsapp');
const { initializeTelegram, isTelegramReady, stopTelegram, notifyOwner } = require('./telegram');

const app = express();
const logger = pino();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global variables
let whatsappReady = false;
let telegramReady = false;
let startTime = Date.now();

/**
 * Initialize all bot services
 */
async function initializeBots() {
  try {
    logger.info('🚀 Starting Wolf-bot...');
    logger.info(`Config: WhatsApp=${config.features.whatsapp}, Telegram=${config.features.telegram}`);

    // Initialize WhatsApp
    if (config.features.whatsapp) {
      try {
        await initializeWhatsApp();
        whatsappReady = true;
        logger.info('✅ WhatsApp service ready');
      } catch (error) {
        logger.error('WhatsApp initialization failed:', error.message);
        whatsappReady = false;
      }
    }

    // Initialize Telegram
    if (config.features.telegram) {
      try {
        initializeTelegram();
        telegramReady = true;
        logger.info('✅ Telegram service ready');
      } catch (error) {
        logger.error('Telegram initialization failed:', error.message);
        telegramReady = false;
      }
    }

    if (whatsappReady || telegramReady) {
      logger.info('✅ Wolf-bot is now running!');
    } else {
      logger.warn('⚠️ No services initialized. Please check configuration.');
    }
  } catch (error) {
    logger.error('Error initializing bots:', error);
    process.exit(1);
  }
}

/**
 * API Routes
 */

// Health check endpoint
app.get('/health', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${uptime}s`,
    services: {
      whatsapp: whatsappReady,
      telegram: telegramReady,
    },
  });
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    bot_name: 'Wolf-bot',
    version: '1.0.0',
    status: whatsappReady || telegramReady ? 'running' : 'stopped',
    whatsapp_connected: isWhatsAppConnected(),
    telegram_ready: isTelegramReady(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    features: config.features,
  });
});

// Info endpoint
app.get('/info', (req, res) => {
  res.json({
    name: 'Wolf-bot',
    version: '1.0.0',
    description: config.bot.welcomeMessage,
    author: 'saastechbot',
    prefix: config.bot.prefix,
    features: [
      'WhatsApp Automation',
      'Telegram Integration',
      'Command Handler',
      'Auto Replies',
      'Express Server',
    ],
  });
});

// Webhook endpoint (optional, for future use)
app.post('/webhook', (req, res) => {
  try {
    const data = req.body;
    logger.info('Webhook received:', data);
    res.json({ status: 'received' });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Not found handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    available_endpoints: ['/health', '/status', '/info', '/webhook'],
  });
});

// Error handler
app.use((error, req, res, next) => {
  logger.error('Server error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message,
  });
});

/**
 * Graceful shutdown
 */
async function gracefulShutdown() {
  logger.info('🛑 Shutting down Wolf-bot gracefully...');

  try {
    if (whatsappReady) {
      await disconnectWhatsApp();
    }
    if (telegramReady) {
      stopTelegram();
    }
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

/**
 * Start server
 */
async function startServer() {
  try {
    // Initialize bots
    await initializeBots();

    // Start Express server
    app.listen(config.server.port, config.server.host, () => {
      logger.info(`
╔════════════════════════════════╗
║      🤖 WOLF-BOT STARTED      ║
╚════════════════════════════════╝

Server: http://${config.server.host}:${config.server.port}
Status: http://${config.server.host}:${config.server.port}/status
Health: http://${config.server.host}:${config.server.port}/health

Features:
  • WhatsApp Bot: ${config.features.whatsapp ? '✅' : '❌'}
  • Telegram Bot: ${config.features.telegram ? '✅' : '❌'}
  • Auto Replies: ${config.features.autoReply ? '✅' : '❌'}
  • Command Handler: ${config.features.commandHandler ? '✅' : '❌'}

Prefix: ${config.bot.prefix}
Made with ❤️ by saastechbot
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
startServer();

module.exports = app;
