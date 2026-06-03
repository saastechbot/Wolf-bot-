# 🎮 Wolf-bot Commands Guide

Complete command reference for both WhatsApp and Telegram.

## WhatsApp Commands

Send commands to your WhatsApp by messaging the bot with the prefix (default: `!`)

### Core Commands

| Command | Usage | Description | Example |
|---------|-------|-------------|----------|
| `ping` | `!ping` | Check if bot is online | `!ping` |
| `menu` | `!menu` | Display command menu | `!menu` |
| `hello` | `!hello` | Get a greeting | `!hello` |
| `info` | `!info` | Show bot information | `!info` |
| `echo` | `!echo [text]` | Echo your message | `!echo Hello World` |

### Command Examples

**Ping Example:**
```
You: !ping
Bot: 🏓 Pong!
```

**Echo Example:**
```
You: !echo This is a test
Bot: 📢 This is a test
```

**Info Example:**
```
You: !info
Bot: ℹ️ *Wolf-bot Information*
     Version: 1.0.0
     Platform: WhatsApp
     Prefix: !
```

---

## Telegram Commands

Send commands to Telegram bot with `/` prefix

### Core Commands

| Command | Usage | Description | Example |
|---------|-------|-------------|----------|
| `start` | `/start` | Welcome message | `/start` |
| `ping` | `/ping` | Check if bot is online | `/ping` |
| `menu` | `/menu` | Display command menu | `/menu` |
| `help` | `/help` | Get help information | `/help` |
| `info` | `/info` | Show bot information | `/info` |
| `echo` | `/echo [text]` | Echo your message | `/echo Hello World` |

### Command Examples

**Start Example:**
```
You: /start
Bot: 🤖 Welcome to Wolf-bot!
     I'm a powerful automation bot...
     Available commands:
     /menu - Show available commands
     /help - Get help
     ...
```

**Help Example:**
```
You: /help
Bot: 📚 *Help Guide*
     *Available Commands:*
     /start - Welcome message
     /menu - Show menu
     ...
```

---

## Auto-Reply Feature

Both platforms support auto-reply when configured:

### WhatsApp Auto-Reply
- Responds to non-command messages
- Random 10% chance to avoid spam
- Customizable message in `.env` or `config.js`

### Telegram Auto-Reply
- Responds to non-command text messages
- Customizable response
- Helps guide users to available commands

---

## Adding Custom Commands

### WhatsApp Custom Command

Edit `whatsapp.js` in the `handleCommand()` function:

```javascript
case 'yourcommand':
  const response = 'Your custom response';
  await sendMessage(jid, response);
  break;
```

**Example: Weather command**
```javascript
case 'weather':
  const weatherInfo = '🌤️ Current weather: Sunny, 72°F';
  await sendMessage(jid, weatherInfo);
  break;
```

### Telegram Custom Command

Edit `telegram.js` and add:

```javascript
bot.onText(/\/yourcommand(.+)?/, (msg, match) => {
  const chatId = msg.chat.id;
  const response = 'Your custom response';
  bot.sendMessage(chatId, response);
});
```

**Example: Weather command**
```javascript
bot.onText(/\/weather/, (msg) => {
  const chatId = msg.chat.id;
  const weatherInfo = '🌤️ Current weather: Sunny, 72°F';
  bot.sendMessage(chatId, weatherInfo);
});
```

---

## Command Variations

### WhatsApp Variations

Commands are case-insensitive:

```
!ping  → Works
!PING  → Works
!Ping  → Works
!PiNg  → Works
```

With arguments:

```
!echo hello world  → Echos "hello world"
!echo "hello world"  → Echos "hello world"
```

### Telegram Variations

Commands work with mentions (for group chats):

```
/start              → Works
/start@wolf_bot     → Works (in groups)
/echo@wolf_bot text → Works (in groups)
```

---

## Admin/Owner Only Commands

### WhatsApp Owner Commands

Add owner-only commands:

```javascript
if (isOwner) {
  switch (command) {
    case 'broadcast':
      // Broadcast to all users
      break;
    case 'restart':
      // Restart bot
      break;
  }
}
```

### Telegram Owner Commands

```javascript
const ownerOnly = (msg, callback) => {
  if (msg.chat.id.toString() === config.bot.ownerTelegram) {
    callback();
  } else {
    bot.sendMessage(msg.chat.id, '❌ This command is owner-only');
  }
};
```

---

## Command Syntax Rules

### Prefix Usage

- **Default prefix:** `!` (configurable in `.env`)
- **Must start message** with the prefix
- **No space between prefix and command**

```
Correct:   !ping
Incorrect: ! ping
```

### Arguments

- **Space-separated:**
```
!echo hello world  → Args: ["hello", "world"]
```

- **With special characters:**
```
!echo "hello world"  → Args: ["hello world"]
```

---

## Error Handling

### WhatsApp Errors

Command not recognized:
```
You: !xyz
Bot: ❌ Command "xyz" not recognized. Type !menu for help.
```

Processing error:
```
You: !command
Bot: ❌ An error occurred while processing your command.
```

### Telegram Errors

```
/unknown
Bot: No response (command doesn't exist)
```

---

## Tips & Tricks

### Efficiency Tips

1. **Use !menu** frequently to see all available commands
2. **Combine commands** - Chain multiple commands together
3. **Use echo** for testing bot connectivity

### Best Practices

1. **One command at a time** - Send one command per message
2. **Wait for response** - Allow bot time to process
3. **Avoid spam** - Don't spam commands rapidly
4. **Report issues** - Let admin know about broken commands

### Debugging

Check bot is online:
```
WhatsApp: !ping
Telegram: /ping
```

Get bot info:
```
WhatsApp: !info
Telegram: /info
```

View logs:
```bash
npm run dev  # Verbose logging
tail -f logs/*.log  # Check log files
```

---

## FAQ

**Q: How do I change the prefix?**
A: Edit `.env` file:
```env
PREFIX=?
```

**Q: Can I use multiple prefixes?**
A: Not by default. Edit `config.js` to support multiple prefixes.

**Q: Will the bot respond to my own messages?**
A: WhatsApp: No (filters own messages)
   Telegram: No (filters own messages)

**Q: How do I add the bot to a group?**
A: **WhatsApp:** Add bot number to group contact
   **Telegram:** Add bot to group via bot settings

**Q: Commands not working?**
A: 1. Check bot is connected: `/ping` or `!ping`
   2. Verify prefix is correct
   3. Check command exists: `!menu` or `/menu`
   4. Restart bot if needed

---

## Performance Tips

- Use short, memorable command names
- Avoid running heavy operations in commands
- Cache frequently accessed data
- Log important actions for debugging

---

## Security Notes

- **Never share bot session** (WhatsApp auth/)
- **Keep tokens secret** (.env file)
- **Validate user inputs** before processing
- **Rate limit commands** to prevent abuse
- **Log suspicious activity** for monitoring

---

**Need help?** Check the [README.md](./README.md) or open an issue on GitHub.
