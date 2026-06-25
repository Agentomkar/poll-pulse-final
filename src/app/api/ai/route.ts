import { NextRequest, NextResponse } from 'next/server';
import { askAnthropic, getAnthropicApiKey } from '@/lib/anthropic';
import { connectDB } from '@/lib/db';
import { Poll } from '@/lib/models/Poll';

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

    // Fetch live poll data to give AI context about the platform
    let pollContext = '';
    try {
      await connectDB();
      const polls = await Poll.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select('question options totalVotes status')
        .lean();

      if (polls.length > 0) {
        const activePolls = polls.filter(p => p.status === 'active').length;
        const totalVotes = polls.reduce((sum: number, p: any) => sum + (p.totalVotes || 0), 0);

        pollContext = `\n\n[PLATFORM CONTEXT - Current Poll Pulse Data]\n` +
          `Total polls on platform: ${polls.length}\n` +
          `Active polls: ${activePolls}\n` +
          `Total votes across all polls: ${totalVotes}\n\n` +
          `Recent polls on the platform:\n`;

        polls.forEach((p: any, i: number) => {
          const optSummary = p.options.map((o: any) => `${o.text}: ${o.votes} votes`).join(' | ');
          pollContext += `${i + 1}. "${p.question}" (${p.status}) — ${optSummary}\n`;
        });

        pollContext += `\nUse this data to answer questions about current polls, analyze trends, or give recommendations.`;
      } else {
        pollContext = `\n\n[PLATFORM CONTEXT] The platform currently has no polls yet. Encourage the user to create one!`;
      }
    } catch (dbErr) {
      // If DB fetch fails, proceed without context — non-critical
      console.error('Failed to fetch poll context for AI:', dbErr);
    }

    // Inject context into the last user message
    const enhancedMessages = [...messages];
    const lastUserIdx = enhancedMessages.length - 1;
    if (enhancedMessages[lastUserIdx]?.role === 'user') {
      const lastMsg = enhancedMessages[lastUserIdx] as { role: string; content: string };
      lastMsg.content = lastMsg.content + pollContext;
    }

    const response = await askAnthropic(enhancedMessages);
    const reply = response.content[0]?.type === 'text' ? response.content[0].text : 'Sorry, I could not generate a response.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Anthropic API error:', error);
    const msg = error instanceof Error ? error.message : 'Internal server error';
    // If the API key is missing, tell the user clearly
    if (msg.includes('ANTHROPIC_API_KEY')) {
      return NextResponse.json(
        { error: msg },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error while calling AI. Please try again.' },
      { status: 500 }
    );
  }
}