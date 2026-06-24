import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are Poll Pulse AI — a friendly, concise assistant for a real-time polling platform.
Your capabilities: Help create poll questions, suggest improvements, explain polling best practices.
Personality: Enthusiastic, keep responses SHORT (2-4 sentences), use emoji sparingly.`;

export function getAnthropicApiKey() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable');
  }
  return apiKey;
}

export function createAnthropicClient() {
  return new Anthropic({ apiKey: getAnthropicApiKey() });
}

export async function askAnthropic(messages: unknown[]) {
  const client = createAnthropicClient();
  return client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: messages.slice(-20) as any[],
  });
}
