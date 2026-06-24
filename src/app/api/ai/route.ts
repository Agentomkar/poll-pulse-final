import { NextRequest, NextResponse } from 'next/server';
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are Poll Pulse AI — a friendly, concise assistant for a real-time polling platform.
Your capabilities: Help create poll questions, suggest improvements, explain polling best practices.
Personality: Enthusiastic, keep responses SHORT (2-4 sentences), use emoji sparingly.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-20),
    });

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
