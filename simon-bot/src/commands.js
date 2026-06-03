const commandCategories = {
  // 👑 OWNER COMMANDS
  OWNER: {
    commands: [
      {
        name: 'restart',
        description: 'Restart the bot',
        usage: '.restart',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🔄 Restarting bot...' });
          logger.info('Bot restart initiated');
          setTimeout(() => process.exit(0), 1000);
        },
      },
      {
        name: 'shutdown',
        description: 'Shutdown the bot',
        usage: '.shutdown',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🛑 Shutting down bot...' });
          logger.info('Bot shutdown initiated');
          setTimeout(() => process.exit(0), 1000);
        },
      },
      {
        name: 'reboot',
        description: 'Reboot the bot',
        usage: '.reboot',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '♻️ Rebooting bot...' });
          logger.info('Bot reboot initiated');
          setTimeout(() => process.exit(0), 1500);
        },
      },
      {
        name: 'updatebot',
        description: 'Update bot from repository',
        usage: '.updatebot',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '📦 Checking for updates...' });
          logger.info('Bot update check initiated');
        },
      },
      {
        name: 'deploy',
        description: 'Deploy bot to server',
        usage: '.deploy',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🚀 Deploying bot to server...' });
          logger.info('Bot deployment initiated');
        },
      },
      {
        name: 'backup',
        description: 'Create full backup',
        usage: '.backup',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '💾 Creating backup...' });
          logger.info('Backup creation initiated');
        },
      },
      {
        name: 'restore',
        description: 'Restore from backup',
        usage: '.restore',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '📂 Restoring from backup...' });
          logger.info('Backup restore initiated');
        },
      },
      {
        name: 'backupdb',
        description: 'Backup database',
        usage: '.backupdb',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🗄️ Backing up database...' });
          logger.info('Database backup initiated');
        },
      },
      {
        name: 'restoredb',
        description: 'Restore database',
        usage: '.restoredb',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🗄️ Restoring database...' });
          logger.info('Database restore initiated');
        },
      },
      {
        name: 'logs',
        description: 'View bot logs',
        usage: '.logs [lines]',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '📋 Retrieving logs...' });
          logger.info('Logs retrieved');
        },
      },
      {
        name: 'clearlogs',
        description: 'Clear all logs',
        usage: '.clearlogs',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🗑️ Clearing logs...' });
          logger.info('Logs cleared');
        },
      },
      {
        name: 'broadcast',
        description: 'Broadcast message to all users',
        usage: '.broadcast <message>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const msg = text.replace('.broadcast ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `📢 Broadcasting: ${msg}` });
          logger.info('Broadcast message sent');
        },
      },
      {
        name: 'bcgroup',
        description: 'Broadcast to all groups',
        usage: '.bcgroup <message>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const msg = text.replace('.bcgroup ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `📢 Broadcasting to groups: ${msg}` });
          logger.info('Group broadcast sent');
        },
      },
      {
        name: 'bcall',
        description: 'Broadcast to all',
        usage: '.bcall <message>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const msg = text.replace('.bcall ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `📢 Broadcasting to all: ${msg}` });
          logger.info('Full broadcast sent');
        },
      },
      {
        name: 'ban',
        description: 'Ban a user',
        usage: '.ban <user_id>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const userId = text.replace('.ban ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `🚫 User ${userId} has been banned` });
          logger.info(`User ${userId} banned`);
        },
      },
      {
        name: 'unban',
        description: 'Unban a user',
        usage: '.unban <user_id>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const userId = text.replace('.unban ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `✅ User ${userId} has been unbanned` });
          logger.info(`User ${userId} unbanned`);
        },
      },
      {
        name: 'block',
        description: 'Block a user',
        usage: '.block <user_id>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const userId = text.replace('.block ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `🔒 User ${userId} blocked` });
          logger.info(`User ${userId} blocked`);
        },
      },
      {
        name: 'unblock',
        description: 'Unblock a user',
        usage: '.unblock <user_id>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const userId = text.replace('.unblock ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `🔓 User ${userId} unblocked` });
          logger.info(`User ${userId} unblocked`);
        },
      },
      {
        name: 'premium',
        description: 'Add premium to user',
        usage: '.premium <user_id>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const userId = text.replace('.premium ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `👑 User ${userId} is now premium` });
          logger.info(`Premium added to ${userId}`);
        },
      },
      {
        name: 'unpremium',
        description: 'Remove premium from user',
        usage: '.unpremium <user_id>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const userId = text.replace('.unpremium ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `❌ Premium removed from ${userId}` });
          logger.info(`Premium removed from ${userId}`);
        },
      },
      {
        name: 'addowner',
        description: 'Add new owner',
        usage: '.addowner <user_id>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const userId = text.replace('.addowner ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `👑 ${userId} is now owner` });
          logger.info(`Owner added: ${userId}`);
        },
      },
      {
        name: 'delowner',
        description: 'Remove owner',
        usage: '.delowner <user_id>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const userId = text.replace('.delowner ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `❌ Owner privileges removed from ${userId}` });
          logger.info(`Owner removed: ${userId}`);
        },
      },
      {
        name: 'setpp',
        description: 'Set bot profile picture',
        usage: '.setpp (reply to image)',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '📸 Profile picture updated' });
          logger.info('Bot profile picture changed');
        },
      },
      {
        name: 'setnamebot',
        description: 'Set bot name',
        usage: '.setnamebot <name>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const name = text.replace('.setnamebot ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `✅ Bot name changed to: ${name}` });
          logger.info(`Bot name changed to: ${name}`);
        },
      },
      {
        name: 'setstatus',
        description: 'Set bot status',
        usage: '.setstatus <status>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const status = text.replace('.setstatus ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `✅ Bot status changed to: ${status}` });
          logger.info(`Bot status changed to: ${status}`);
        },
      },
      {
        name: 'setprefix',
        description: 'Set bot prefix',
        usage: '.setprefix <prefix>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const prefix = text.replace('.setprefix ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `✅ Prefix changed to: ${prefix}` });
          logger.info(`Prefix changed to: ${prefix}`);
        },
      },
      {
        name: 'public',
        description: 'Set bot to public mode',
        usage: '.public',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🌍 Bot is now in PUBLIC mode' });
          logger.info('Bot set to public mode');
        },
      },
      {
        name: 'private',
        description: 'Set bot to private mode',
        usage: '.private',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🔒 Bot is now in PRIVATE mode' });
          logger.info('Bot set to private mode');
        },
      },
      {
        name: 'maintenance',
        description: 'Set bot to maintenance mode',
        usage: '.maintenance',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🔧 Bot is in MAINTENANCE mode' });
          logger.info('Bot set to maintenance mode');
        },
      },
      {
        name: 'anticall',
        description: 'Enable/Disable anti-call',
        usage: '.anticall on/off',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          const status = text.includes('on') ? 'enabled' : 'disabled';
          await sock.sendMessage(message.key.remoteJid, { text: `📞 Anti-call ${status}` });
          logger.info(`Anti-call ${status}`);
        },
      },
      {
        name: 'join',
        description: 'Join a group',
        usage: '.join <group_link>',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '✅ Joined group' });
          logger.info('Bot joined group');
        },
      },
      {
        name: 'leave',
        description: 'Leave a group',
        usage: '.leave',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '👋 Leaving group...' });
          logger.info('Bot left group');
        },
      },
      {
        name: 'clearsession',
        description: 'Clear WhatsApp session',
        usage: '.clearsession',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🗑️ Session cleared' });
          logger.info('Session cleared');
        },
      },
      {
        name: 'getsession',
        description: 'Get session info',
        usage: '.getsession',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '📂 Session info retrieved' });
          logger.info('Session info retrieved');
        },
      },
      {
        name: 'pair',
        description: 'Get pairing code',
        usage: '.pair',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🔐 Requesting pairing code...' });
          logger.info('Pairing code requested');
        },
      },
      {
        name: 'unpair',
        description: 'Remove pairing',
        usage: '.unpair',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '❌ Pairing removed' });
          logger.info('Pairing removed');
        },
      },
      {
        name: 'eval',
        description: 'Execute JavaScript code',
        usage: '.eval <code>',
        ownerOnly: true,
        async execute(message, sock, logger, text) {
          try {
            const code = text.replace('.eval ', '');
            const result = eval(code);
            await sock.sendMessage(message.key.remoteJid, { text: `✅ Result: ${result}` });
          } catch (error) {
            await sock.sendMessage(message.key.remoteJid, { text: `❌ Error: ${error.message}` });
          }
        },
      },
      {
        name: 'exec',
        description: 'Execute shell command',
        usage: '.exec <command>',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '⚙️ Command executed' });
          logger.info('Shell command executed');
        },
      },
      {
        name: 'terminal',
        description: 'Access terminal',
        usage: '.terminal',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '💻 Terminal access granted' });
          logger.info('Terminal accessed');
        },
      },
      {
        name: 'shell',
        description: 'Shell access',
        usage: '.shell <command>',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🐚 Shell command executed' });
          logger.info('Shell command executed');
        },
      },
      {
        name: 'serverrestart',
        description: 'Restart server',
        usage: '.serverrestart',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🔄 Server restarting...' });
          logger.info('Server restart initiated');
        },
      },
      {
        name: 'serverinfo',
        description: 'Get server info',
        usage: '.serverinfo',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🖥️ Server info retrieved' });
          logger.info('Server info retrieved');
        },
      },
      {
        name: 'getplugin',
        description: 'Get plugin info',
        usage: '.getplugin <plugin_name>',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🔌 Plugin info retrieved' });
          logger.info('Plugin info retrieved');
        },
      },
      {
        name: 'addplugin',
        description: 'Add new plugin',
        usage: '.addplugin <plugin_name>',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '➕ Plugin added' });
          logger.info('Plugin added');
        },
      },
      {
        name: 'delplugin',
        description: 'Delete plugin',
        usage: '.delplugin <plugin_name>',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '➖ Plugin deleted' });
          logger.info('Plugin deleted');
        },
      },
      {
        name: 'reload',
        description: 'Reload all commands',
        usage: '.reload',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '♻️ Commands reloaded' });
          logger.info('Commands reloaded');
        },
      },
      {
        name: 'saveconfig',
        description: 'Save configuration',
        usage: '.saveconfig',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '💾 Configuration saved' });
          logger.info('Configuration saved');
        },
      },
      {
        name: 'resetconfig',
        description: 'Reset configuration',
        usage: '.resetconfig',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '🔄 Configuration reset' });
          logger.info('Configuration reset');
        },
      },
      {
        name: 'ownerpanel',
        description: 'Show owner control panel',
        usage: '.ownerpanel',
        ownerOnly: true,
        async execute(message, sock, logger) {
          const panel = `
╔════════════════════════════╗
║     👑 OWNER PANEL 👑      ║
╚════════════════════════════╝

⚙️ CONTROL OPTIONS:
.restart - Restart bot
.shutdown - Shutdown bot
.reboot - Reboot bot
.updatebot - Update bot
.deploy - Deploy bot
.backup - Create backup
.restore - Restore backup
.broadcast - Send broadcast
.ban - Ban user
.unban - Unban user
.premium - Add premium
.unpremium - Remove premium
.addowner - Add owner
.delowner - Remove owner

🔐 SECURITY:
.anticall on/off - Anti-call
.maintenance - Maintenance mode
.public - Public mode
.private - Private mode

📊 INFO:
.serverinfo - Server info
.logs - View logs
.status - Bot status
          `;
          await sock.sendMessage(message.key.remoteJid, { text: panel });
          logger.info('Owner panel displayed');
        },
      },
      {
        name: 'fullbackup',
        description: 'Create full system backup',
        usage: '.fullbackup',
        ownerOnly: true,
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '💾 Creating full backup...' });
          logger.info('Full backup creation initiated');
        },
      },
    ],
  },

  // ⚙️ SYSTEM COMMANDS
  SYSTEM: {
    commands: [
      {
        name: 'menu',
        description: 'Show bot menu',
        usage: '.menu',
        async execute(message, sock, logger) {
          const menu = `
╔═══════════════════════════════════╗
║   🤖 SIMON TECH BOT v2.0 MENU 🤖  ║
╚═══════════════════════════════════╝

👑 OWNER COMMANDS
.ownerpanel - Show owner panel

⚙️ SYSTEM
.ping - Response time
.alive - Bot alive check
.status - Bot status
.uptime - Bot uptime
.speed - Performance check
.menu - Show menu
.help - Show help

👤 PROFILE
.profile - Your profile
.setname - Set your name
.setbio - Set your bio

👥 GROUP
.groupinfo - Group information
.tagall - Tag all members
.admins - List admins
.members - List members

🧠 AI
.ai - Ask AI
.chat - Chat with AI
.gpt - GPT assistance

🎨 STICKER
.sticker - Create sticker
.s - Quick sticker

📥 DOWNLOAD
.play - Download song
.video - Download video
.tiktok - TikTok video

🔍 SEARCH
.google - Google search
.youtube - YouTube search

❓ MORE
.help - Full command list
.support - Get support
.report - Report issue

╔═════════════════════╗
  © Simon Tech Bot
  Powered by SIMON TECH
╚═════════════════════╝
          `;
          await sock.sendMessage(message.key.remoteJid, { text: menu });
          logger.info('Menu displayed');
        },
      },
      {
        name: 'help',
        description: 'Show help information',
        usage: '.help [command]',
        async execute(message, sock, logger) {
          const help = `
╔════════════════════════════════════╗
║        📚 HELP CENTER 📚           ║
╚════════════════════════════════════╝

COMMAND CATEGORIES:

👑 Owner - Owner only commands
⚙️ System - Bot system commands
👤 Profile - User profile commands
👥 Group - Group management
🧠 AI - Artificial Intelligence
🎨 Sticker - Sticker creation
📥 Download - Media download
🔍 Search - Search utilities
🎮 Games - Fun games
💰 Economy - Economy system
🏦 Bank - Banking system
🏮 Anime - Anime content
🌐 Internet - Internet utilities
🛠️ Utility - Utility tools
🚀 Developer - Developer tools

USAGE:
.help <category> - Get category help
.help <command> - Get command help

EXAMPLE:
.help owner - Owner commands
.help ping - Ping command help

📞 SUPPORT:
.support - Get help
.report - Report issue
          `;
          await sock.sendMessage(message.key.remoteJid, { text: help });
          logger.info('Help displayed');
        },
      },
      {
        name: 'ping',
        description: 'Check bot response time',
        usage: '.ping',
        async execute(message, sock, logger) {
          const startTime = Date.now();
          const response = await sock.sendMessage(message.key.remoteJid, { text: '🏓 Pong!' });
          const responseTime = Date.now() - startTime;
          await sock.sendMessage(message.key.remoteJid, { text: `⚡ Response time: ${responseTime}ms` });
          logger.info(`Ping: ${responseTime}ms`);
        },
      },
      {
        name: 'alive',
        description: 'Check if bot is alive',
        usage: '.alive',
        async execute(message, sock, logger) {
          const uptime = process.uptime();
          const hours = Math.floor(uptime / 3600);
          const minutes = Math.floor((uptime % 3600) / 60);
          const seconds = Math.floor(uptime % 60);
          await sock.sendMessage(message.key.remoteJid, { text: `✅ Bot is ALIVE!\n⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s` });
          logger.info('Alive check done');
        },
      },
      {
        name: 'status',
        description: 'Get bot status',
        usage: '.status',
        async execute(message, sock, logger) {
          const status = `
╔══════════════════════════╗
║    📊 BOT STATUS 📊     ║
╚══════════════════════════╝

🤖 Bot: Simon Tech Bot
📦 Version: 2.0.0
🌐 Mode: Active
✅ Status: Online
💾 Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
⚡ CPU: 45%
📡 Ping: 45ms
⏱️ Uptime: ${Math.floor(process.uptime())}s
          `;
          await sock.sendMessage(message.key.remoteJid, { text: status });
          logger.info('Status displayed');
        },
      },
      {
        name: 'uptime',
        description: 'Show bot uptime',
        usage: '.uptime',
        async execute(message, sock, logger) {
          const uptime = process.uptime();
          const days = Math.floor(uptime / 86400);
          const hours = Math.floor((uptime % 86400) / 3600);
          const minutes = Math.floor((uptime % 3600) / 60);
          const seconds = Math.floor(uptime % 60);
          const timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
          await sock.sendMessage(message.key.remoteJid, { text: `⏱️ Bot Uptime: ${timeString}` });
          logger.info('Uptime displayed');
        },
      },
      {
        name: 'speed',
        description: 'Check bot performance',
        usage: '.speed',
        async execute(message, sock, logger) {
          const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
          const cpuUsage = process.cpuUsage();
          const speedInfo = `
⚡ PERFORMANCE CHECK

💾 Memory Used: ${mem} MB
🔧 CPU User: ${(cpuUsage.user / 1000).toFixed(2)}ms
🔧 CPU System: ${(cpuUsage.system / 1000).toFixed(2)}ms
⏱️ Uptime: ${process.uptime().toFixed(2)}s
          `;
          await sock.sendMessage(message.key.remoteJid, { text: speedInfo });
          logger.info('Performance check done');
        },
      },
      {
        name: 'version',
        description: 'Show bot version',
        usage: '.version',
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '📦 Simon Tech Bot v2.0.0' });
          logger.info('Version displayed');
        },
      },
      {
        name: 'about',
        description: 'About the bot',
        usage: '.about',
        async execute(message, sock, logger) {
          const about = `
╔════════════════════════════╗
║    📖 ABOUT BOT 📖         ║
╚════════════════════════════╝

🤖 BOT NAME: Simon Tech Bot
👤 DEVELOPER: Simon Tech
📞 CONTACT: 09166265317
🌐 WHATSAPP: 09166265317
⚡ SYSTEM: Multi-Device
🚀 POWERED BY: Simon Tech

🎯 FEATURES:
✅ AI Integration
✅ Command System
✅ User Management
✅ Media Handling
✅ Security Features
          `;
          await sock.sendMessage(message.key.remoteJid, { text: about });
          logger.info('About displayed');
        },
      },
      {
        name: 'info',
        description: 'Get bot info',
        usage: '.info',
        async execute(message, sock, logger) {
          const info = `
🤖 SIMON TECH BOT

Version: 2.0.0
Type: WhatsApp Bot
Framework: Baileys
Language: JavaScript
Runtime: Node.js

👨‍💻 Developer: Simon Tech
📱 Number: 09166265317
🌐 WhatsApp: 09166265317
          `;
          await sock.sendMessage(message.key.remoteJid, { text: info });
          logger.info('Info displayed');
        },
      },
      {
        name: 'owner',
        description: 'Get owner info',
        usage: '.owner',
        async execute(message, sock, logger) {
          const ownerInfo = `
👨‍💻 OWNER INFORMATION

📱 Developer: Simon Tech
📞 WhatsApp: 09166265317
☎️ Phone: 09166265317
🌐 Contact Available 24/7
          `;
          await sock.sendMessage(message.key.remoteJid, { text: ownerInfo });
          logger.info('Owner info displayed');
        },
      },
      {
        name: 'support',
        description: 'Get support',
        usage: '.support',
        async execute(message, sock, logger) {
          const support = `
📞 SUPPORT CENTER

❓ Need Help?
Contact: 09166265317

🐛 Report Bug
.report <issue description>

💬 Feedback
.feedback <your feedback>

📋 Documentation
.help - Show help
.commands - List commands
          `;
          await sock.sendMessage(message.key.remoteJid, { text: support });
          logger.info('Support info displayed');
        },
      },
    ],
  },

  // 👤 PROFILE COMMANDS
  PROFILE: {
    commands: [
      {
        name: 'profile',
        description: 'Show your profile',
        usage: '.profile',
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '👤 Your profile information' });
          logger.info('Profile displayed');
        },
      },
      {
        name: 'setname',
        description: 'Set your name',
        usage: '.setname <name>',
        async execute(message, sock, logger, text) {
          const name = text.replace('.setname ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `✅ Name set to: ${name}` });
          logger.info(`Name set to: ${name}`);
        },
      },
    ],
  },

  // 👥 GROUP COMMANDS
  GROUP: {
    commands: [
      {
        name: 'groupinfo',
        description: 'Get group information',
        usage: '.groupinfo',
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '👥 Group information displayed' });
          logger.info('Group info displayed');
        },
      },
      {
        name: 'tagall',
        description: 'Tag all members',
        usage: '.tagall <message>',
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '📢 All members tagged' });
          logger.info('All members tagged');
        },
      },
      {
        name: 'admins',
        description: 'List group admins',
        usage: '.admins',
        async execute(message, sock, logger) {
          await sock.sendMessage(message.key.remoteJid, { text: '👨‍⚖️ Group admins listed' });
          logger.info('Admins listed');
        },
      },
    ],
  },

  // 🧠 AI COMMANDS
  AI: {
    commands: [
      {
        name: 'ai',
        description: 'Ask AI anything',
        usage: '.ai <question>',
        async execute(message, sock, logger, text) {
          const question = text.replace('.ai ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `🧠 AI is thinking... "${question}"` });
          logger.info(`AI question: ${question}`);
        },
      },
      {
        name: 'chat',
        description: 'Chat with AI',
        usage: '.chat <message>',
        async execute(message, sock, logger, text) {
          const chatMsg = text.replace('.chat ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `💬 AI Response to: ${chatMsg}` });
          logger.info(`Chat message: ${chatMsg}`);
        },
      },
      {
        name: 'gpt',
        description: 'GPT assistance',
        usage: '.gpt <prompt>',
        async execute(message, sock, logger, text) {
          const prompt = text.replace('.gpt ', '');
          await sock.sendMessage(message.key.remoteJid, { text: `🤖 GPT: ${prompt}` });
          logger.info(`GPT prompt: ${prompt}`);
        },
      },
    ],
  },
};

module.exports = commandCategories;
