'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      setEmail('');
      setPassword('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl glass-input px-4 py-3 text-white placeholder-slate-500/50"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl glass-input px-4 py-3 text-white placeholder-slate-500/50"
          placeholder="••••••••"
          required
        />
      </div>

      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl btn-gradient px-4 py-3.5 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Sign In
          </>
        )}
      </button>
    </form>
  );
}
