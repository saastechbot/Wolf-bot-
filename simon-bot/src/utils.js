/**
 * Validate phone number format
 * Accepts international format without +
 * Examples: 2348012345678, 12125552368, 447911123456
 */
function validatePhoneNumber(phone) {
  if (!phone) return false;

  // Remove any whitespace or special characters
  const cleaned = phone.replace(/[^0-9]/g, '');

  // Must be 10-15 digits
  if (cleaned.length < 10 || cleaned.length > 15) {
    return false;
  }

  // Must be all digits
  if (!/^\d+$/.test(cleaned)) {
    return false;
  }

  // Cannot start with 0 or 1 alone (international format)
  if (cleaned.length === 10) {
    return false; // Too short for international
  }

  return true;
}

/**
 * Format phone number to WhatsApp format
 * Converts to international format with country code
 */
function formatPhoneNumber(phone) {
  if (!phone) throw new Error('Phone number is required');

  // Remove any whitespace or special characters
  let cleaned = phone.replace(/[^0-9]/g, '');

  // If starts with 0, assume it's a national number needing country code
  // This is a simplified version - in production, use libphonenumber-js
  if (cleaned.startsWith('0')) {
    // Cannot determine country code, ask user for full international format
    throw new Error(
      'Please use international format (e.g., 2348012345678 for Nigeria, not 08012345678)'
    );
  }

  // Add country code if missing (this is simplified)
  if (cleaned.length === 10 && !cleaned.startsWith('1')) {
    throw new Error('Phone number too short. Use international format.');
  }

  return cleaned;
}

/**
 * Validate Telegram chat ID format
 */
function validateTelegramChatId(chatId) {
  if (!chatId) return false;

  // Chat ID can be positive or negative
  if (!/^-?\d+$/.test(String(chatId))) {
    return false;
  }

  return true;
}

/**
 * Get user-friendly error message
 */
function getErrorMessage(error) {
  const message = error?.message || String(error);

  if (message.includes('pairing code')) {
    return 'Failed to generate pairing code. Please try again.';
  }

  if (message.includes('phone')) {
    return 'Invalid phone number. Please use international format.';
  }

  if (message.includes('connection')) {
    return 'Connection failed. Please check your internet and try again.';
  }

  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  return message;
}

/**
 * Format bytes to human readable size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format uptime to readable format
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(' ') || '0s';
}

module.exports = {
  validatePhoneNumber,
  formatPhoneNumber,
  validateTelegramChatId,
  getErrorMessage,
  formatBytes,
  formatUptime,
};
