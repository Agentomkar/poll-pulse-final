'use client';

import { useState } from 'react';

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
      // Validate
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

      // Reset form
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300">Poll Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mt-1 w-full rounded-lg bg-slate-800 px-4 py-2 text-white placeholder-slate-500 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          placeholder="What would you like to ask?"
          maxLength={500}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Options</label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 rounded-lg bg-slate-800 px-4 py-2 text-white placeholder-slate-500 border border-slate-700 focus:border-emerald-500 focus:outline-none"
                placeholder={`Option ${index + 1}`}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addOption}
          className="mt-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm"
        >
          + Add Option
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Poll'}
      </button>
    </form>
  );
}
