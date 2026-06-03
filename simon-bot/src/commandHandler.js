const fs = require('fs');
const path = require('path');
const commandCategories = require('./commands');
const pino = require('pino');

const logger = pino({ level: 'info' });

/**
 * Process and execute WhatsApp commands
 */
async function processCommand(message, sock, ownerNumbers) {
  try {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';

    if (!text.startsWith('.')) {
      return; // Not a command
    }

    const sender = message.key.participant || message.key.remoteJid;
    const isOwner = ownerNumbers.includes(sender);
    const jid = message.key.remoteJid;

    // Extract command
    const args = text.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Search for command in all categories
    let foundCommand = null;
    let category = null;

    for (const [catName, catData] of Object.entries(commandCategories)) {
      const cmd = catData.commands?.find((c) => c.name === commandName);
      if (cmd) {
        foundCommand = cmd;
        category = catName;
        break;
      }
    }

    if (!foundCommand) {
      await sock.sendMessage(jid, { text: `❌ Command "${commandName}" not found. Type .help for help.` });
      logger.warn(`Unknown command: ${commandName} from ${sender}`);
      return;
    }

    // Check owner-only commands
    if (foundCommand.ownerOnly && !isOwner) {
      await sock.sendMessage(jid, { text: '🔒 This is an owner-only command!' });
      logger.warn(`Owner-only command attempted: ${commandName} from ${sender}`);
      return;
    }

    // Execute command
    logger.info(`Executing command: ${commandName} from ${sender} (Category: ${category})`);
    await foundCommand.execute(message, sock, logger, text);
  } catch (error) {
    logger.error('Error processing command:', error);
    // Don't send error to user to prevent info leakage
  }
}

/**
 * Get all commands
 */
function getAllCommands() {
  const allCommands = [];

  for (const [category, catData] of Object.entries(commandCategories)) {
    if (catData.commands) {
      allCommands.push(...catData.commands.map((cmd) => ({ ...cmd, category })));
    }
  }

  return allCommands;
}

/**
 * Get commands by category
 */
function getCommandsByCategory(category) {
  const cat = commandCategories[category.toUpperCase()];
  if (!cat) return [];
  return cat.commands || [];
}

/**
 * Get command by name
 */
function getCommand(name) {
  const allCmds = getAllCommands();
  return allCmds.find((cmd) => cmd.name === name.toLowerCase());
}

/**
 * Get all categories
 */
function getCategories() {
  return Object.keys(commandCategories);
}

/**
 * Format command list
 */
function formatCommandList() {
  let list = '📋 COMMAND LIST\n\n';

  for (const [category, catData] of Object.entries(commandCategories)) {
    const cmds = catData.commands || [];
    list += `${category} (${cmds.length} commands)\n`;
    cmds.forEach((cmd) => {
      list += `  • .${cmd.name} - ${cmd.description}\n`;
    });
    list += '\n';
  }

  return list;
}

module.exports = {
  processCommand,
  getAllCommands,
  getCommandsByCategory,
  getCommand,
  getCategories,
  formatCommandList,
};
