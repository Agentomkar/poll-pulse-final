'use client';

import { useState } from 'react';

interface PollOption {
  _id: string;
  text: string;
  votes: number;
}

interface Poll {
  _id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  status: 'active' | 'closed';
}

interface PollCardProps {
  poll: Poll;
  onVote?: () => void;
}

export default function PollCard({ poll, onVote }: PollCardProps) {
  const [voting, setVoting] = useState(false);

  const handleVote = async (optionIndex: number) => {
    setVoting(true);
    try {
      const res = await fetch(`/api/polls/${poll._id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIndex }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to vote');
        return;
      }

      onVote?.();
    } catch {
      alert('Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  return (
    <article className="rounded-xl bg-slate-900 p-5 border border-slate-800">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold">{poll.question}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            poll.status === 'active'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {poll.status}
        </span>
      </div>

      <div className="space-y-3">
        {poll.options.map((option, index) => {
          const percentage =
            poll.totalVotes > 0 ? ((option.votes / poll.totalVotes) * 100).toFixed(1) : 0;

          return (
            <button
              key={option._id}
              onClick={() => handleVote(index)}
              disabled={voting || poll.status === 'closed'}
              className="w-full text-left disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition"
            >
              <div className="relative">
                <div className="absolute inset-0 h-8 rounded-lg bg-emerald-500/20"></div>
                <div
                  className="absolute inset-0 h-8 rounded-lg bg-emerald-500/50 transition-all"
                  style={{ width: `${percentage}%` }}
                ></div>
                <div className="relative px-3 py-2 flex justify-between items-center">
                  <span className="font-medium text-sm">{option.text}</span>
                  <span className="text-xs text-slate-300">{percentage}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </article>
  );
}
