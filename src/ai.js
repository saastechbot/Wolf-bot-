/**
 * AI Module - OpenAI Integration
 * Provides AI-powered intelligent responses
 */

const { Configuration, OpenAIApi } = require('openai');
const pino = require('pino');
const config = require('../config');
const { getCachedData, cacheData } = require('./redis');

const logger = pino({ level: config.logging.level });

let openai;

/**
 * Initialize OpenAI
 */
function initializeAI() {
  if (!config.features.ai || !config.ai.apiKey) {
    logger.warn('AI features disabled or API key not configured');
    return false;
  }

  try {
    const configuration = new Configuration({
      apiKey: config.ai.apiKey,
    });
    openai = new OpenAIApi(configuration);
    logger.info('✅ OpenAI initialized');
    return true;
  } catch (error) {
    logger.error('AI initialization failed:', error);
    return false;
  }
}

/**
 * Generate response using AI
 */
async function generateResponse(prompt, context = {}) {
  try {
    if (!openai) {
      throw new Error('OpenAI not initialized');
    }

    // Check cache first
    const cacheKey = `ai:${Buffer.from(prompt).toString('base64').slice(0, 32)}`;
    const cachedResponse = await getCachedData(cacheKey);
    if (cachedResponse) {
      logger.debug('Returning cached AI response');
      return cachedResponse;
    }

    // Build system message
    const systemMessage = `You are Simon Tech Bot v3.0, a helpful and intelligent WhatsApp/Telegram assistant. 
Be concise, professional, and helpful in your responses. Keep responses under 500 characters.`;

    // Call OpenAI API
    const response = await openai.createChatCompletion({
      model: config.ai.model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      temperature: config.ai.temperature,
      max_tokens: config.ai.maxTokens,
    });

    const responseText =
      response.data.choices[0]?.message?.content || 'Unable to generate response';

    // Cache the response
    await cacheData(cacheKey, responseText, 3600);

    return responseText;
  } catch (error) {
    logger.error('Error generating AI response:', error.message);
    return 'I encountered an error processing your request. Please try again.';
  }
}

/**
 * Analyze sentiment
 */
async function analyzeSentiment(text) {
  try {
    const prompt = `Analyze sentiment: POSITIVE, NEGATIVE, or NEUTRAL?\n"${text}"`;

    const response = await openai.createChatCompletion({
      model: config.ai.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 10,
    });

    const sentiment = response.data.choices[0]?.message?.content?.trim() || 'NEUTRAL';
    return sentiment;
  } catch (error) {
    logger.error('Error analyzing sentiment:', error);
    return 'NEUTRAL';
  }
}

/**
 * Check if AI is available
 */
function isAIAvailable() {
  return openai !== undefined && config.features.ai;
}

module.exports = {
  initializeAI,
  generateResponse,
  analyzeSentiment,
  isAIAvailable,
};
