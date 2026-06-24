import { connectDB } from '@/lib/db';
import { Poll } from '@/lib/models/Poll';
import { getAuthToken, verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get all polls, optionally filter by user
    const polls = await Poll.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, polls }, { status: 200 });
  } catch (error) {
    console.error('Get polls error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - please login' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { question, options } = await req.json();

    // Validation
    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'Poll must have a question and at least 2 options' },
        { status: 400 }
      );
    }

    // Create poll
    const poll = await Poll.create({
      question,
      options: options.map((text: string) => ({
        text,
        votes: 0,
      })),
      createdBy: decoded.userId,
    });

    return NextResponse.json(
      { success: true, poll },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create poll error:', error);
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    );
  }
}
