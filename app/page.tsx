'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import CreatePollForm from '@/components/CreatePollForm';
import PollCard from '@/components/PollCard';

interface Poll {
  _id: string;
  question: string;
  options: { _id: string; text: string; votes: number }[];
  totalVotes: number;
  status: 'active' | 'closed';
}

export default function Home() {
  const { user, loading: authLoading, logout } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollsLoading, setPollsLoading] = useState(false);

  const fetchPolls = async () => {
    setPollsLoading(true);
    try {
      const res = await fetch('/api/polls');
      if (res.ok) {
        const data = await res.json();
        setPolls(data.polls);
      }
    } catch (error) {
      console.error('Failed to fetch polls:', error);
    } finally {
      setPollsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white px-6 py-10 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
        <section className="mx-auto max-w-md">
          <p className="text-emerald-400 font-semibold tracking-widest">POLL PULSE</p>
          <h1 className="mt-4 text-3xl font-bold">
            {isSignup ? 'Create an account' : 'Welcome back'}
          </h1>

          <div className="mt-8 rounded-xl bg-slate-900 p-6 border border-slate-800">
            {isSignup ? (
              <SignupForm onSuccess={() => setIsSignup(false)} />
            ) : (
              <LoginForm onSuccess={() => {}} />
            )}

            <div className="mt-4 text-center">
              <p className="text-slate-400 text-sm">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  {isSignup ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const activePollsCount = polls.filter((p) => p.status === 'active').length;
  const totalVotes = polls.reduce((sum, p) => sum + p.totalVotes, 0);

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-400 font-semibold tracking-widest">POLL PULSE</p>
            <h1 className="mt-2 text-3xl font-bold">Welcome, {user.name}</h1>
          </div>

          <button
            onClick={() => logout()}
            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium"
          >
            Logout
          </button>
        </div>

        <p className="mt-2 max-w-2xl text-slate-300">
          Create polls, collect votes, and see the pulse of your community.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-900 p-5 border border-slate-800">
            <p className="text-sm text-slate-400">Active Polls</p>
            <h2 className="mt-2 text-3xl font-bold">{activePollsCount}</h2>
          </div>

          <div className="rounded-xl bg-slate-900 p-5 border border-slate-800">
            <p className="text-sm text-slate-400">Total Votes</p>
            <h2 className="mt-2 text-3xl font-bold">{totalVotes}</h2>
          </div>

          <div className="rounded-xl bg-slate-900 p-5 border border-slate-800">
            <p className="text-sm text-slate-400">Total Polls</p>
            <h2 className="mt-2 text-3xl font-bold">{polls.length}</h2>
          </div>
        </div>

        {/* Create Poll Section */}
        {showCreateForm && (
          <section className="mt-10">
            <div className="rounded-xl bg-slate-900 p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Create New Poll</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-slate-400 hover:text-slate-300"
                >
                  ✕
                </button>
              </div>

              <CreatePollForm
                onSuccess={() => {
                  setShowCreateForm(false);
                  fetchPolls();
                }}
              />
            </div>
          </section>
        )}

        {/* Polls Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              {pollsLoading ? 'Loading polls...' : 'Current Polls'}
            </h2>

            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 text-sm font-medium"
              >
                + New Poll
              </button>
            )}
          </div>

          {polls.length === 0 && !pollsLoading ? (
            <div className="rounded-xl bg-slate-900 p-8 border border-slate-800 text-center text-slate-400">
              No polls yet. Create one to get started!
            </div>
          ) : (
            <div className="grid gap-4">
              {polls.map((poll) => (
                <PollCard key={poll._id} poll={poll} onVote={() => fetchPolls()} />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
