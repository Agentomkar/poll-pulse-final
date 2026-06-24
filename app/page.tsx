'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import CreatePollForm from '@/components/CreatePollForm';
import PollCard from '@/components/PollCard';
import AmbientBackground from '@/components/AmbientBackground';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Activity, LogOut, Plus, ListFilter, TrendingUp, BarChart3, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Poll {
  _id: string;
  question: string;
  options: { _id: string; text: string; votes: number }[];
  totalVotes: number;
  status: 'active' | 'closed';
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  const { user, loading: authLoading, logout } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollsLoading, setPollsLoading] = useState(true);

  const fetchPolls = async () => {
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

  const activePollsCount = polls.filter((p) => p.status === 'active').length;
  const totalVotes = polls.reduce((sum, p) => sum + p.totalVotes, 0);

  return (
    <>
      <AmbientBackground />
      
      {authLoading ? (
        <main className="min-h-screen relative flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <Activity className="w-12 h-12 text-cyan-400 animate-pulse" />
            <p className="text-cyan-400/80 font-medium tracking-wider">INITIALIZING</p>
          </motion.div>
        </main>
      ) : !user ? (
        <main className="min-h-screen relative flex items-center justify-center p-6">
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md relative z-10"
          >
            <div className="flex items-center gap-3 justify-center mb-8">
              <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30 backdrop-blur-md">
                <Activity className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Poll <span className="text-gradient">Pulse</span>
              </h1>
            </div>

            <div className="glass-panel rounded-3xl p-8 backdrop-blur-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {isSignup ? 'Create an account' : 'Welcome back'}
              </h2>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignup ? 'signup' : 'login'}
                  initial={{ opacity: 0, x: isSignup ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isSignup ? -20 : 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {isSignup ? (
                    <SignupForm onSuccess={() => window.location.reload()} />
                  ) : (
                    <LoginForm onSuccess={() => window.location.reload()} />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-slate-400 text-sm">
                  {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => setIsSignup(!isSignup)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  >
                    {isSignup ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>
            </div>
          </motion.section>
        </main>
      ) : (
        <main className="min-h-screen relative overflow-hidden text-white selection:bg-cyan-500/30">
          {/* Header */}
          <header className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 border-b-white/10 rounded-none bg-[#05050A]/60">
            <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-xl font-bold tracking-tight">Poll Pulse</span>
                <span className="ml-2 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold uppercase tracking-wider hidden sm:inline-block">
                  Live
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-slate-200">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                <button
                  onClick={() => logout()}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-6 py-10 relative z-10">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-10"
            >
              {/* Hero Section */}
              <motion.section variants={itemVariants} className="text-center sm:text-left pt-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                  Gather Insights <br className="hidden sm:block" />
                  <span className="text-gradient">At The Speed Of Thought.</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto sm:mx-0">
                  Create interactive polls, engage your audience in real-time, and make data-driven decisions with our cinematic polling dashboard.
                </p>
              </motion.section>

              {/* Stats Grid */}
              <motion.section variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ListFilter className="w-16 h-16 text-cyan-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Total Polls</p>
                  <h2 className="text-4xl font-bold text-white">{polls.length}</h2>
                </div>
                
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="w-16 h-16 text-rose-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Active Now</p>
                  <h2 className="text-4xl font-bold text-white">{activePollsCount}</h2>
                </div>

                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp className="w-16 h-16 text-violet-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-400 mb-2">Total Votes</p>
                  <h2 className="text-4xl font-bold text-white">{totalVotes}</h2>
                </div>
                
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group flex items-center justify-center">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-colors"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="font-semibold">New Poll</span>
                  </button>
                </div>
              </motion.section>

              {/* Create Poll Area */}
              <AnimatePresence>
                {showCreateForm && (
                  <motion.section 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
                      
                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                          <BarChart3 className="w-6 h-6 text-cyan-400" />
                          Create Experience
                        </h2>
                        <button
                          onClick={() => setShowCreateForm(false)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                      
                      <div className="relative z-10">
                        <CreatePollForm
                          onSuccess={() => {
                            setShowCreateForm(false);
                            fetchPolls();
                          }}
                        />
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Polls Feed */}
              <motion.section variants={itemVariants} className="pb-20">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Activity className="w-6 h-6 text-rose-400" />
                    Live Feed
                  </h2>
                </div>

                {pollsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Activity className="w-8 h-8 animate-pulse mb-4" />
                    <p>Loading active polls...</p>
                  </div>
                ) : polls.length === 0 ? (
                  <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center border-dashed border-white/20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                      <Inbox className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No polls found</h3>
                    <p className="text-slate-400 max-w-sm mb-8">
                      Your community is waiting. Be the first to start a conversation and gather insights.
                    </p>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="btn-gradient px-6 py-3 rounded-xl flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Create First Poll
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {polls.map((poll) => (
                      <PollCard key={poll._id} poll={poll} onVote={() => fetchPolls()} />
                    ))}
                  </div>
                )}
              </motion.section>

            </motion.div>
          </div>
        </main>
      )}
    </>
  );
}
