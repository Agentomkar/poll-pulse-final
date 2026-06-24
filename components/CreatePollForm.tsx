'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatePollFormProps {
  onSuccess?: () => void;
}

export default function CreatePollForm({ onSuccess }: CreatePollFormProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!question.trim()) {
        throw new Error('Please enter a poll question');
      }

      const validOptions = options.filter((opt) => opt.trim());
      if (validOptions.length < 2) {
        throw new Error('Please provide at least 2 options');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login first');
      }

      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: question.trim(),
          options: validOptions,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create poll');
      }

      setQuestion('');
      setOptions(['', '']);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit} 
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Poll Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full rounded-xl glass-input px-4 py-3 text-white placeholder-slate-500/50"
          placeholder="What would you like to ask your audience?"
          maxLength={500}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Options</label>
        <div className="space-y-3">
          <AnimatePresence>
            {options.map((option, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 rounded-xl glass-input px-4 py-3 text-white placeholder-slate-500/50"
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors border border-rose-500/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={addOption}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors border border-white/10 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Option
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl btn-gradient px-4 py-3.5 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : (
          <>
            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Launch Poll
          </>
        )}
      </button>
    </motion.form>
  );
}
