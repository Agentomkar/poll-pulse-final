import { NextRequest, NextResponse } from 'next/server';
import { askAnthropic, getAnthropicApiKey } from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  try {
    getAnthropicApiKey();

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const response = await askAnthropic(messages);
    const reply = response.content[0]?.type === 'text' ? response.content[0].text : 'Sorry, I could not generate a response.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Anthropic API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while calling Anthropic API' },
      { status: 500 }
    );
  }
}
