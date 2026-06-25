'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, User, TrendingUp, Lightbulb, BarChart3, Zap } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isAnalysis?: boolean;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hey! I'm your Poll Pulse AI assistant 🎯 I can analyze poll results, suggest poll ideas, give voting insights, or help you create better polls. What can I help you with?",
};

const SUGGESTED_PROMPTS = [
  { icon: TrendingUp, text: 'Analyze poll trends', label: 'Trends' },
  { icon: Lightbulb, text: 'Suggest poll ideas', label: 'Ideas' },
  { icon: BarChart3, text: 'Best practices', label: 'Tips' },
  { icon: Zap, text: 'Improve a poll', label: 'Improve' },
];

function formatResponse(content: string): { segments: { text: string; isBold: boolean; isBullet: boolean }[] }[] {
  const lines = content.split('\n').filter(l => l.trim());
  const paragraphs: { segments: { text: string; isBold: boolean; isBullet: boolean }[] }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed);
    const segments: { text: string; isBold: boolean; isBullet: boolean }[] = [];
    
    // Simple bold detection: text between ** **
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
    for (const part of parts) {
      if (part.startsWith('**') && part.endsWith('**')) {
        segments.push({ text: part.slice(2, -2), isBold: true, isBullet });
      } else {
        segments.push({ text: part, isBold: false, isBullet });
      }
    }
    paragraphs.push({ segments });
  }

  return paragraphs;
}

export default function AiChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = [...messages.filter((m) => m.id !== 'welcome'), userMessage].map(
        ({ role, content }) => ({ role, content })
      );

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to get response');
      }

      const data = await res.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        isAnalysis: data.reply.length > 150,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: err instanceof Error
          ? err.message.includes('ANTHROPIC_API_KEY')
            ? "⚠️ The AI feature needs an API key to work. Ask your developer to set the **ANTHROPIC_API_KEY** in .env.local"
            : `Sorry, I'm having trouble connecting: ${err.message}`
          : "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25 transition-colors"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #ef4444, #f43f5e)'
            : 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-6 z-[60] w-[380px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
            style={{
              background: 'rgba(10, 10, 20, 0.85)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-4 shrink-0"
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(6, 182, 212, 0.05)',
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-500 to-violet-500 shadow-md shadow-cyan-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">Poll Pulse AI</h3>
                <p className="text-xs text-cyan-400/70">Powered by Claude</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400/80">Online</span>
              </div>
            </div>

            {/* Suggested Prompts (shown when no messages besides welcome) */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 pt-3 pb-1 shrink-0">
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.08 }}
                      onClick={() => sendMessage(prompt.text)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <prompt.icon className="w-3 h-3" />
                      {prompt.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => {
                const paragraphs = formatResponse(msg.content);
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === 'user'
                          ? 'bg-violet-500/20 border border-violet-500/30'
                          : 'bg-cyan-500/20 border border-cyan-500/30'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User className="w-3.5 h-3.5 text-violet-300" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-cyan-300" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-violet-500/20 text-violet-100 rounded-tr-md border border-violet-500/15'
                          : 'bg-white/[0.06] text-slate-200 rounded-tl-md border border-white/[0.06]'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="space-y-1">
                          {paragraphs.map((para, pIdx) => (
                            <p key={pIdx} className={para.segments.some(s => s.isBullet) ? 'pl-1' : ''}>
                              {para.segments.map((seg, sIdx) => {
                                const prefix = seg.isBullet && sIdx === 0 ? '• ' : '';
                                return seg.isBold ? (
                                  <strong key={sIdx} className="text-white font-semibold">
                                    {prefix}{seg.text}
                                  </strong>
                                ) : (
                                  <span key={sIdx}>{prefix}{seg.text}</span>
                                );
                              })}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-cyan-500/20 border border-cyan-500/30">
                    <Bot className="w-3.5 h-3.5 text-cyan-300" />
                  </div>
                  <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className="px-4 py-3 shrink-0"
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(6, 182, 212, 0.03)',
              }}
            >
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 py-1 focus-within:border-cyan-500/40 transition-colors">
                <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about polls, trends, tips..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 py-2"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-500/20 text-cyan-400"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}