'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleVote = async (optionIndex: number) => {
    setSelectedOption(optionIndex);
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
        setSelectedOption(null);
        return;
      }

      onVote?.();
    } catch {
      alert('Failed to vote');
      setSelectedOption(null);
    } finally {
      setVoting(false);
    }
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="glass-panel glass-panel-hover rounded-2xl p-6 group relative overflow-hidden"
    >
      {/* Glow effect behind the card */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-semibold text-white group-hover:text-cyan-50 transition-colors">
            {poll.question}
          </h3>
          <div className="mt-2 flex items-center gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur-md border",
            poll.status === 'active'
              ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              : "bg-rose-500/10 text-rose-300 border-rose-500/20"
          )}
        >
          {poll.status === 'active' && <Activity className="w-3 h-3 animate-pulse" />}
          {poll.status}
        </span>
      </div>

      <div className="space-y-3 relative z-10">
        {poll.options.map((option, index) => {
          const percentage = poll.totalVotes > 0 ? ((option.votes / poll.totalVotes) * 100).toFixed(1) : 0;
          const isSelected = selectedOption === index;
          const isWinner = poll.totalVotes > 0 && option.votes === Math.max(...poll.options.map(o => o.votes));

          return (
            <button
              key={option._id}
              onClick={() => handleVote(index)}
              disabled={voting || poll.status === 'closed'}
              className="w-full text-left disabled:cursor-not-allowed group/btn relative"
            >
              <div className={cn(
                "relative overflow-hidden rounded-xl border transition-all duration-300",
                isSelected 
                  ? "border-cyan-500/50 bg-cyan-500/10" 
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10",
                (voting || poll.status === 'closed') && !isSelected && "opacity-70"
              )}>
                
                {/* Progress Bar Background */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "absolute inset-y-0 left-0",
                    isWinner ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20" : "bg-white/5"
                  )}
                />
                
                <div className="relative px-4 py-3 flex justify-between items-center">
                  <span className={cn(
                    "font-medium flex items-center gap-2",
                    isSelected ? "text-cyan-300" : "text-slate-200"
                  )}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    {option.text}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{option.votes} votes</span>
                    <span className={cn(
                      "text-sm font-semibold w-12 text-right",
                      isWinner ? "text-cyan-400" : "text-slate-300"
                    )}>
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.article>
  );
}
