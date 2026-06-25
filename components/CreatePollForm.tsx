'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Send, Sparkles, Loader2, Lightbulb } from 'lucide-react';

interface CreatePollFormProps {
  onSuccess?: () => void;
}

export default function CreatePollForm({ onSuccess }: CreatePollFormProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ question: string; options: string[] }[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

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

  const handleGetAiSuggestions = async () => {
    const topic = question.trim() || 'general audience engagement';
    setAiLoading(true);
    setError('');
    setAiSuggestions([]);
    setShowAiSuggestions(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Suggest 3 poll questions about "${topic}". For each, provide 4-6 answer options. Format your response EXACTLY like this (use **Question**: and **Options**: markers):

**Question 1**: [question text]
**Options**: [option1], [option2], [option3], [option4]

**Question 2**: [question text]
**Options**: [option1], [option2], [option3], [option4]

**Question 3**: [question text]
**Options**: [option1], [option2], [option3], [option4]`
            }
          ]
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to get suggestions');
      }

      const data = await res.json();
      const parsedSuggestions = parseAiSuggestions(data.reply);
      
      if (parsedSuggestions.length === 0) {
        throw new Error('Could not parse AI suggestions. Please try again.');
      }

      setAiSuggestions(parsedSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI suggestions');
      setShowAiSuggestions(false);
    } finally {
      setAiLoading(false);
    }
  };

  const parseAiSuggestions = (text: string): { question: string; options: string[] }[] => {
    const results: { question: string; options: string[] }[] = [];
    const blocks = text.split(/\*\*Question \d+\*\*/i).filter(b => b.trim());
    
    for (const block of blocks) {
      const lines = block.trim().split('\n').filter(l => l.trim());
      // First line is the question text (after the "Question X:" marker)
      const questionLine = lines[0].replace(/^:\s*/, '').trim();
      
      // Find the options line
      const optionsLine = lines.find(l => l.match(/\*\*Options\*\*/i)) || '';
      const optionsText = optionsLine.replace(/\*\*Options\*\*/i, '').trim();
      
      if (questionLine && optionsText) {
        const parsedOptions = optionsText
          .split(',')
          .map(o => o.replace(/^\d+\.\s*/, '').replace(/^["']|["']$/g, '').trim())
          .filter(Boolean);
        
        if (parsedOptions.length >= 2) {
          results.push({ question: questionLine, options: parsedOptions });
        }
      }
    }

    return results;
  };

  const applySuggestion = (suggestion: { question: string; options: string[] }) => {
    setQuestion(suggestion.question);
    setOptions(suggestion.options.map(o => o).concat(['', '']).slice(0, Math.max(suggestion.options.length, 2)));
    setShowAiSuggestions(false);
    setAiSuggestions([]);
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
      setAiSuggestions([]);
      setShowAiSuggestions(false);
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
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-300">Poll Question</label>
          <button
            type="button"
            onClick={handleGetAiSuggestions}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 hover:text-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            AI Suggestions
          </button>
        </div>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full rounded-xl glass-input px-4 py-3 text-white placeholder-slate-500/50"
          placeholder="What would you like to ask your audience?"
          maxLength={500}
        />
      </div>

      {/* AI Suggestions Panel */}
      <AnimatePresence>
        {showAiSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/15 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-cyan-200">AI Suggestions</span>
              </div>
              
              {aiLoading ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-cyan-400/50" />
                  </motion.div>
                </div>
              ) : aiSuggestions.length > 0 ? (
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      type="button"
                      onClick={() => applySuggestion(suggestion)}
                      className="w-full text-left p-3 rounded-lg bg-white/[0.03] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 transition-all group"
                    >
                      <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-200 transition-colors">
                        {suggestion.question}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {suggestion.options.length} options • Click to apply
                      </p>
                    </motion.button>
                  ))}
                  <p className="text-xs text-slate-500 pt-1 text-center">
                    Click a suggestion to fill the form instantly
                  </p>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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