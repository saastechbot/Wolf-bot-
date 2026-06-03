const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

/**
 * Get session path for a user
 */
function getSessionPath(chatId) {
  const sessionDir = process.env.SESSION_DIR || './sessions';
  return path.join(sessionDir, `auth_${chatId}`);
}

/**
 * Connect to WhatsApp using Baileys
 */
async function connectWhatsApp(sessionPath, chatId, logger) {
  try {
    // Ensure session directory exists
    if (!fs.existsSync(sessionPath)) {
      fs.mkdirSync(sessionPath, { recursive: true });
    }

    // Get or create auth state
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    // Create socket
    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: process.env.BAILEYS_LOG_LEVEL || 'error' }),
      printQRInTerminal: false,
      browser: [process.env.BAILEYS_BROWSER_TYPE || 'Chrome', 'Chrome', '120'],
      syncFullHistory: false,
      shouldCatchQueryErrors: true,
      retryRequestDelayMs: 10,
    });

    // Handle credential updates
    sock.ev.on('creds.update', saveCreds);

    // Handle connection updates
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, isNewLogin } = update;

      if (isNewLogin) {
        logger.info(`New login for user ${chatId}`);
      }

      if (connection === 'open') {
        logger.info(`WhatsApp connected for user ${chatId}`);
      } else if (connection === 'close') {
        const reason = new Error(lastDisconnect?.error)?.message;
        const statusCode = lastDisconnect?.error?.output?.statusCode;

        if (statusCode === DisconnectReason.loggedOut) {
          logger.info(`User ${chatId} logged out`);
        } else if (statusCode === DisconnectReason.deviceReset) {
          logger.info(`Device reset for user ${chatId}`);
        }
      }
    });

    // Handle incoming messages
    sock.ev.on('messages.upsert', async (m) => {
      await handleIncomingMessage(m, sock, chatId, logger);
    });

    return sock;
  } catch (error) {
    logger.error(`Error connecting WhatsApp for user ${chatId}:`, error);
    throw error;
  }
}

/**
 * Handle incoming WhatsApp messages
 */
async function handleIncomingMessage(m, sock, chatId, logger) {
  try {
    const message = m.messages[0];

    if (!message.message) return;

    const jid = message.key.remoteJid;
    const sender = message.key.participant || jid;
    const messageText = message.message.conversation || message.message.extendedTextMessage?.text || '';

    if (!messageText) return;

    logger.info(`Message from ${sender}: ${messageText}`);

    // Handle commands
    if (messageText.startsWith('.')) {
      await handleWhatsAppCommand(messageText, jid, sock, logger);
    }
  } catch (error) {
    logger.error('Error handling incoming message:', error);
  }
}

/**
 * Handle WhatsApp commands
 */
async function handleWhatsAppCommand(text, jid, sock, logger) {
  const command = text.slice(1).split(' ')[0].toLowerCase();
  const args = text.slice(1).split(' ').slice(1);

  try {
    switch (command) {
      case 'menu':
        await sendWhatsAppMessage(
          jid,
          sock,
          `
╔════════════════════════════════╗
║   🤖 SIMON TECH BOT MENU       ║
╚════════════════════════════════╝

.menu - Show this menu
.ping - Check response speed
.uptime - Show bot uptime
.speed - Performance check

Made with ❤️ by saastechbot
        `
        );
        break;

      case 'ping':
        const startTime = Date.now();
        await sendWhatsAppMessage(jid, sock, '🏓 Pong! Testing...');
        const responseTime = Date.now() - startTime;
        await sendWhatsAppMessage(jid, sock, `🏓 Pong!\n⚡ Response time: ${responseTime}ms`);
        logger.info(`Ping command executed: ${responseTime}ms`);
        break;

      case 'uptime':
        const uptime = Math.floor(process.uptime());
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        await sendWhatsAppMessage(
          jid,
          sock,
          `⏱️ Bot Uptime\n${hours}h ${minutes}m ${seconds}s`
        );
        break;

      case 'speed':
        const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const cpuUsage = process.cpuUsage();
        await sendWhatsAppMessage(
          jid,
          sock,
          `
⚡ Performance Check

Memory: ${memUsage} MB
CPU User: ${(cpuUsage.user / 1000).toFixed(2)}ms
CPU System: ${(cpuUsage.system / 1000).toFixed(2)}ms
Uptime: ${process.uptime().toFixed(2)}s
        `
        );
        break;

      default:
        await sendWhatsAppMessage(jid, sock, `❌ Command "${command}" not found. Type .menu for help.`);
    }
  } catch (error) {
    logger.error(`Error executing command ${command}:`, error);
    await sendWhatsAppMessage(jid, sock, `❌ Error executing command: ${error.message}`);
  }
}

/**
 * Send message via WhatsApp
 */
async function sendWhatsAppMessage(jid, sock, text) {
  try {
    await sock.sendMessage(jid, { text });
  } catch (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
}

/**
 * Disconnect WhatsApp session
 */
async function disconnectWhatsApp(sock) {
  try {
    if (sock) {
      await sock.end();
    }
  } catch (error) {
    throw new Error(`Failed to disconnect: ${error.message}`);
  }
}

module.exports = {
  connectWhatsApp,
  disconnectWhatsApp,
  getSessionPath,
  sendWhatsAppMessage,
  handleIncomingMessage,
};
