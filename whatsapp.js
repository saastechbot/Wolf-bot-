const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  MessageRetryMap,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const config = require('./config');

const logger = pino({ level: config.whatsapp.logger });

let sock;
let isConnected = false;

/**
 * Initialize WhatsApp bot connection
 */
async function initializeWhatsApp() {
  try {
    logger.info('Initializing WhatsApp connection...');
    const { state, saveCreds } = await useMultiFileAuthState('auth');

    sock = makeWASocket({
      auth: state,
      logger,
      printQRInTerminal: config.whatsapp.printQRInTerminal,
      browser: config.whatsapp.browser,
      retryRequestDelayMs: 10,
      msgRetryCounterMap: new MessageRetryMap(600),
      shouldCatchQueryErrors: true,
      syncFullHistory: false,
    });

    // Save credentials when updated
    sock.ev.on('creds.update', saveCreds);

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        logger.info('QR Code updated - Scan with WhatsApp to connect');
      }

      if (connection === 'close') {
        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

        logger.error(
          `Connection closed due to ${lastDisconnect?.error?.message}`,
          { shouldReconnect }
        );

        if (shouldReconnect && config.whatsapp.autoReconnect) {
          setTimeout(() => initializeWhatsApp(), 3000);
        } else {
          isConnected = false;
        }
      } else if (connection === 'open') {
        isConnected = true;
        logger.info('✅ WhatsApp bot connected successfully!');
      }
    });

    // Handle incoming messages
    sock.ev.on('messages.upsert', async (m) => {
      handleIncomingMessage(m);
    });

    return sock;
  } catch (error) {
    logger.error('Error initializing WhatsApp:', error);
    throw error;
  }
}

/**
 * Handle incoming messages
 */
async function handleIncomingMessage(m) {
  try {
    const message = m.messages[0];

    if (!message.message) return;

    const jid = message.key.remoteJid;
    const sender = message.key.participant || jid;
    const messageText =
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      '';

    const isOwner = jid === config.bot.owner || sender === config.bot.owner;
    const isCommand = messageText.startsWith(config.bot.prefix);

    logger.info(`Message from ${sender}: ${messageText}`);

    // Handle commands
    if (isCommand) {
      await handleCommand(jid, sender, messageText, isOwner);
    } else if (config.bot.autoReply) {
      // Auto reply to non-command messages
      await sendAutoReply(jid, sender, messageText);
    }
  } catch (error) {
    logger.error('Error handling message:', error);
  }
}

/**
 * Handle bot commands
 */
async function handleCommand(jid, sender, text, isOwner) {
  const args = text.slice(config.bot.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  try {
    switch (command) {
      case 'ping':
        await sendMessage(jid, '🏓 Pong!');
        break;

      case 'menu':
        await sendMenu(jid);
        break;

      case 'hello':
        await sendMessage(jid, `👋 Hello! I'm Wolf-bot, your automation assistant.`);
        break;

      case 'info':
        await sendMessage(
          jid,
          `ℹ️ *Wolf-bot Information*\n\nVersion: 1.0.0\nPlatform: WhatsApp\nPrefix: ${config.bot.prefix}`
        );
        break;

      case 'echo':
        const echoText = args.join(' ') || 'Nothing to echo!';
        await sendMessage(jid, `📢 ${echoText}`);
        break;

      default:
        await sendMessage(jid, `❌ Command "${command}" not recognized. Type ${config.bot.prefix}menu for help.`);
    }
  } catch (error) {
    logger.error(`Error handling command ${command}:`, error);
    await sendMessage(jid, '❌ An error occurred while processing your command.');
  }
}

/**
 * Send menu to user
 */
async function sendMenu(jid) {
  const menu = `
╔════════════════════════╗
║    🤖 WOLF-BOT MENU    ║
╚════════════════════════╝

${config.bot.prefix}ping - Check if bot is alive
${config.bot.prefix}menu - Show this menu
${config.bot.prefix}hello - Get a greeting
${config.bot.prefix}info - Bot information
${config.bot.prefix}echo [text] - Echo your message

Made with ❤️ by saastechbot
  `;

  await sendMessage(jid, menu);
}

/**
 * Send auto reply
 */
async function sendAutoReply(jid, sender, text) {
  if (config.bot.autoReply) {
    const autoReplyMessage = `
Thanks for your message! 👋

I'm Wolf-bot, an automated assistant. 

Type ${config.bot.prefix}menu to see available commands.
    `;

    // Send only once per conversation
    if (Math.random() < 0.1) {
      // 10% chance to avoid spam
      await sendMessage(jid, autoReplyMessage);
    }
  }
}

/**
 * Send message via WhatsApp
 */
async function sendMessage(jid, text) {
  if (!isConnected) {
    logger.warn('Not connected to WhatsApp');
    return;
  }

  try {
    await sock.sendMessage(jid, { text });
    logger.info(`Message sent to ${jid}`);
  } catch (error) {
    logger.error('Error sending message:', error);
  }
}

/**
 * Get connection status
 */
function isWhatsAppConnected() {
  return isConnected;
}

/**
 * Disconnect WhatsApp bot
 */
async function disconnectWhatsApp() {
  try {
    if (sock) {
      await sock.end();
      isConnected = false;
      logger.info('WhatsApp bot disconnected');
    }
  } catch (error) {
    logger.error('Error disconnecting WhatsApp:', error);
  }
}

module.exports = {
  initializeWhatsApp,
  sendMessage,
  isWhatsAppConnected,
  disconnectWhatsApp,
};
