'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, User, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
  retryContent?: string; // stores the user message that caused the error, for retry
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hey! I'm your Poll Pulse AI assistant 🎯 Ask me for poll ideas, voting tips, or anything about the platform!",
};

const SEND_COOLDOWN_MS = 1500;

export default function AiChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
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

  const sendMessage = async (overrideContent?: string) => {
    const trimmed = (overrideContent || input).trim();
    if (!trimmed || isLoading || isCoolingDown) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    };

    // Only add user message bubble if it's not a retry (retry reuses existing bubble)
    if (!overrideContent) {
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
    }

    setIsLoading(true);

    // Start cooldown
    setIsCoolingDown(true);
    setTimeout(() => setIsCoolingDown(false), SEND_COOLDOWN_MS);

    try {
      const chatHistory = [...messages.filter((m) => m.id !== 'welcome' && !m.isError), userMessage].map(
        ({ role, content }) => ({ role, content })
      );

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorText = getErrorMessage(res.status, errorData?.error);
        throw new Error(errorText);
      }

      const data = await res.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        isError: true,
        retryContent: trimmed,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (retryContent: string, errorMessageId: string) => {
    // Remove the error message, then resend
    setMessages((prev) => prev.filter((m) => m.id !== errorMessageId));
    sendMessage(retryContent);
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
            className="fixed bottom-24 right-6 z-[60] w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
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
                <p className="text-xs text-cyan-400/70">Powered by Groq</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400/80">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
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
                        : msg.isError
                          ? 'bg-red-500/20 border border-red-500/30'
                          : 'bg-cyan-500/20 border border-cyan-500/30'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-3.5 h-3.5 text-violet-300" />
                    ) : (
                      <Bot className={`w-3.5 h-3.5 ${msg.isError ? 'text-red-300' : 'text-cyan-300'}`} />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className="flex flex-col gap-1.5 max-w-[75%]">
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-violet-500/20 text-violet-100 rounded-tr-md border border-violet-500/15'
                          : msg.isError
                            ? 'bg-red-500/10 text-red-200 rounded-tl-md border border-red-500/20'
                            : 'bg-white/[0.06] text-slate-200 rounded-tl-md border border-white/[0.06]'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Retry button for error messages */}
                    {msg.isError && msg.retryContent && (
                      <button
                        onClick={() => handleRetry(msg.retryContent!, msg.id)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 text-xs text-red-300/80 hover:text-red-200 transition-colors self-start px-2 py-1 rounded-lg hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Retry
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

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
                  placeholder="Ask about polls..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 py-2"
                  disabled={isLoading}
                  maxLength={1000}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading || isCoolingDown}
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

/**
 * Maps HTTP status codes and API error messages to user-friendly strings.
 */
function getErrorMessage(status: number, apiError?: string): string {
  switch (status) {
    case 400:
      return apiError || 'Your message could not be processed. Please try rephrasing.';
    case 429:
      return '⏳ Rate limit reached. Please wait a moment and try again.';
    case 503:
      return '🔧 The AI service is temporarily unavailable. Please try again later.';
    case 504:
      return '⏱️ The AI took too long to respond. Please try again.';
    default:
      return apiError || "Something went wrong. Please try again in a moment.";
  }
}
