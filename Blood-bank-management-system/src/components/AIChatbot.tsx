"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Bot,
  Building2,
  CheckCircle2,
  HeartPulse,
  HelpCircle,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Siren,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { soundEngine } from "./AudioController";
import { ApiResponseError, fetchJson } from "@/lib/fetchJson";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type DonorForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bloodGroup: string;
  dateOfBirth: string;
  weight: string;
  address: string;
};

type DonorProfile = DonorForm & {
  donorId: string;
  status: string;
};

type DonorRegistrationError = {
  error: string;
  donor?: DonorProfile;
};

type Step = keyof DonorForm;

const emptyForm: DonorForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  bloodGroup: "",
  dateOfBirth: "",
  weight: "",
  address: "",
};

const steps: Array<{ key: Step; question: string; hint: string }> = [
  { key: "firstName", question: "Wonderful. What is your first name?", hint: "First name" },
  { key: "lastName", question: "Thanks. What is your last name?", hint: "Last name" },
  { key: "email", question: "What email should we use for your donor profile?", hint: "name@example.com" },
  { key: "phone", question: "Please share your phone number.", hint: "+1 555 000 0000" },
  { key: "bloodGroup", question: "What is your blood group?", hint: "A+, A-, B+, B-, O+, O-, AB+, AB-" },
  { key: "dateOfBirth", question: "What is your date of birth?", hint: "YYYY-MM-DD" },
  { key: "weight", question: "What is your weight in kg?", hint: "Example: 70" },
  { key: "address", question: "Last step. What is your full address?", hint: "Street, city, state" },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const quickReplies = [
  { label: "Register me", icon: HeartPulse },
  { label: "Check eligibility", icon: ShieldCheck },
  { label: "Donation FAQs", icon: HelpCircle },
  { label: "Set reminder", icon: Bell },
  { label: "Nearby banks", icon: Building2 },
  { label: "Emergency request", icon: Siren },
];

function startsRegistration(text: string) {
  const value = text.toLowerCase();
  return (
    value.includes("want to donate") ||
    value.includes("register me") ||
    value.includes("become a donor") ||
    value.includes("donate blood")
  );
}

function validateStep(step: Step, value: string) {
  if (!value.trim()) return "Please enter a value so I can continue.";
  if (step === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "That email does not look right yet. Please enter it like name@example.com.";
  }
  if (step === "bloodGroup" && !bloodGroups.includes(value.toUpperCase())) {
    return "Please choose one of A+, A-, B+, B-, O+, O-, AB+, or AB-.";
  }
  if (step === "dateOfBirth" && Number.isNaN(new Date(value).getTime())) {
    return "Please enter your date of birth in YYYY-MM-DD format.";
  }
  if (step === "weight" && Number(value) < 50) {
    return "Donors usually need to weigh at least 50 kg. Please enter your current weight in kg.";
  }
  return "";
}

function featureResponse(text: string) {
  const value = text.toLowerCase();

  if (value.includes("eligib")) {
    return "Eligibility check: donors are usually 18-65 years old, 50 kg or above, feeling well, free from active infection, and at least 56 days from their last whole blood donation. I can also register you and flag the profile for staff review.";
  }
  if (value.includes("faq")) {
    return "Quick FAQs: donation usually takes 8-10 minutes, the full visit is about 45 minutes, eat and hydrate before coming, bring an ID, and avoid heavy exercise right after donation.";
  }
  if (value.includes("reminder")) {
    return "I can help with reminders. After a whole blood donation, the next common reminder is 56 days later. Once your donor profile is registered, LifeStream can use your email or phone for follow-ups.";
  }
  if (value.includes("nearby") || value.includes("bank")) {
    return "To find nearby blood banks, share your city or area. You can also use the address from your donor profile and the LifeStream team can route you to the nearest partner center.";
  }
  if (value.includes("emergency")) {
    return "For emergency blood assistance, share the patient name, hospital, blood group, units needed, urgency, and contact number in the emergency request section. For critical cases, call the hospital blood bank immediately while submitting the request.";
  }
  return "I can register you as a donor, check eligibility, answer donation FAQs, help with reminders, find nearby blood banks, or guide an emergency blood request. What would you like to do?";
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I am LifeStream AI. I can register you as a donor step by step, check eligibility, answer donation questions, help with reminders, find blood banks, or guide emergency requests.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [form, setForm] = useState<DonorForm>(emptyForm);
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("lifestreamDonorProfile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addAssistant = (content: string, delay = 650) => {
    setIsTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content, timestamp: new Date() },
      ]);
      setIsTyping(false);
      soundEngine.notification();
    }, delay);
  };

  const beginRegistration = () => {
    if (profile) {
      addAssistant(
        `You are already registered as ${profile.firstName} ${profile.lastName}. Donor ID: ${profile.donorId}. Status: ${profile.status}.`
      );
      return;
    }

    setForm(emptyForm);
    setActiveStep(0);
    addAssistant(steps[0].question);
  };

  const submitRegistration = async (payload: DonorForm) => {
    setIsTyping(true);
    try {
      const result = await fetchJson<DonorProfile>("/api/donors", {
        label: "AI chatbot donor registration",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setProfile(result);
      window.localStorage.setItem("lifestreamDonorProfile", JSON.stringify(result));
      window.dispatchEvent(new Event("lifestream:donor-registered"));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Registration completed successfully. Welcome to LifeStream Blood Network. Your Donor ID is ${result.donorId}, and your status is ${result.status}.`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      if (
        error instanceof ApiResponseError &&
        error.response.status === 409
      ) {
        const data = error.data as DonorRegistrationError;
        const donor = data.donor;
        if (donor) {
          setProfile(donor);
          window.localStorage.setItem(
            "lifestreamDonorProfile",
            JSON.stringify(donor)
          );
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `This email or phone is already registered. Here is the donor profile: ${donor.firstName} ${donor.lastName}, Donor ID ${donor.donorId}, Status ${donor.status}.`,
              timestamp: new Date(),
            },
          ]);
          return;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "I could not complete registration right now.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setActiveStep(null);
      soundEngine.notification();
    }
  };

  const continueRegistration = (value: string) => {
    if (activeStep === null) return;

    const step = steps[activeStep];
    const normalized =
      step.key === "bloodGroup" ? value.trim().toUpperCase() : value.trim();
    const error = validateStep(step.key, normalized);
    if (error) {
      addAssistant(error, 450);
      return;
    }

    const nextForm = { ...form, [step.key]: normalized };
    setForm(nextForm);

    const nextStep = activeStep + 1;
    if (nextStep < steps.length) {
      setActiveStep(nextStep);
      addAssistant(steps[nextStep].question, 450);
      return;
    }

    submitRegistration(nextForm);
  };

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isTyping) return;

    soundEngine.click();
    setMessages((prev) => [
      ...prev,
      { role: "user", content: msg, timestamp: new Date() },
    ]);
    setInput("");

    if (activeStep !== null) {
      continueRegistration(msg);
      return;
    }

    if (startsRegistration(msg)) {
      beginRegistration();
      return;
    }

    // Use Groq AI for intelligent responses
    setIsTyping(true);
    try {
      const conversationHistory = [...messages, { role: "user" as const, content: msg }].slice(-6);
      const res = await fetchJson<{ reply: string }>("/api/ai", {
        label: "LifeStream AI chatbot",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply, timestamp: new Date() },
      ]);
      soundEngine.notification();
    } catch {
      // Fallback to rule-based response if AI fails
      setIsTyping(false);
      addAssistant(featureResponse(msg));
    }
  };

  const currentHint = activeStep === null ? "Ask LifeStream AI..." : steps[activeStep].hint;

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 4.8, type: "spring", stiffness: 200, damping: 20 }}
        onClick={() => {
          setIsOpen(!isOpen);
          soundEngine.click();
        }}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 rounded-2xl bg-gradient-to-br from-crimson-600 to-blood-dark flex items-center justify-center shadow-2xl shadow-crimson-900/40 hover:shadow-crimson-600/30 transition-all duration-300 group"
        data-magnetic
        aria-label="Open LifeStream AI chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && <span className="absolute inset-0 rounded-2xl border-2 border-crimson-400/40 animate-ping" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-28 right-8 z-[100] w-[420px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[78vh] rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: "rgba(10, 10, 10, 0.95)",
              backdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 0 40px rgba(139,0,0,0.1)",
            }}
          >
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-600 to-blood-dark flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-white">
                    LifeStream AI
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Donor assistant
                  </div>
                </div>
              </div>
              {profile && (
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  Registered
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <motion.div
                  key={`${msg.timestamp.toISOString()}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-crimson-600/20" : "bg-white/5"}`}>
                    {msg.role === "assistant" ? (
                      <Bot className="w-4 h-4 text-crimson-400" />
                    ) : (
                      <User className="w-4 h-4 text-white/60" />
                    )}
                  </div>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "assistant" ? "bg-white/[0.03] border border-white/5 text-white/80 rounded-tl-md" : "bg-crimson-600/20 border border-crimson-600/10 text-white/90 rounded-tr-md"}`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-crimson-600/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-crimson-400" />
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((dot) => (
                        <motion.div
                          key={dot}
                          className="w-1.5 h-1.5 rounded-full bg-crimson-400/60"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: dot * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-5 pb-2 flex flex-wrap gap-2">
              {quickReplies.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(label)}
                  disabled={isTyping}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-crimson-600/20 text-crimson-300/70 hover:bg-crimson-600/10 hover:text-crimson-200 disabled:opacity-40 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {activeStep !== null && (
              <div className="px-5 pb-2">
                <div className="flex items-center gap-2 text-xs text-white/35">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Registration step {activeStep + 1} of {steps.length}
                </div>
              </div>
            )}

            <div className="px-5 py-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={currentHint}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-crimson-500/40 transition-colors"
                  />
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-crimson-600 to-blood-dark flex items-center justify-center text-white disabled:opacity-30 hover:shadow-lg hover:shadow-crimson-600/20 transition-all"
                  aria-label="Send message"
                >
                  {activeStep === null ? <Send className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
