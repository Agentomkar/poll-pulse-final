import { connectDB } from '@/lib/db';
import { Poll } from '@/lib/models/Poll';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

type Params = Promise<{ id: string }>;

export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { optionIndex } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid poll ID' },
        { status: 400 }
      );
    }

    if (optionIndex === undefined || optionIndex === null) {
      return NextResponse.json(
        { error: 'Please provide an option index' },
        { status: 400 }
      );
    }

    const poll = await Poll.findById(id);
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    if (poll.status === 'closed') {
      return NextResponse.json(
        { error: 'This poll is closed' },
        { status: 400 }
      );
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return NextResponse.json(
        { error: 'Invalid option index' },
        { status: 400 }
      );
    }

    // Increment vote count
    poll.options[optionIndex].votes += 1;
    poll.totalVotes += 1;

    await poll.save();

    return NextResponse.json(
      { success: true, poll, message: 'Vote recorded' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}
