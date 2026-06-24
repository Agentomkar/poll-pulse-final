import mongoose, { Schema, Document } from 'mongoose';

export interface IPollOption {
  _id: string;
  text: string;
  votes: number;
}

export interface IPoll extends Document {
  question: string;
  options: IPollOption[];
  totalVotes: number;
  status: 'active' | 'closed';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PollOptionSchema = new Schema<IPollOption>({
  text: {
    type: String,
    required: [true, 'Please provide option text'],
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const PollSchema = new Schema<IPoll>(
  {
    question: {
      type: String,
      required: [true, 'Please provide a poll question'],
      maxlength: 500,
    },
    options: [PollOptionSchema],
    totalVotes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Poll = mongoose.models.Poll || mongoose.model<IPoll>('Poll', PollSchema);
