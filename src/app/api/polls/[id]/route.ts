import { connectDB } from '@/lib/db';
import { Poll } from '@/lib/models/Poll';
import { getAuthToken, verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

type Params = Promise<{ id: string }>;

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid poll ID' },
        { status: 400 }
      );
    }

    const poll = await Poll.findById(id).lean();
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, poll }, { status: 200 });
  } catch (error) {
    console.error('Get poll error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poll' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    // Verify authentication
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid poll ID' },
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

    // Check ownership
    if (poll.createdBy.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Not authorized to update this poll' },
        { status: 403 }
      );
    }

    const { question, status } = await req.json();

    if (question) poll.question = question;
    if (status) poll.status = status;

    await poll.save();

    return NextResponse.json({ success: true, poll }, { status: 200 });
  } catch (error) {
    console.error('Update poll error:', error);
    return NextResponse.json(
      { error: 'Failed to update poll' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    // Verify authentication
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid poll ID' },
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

    // Check ownership
    if (poll.createdBy.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this poll' },
        { status: 403 }
      );
    }

    await Poll.deleteOne({ _id: id });

    return NextResponse.json(
      { success: true, message: 'Poll deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete poll error:', error);
    return NextResponse.json(
      { error: 'Failed to delete poll' },
      { status: 500 }
    );
  }
}
