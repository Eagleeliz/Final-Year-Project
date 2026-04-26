import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { groqApi } from "../../Features/Apis/babyCentreAIAPI";
import { Bot, User, Loader2, Sparkles } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

// ── Color tokens ──────────────────────────────────────────────
const midnightTeal = "#0B3B3F";
const aquaText     = "#7FD1E0";
const aquaLight    = "#E6F7F9";
const warmGray     = "#F8F9FA";

// ── ChatBubble ────────────────────────────────────────────────

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: isUser ? midnightTeal : aquaLight,
          color: isUser ? aquaText : midnightTeal,
        }}
      >
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      <div
        className="max-w-[80%] px-4 py-3 text-base md:text-lg leading-relaxed"
        style={{
          background: isUser ? midnightTeal : "#FFFFFF",
          color: isUser ? "#FFFFFF" : midnightTeal,
          border: isUser ? "none" : `1px solid #E5E7EB`,
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        }}
      >
        {message.content}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────

const BabyCentreAI: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content: `Hi ${user?.firstName || "Mama"} 👋 I'm BabyCentre AI. Ask me anything about pregnancy, postnatal care, newborn care, or child development!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput]         = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef                = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || aiLoading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAiLoading(true);

    try {
      const answer = await groqApi.ask(question);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: answer, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Sorry, I couldn't get a response right now. Please try again or consult your healthcare provider.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: warmGray, color: midnightTeal }}
    >
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-10">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={20} style={{ color: aquaText }} />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: midnightTeal, opacity: 0.5 }}
            >
              BabyCentre AI
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black"
            style={{ color: midnightTeal }}
          >
            Your AI Health Companion
          </h1>
          <p className="text-gray-400 mt-1">
            Ask anything about pregnancy, postnatal care, newborns or child development.
          </p>
        </header>

        {/* Chat Window */}
        <div
          className="flex flex-col rounded-3xl overflow-hidden bg-white shadow-sm"
          style={{
            border: "1px solid #E5E7EB",
            minHeight: "600px",
          }}
        >
          {/* Chat header */}
          <div
            className="px-5 py-4 flex items-center gap-3"
            style={{
              background: aquaLight,
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white">
              <Bot size={20} style={{ color: midnightTeal }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: midnightTeal }}>
                BabyCentre AI
              </p>
              <p className="text-xs text-gray-400">
                Powered by Groq · Always consult your doctor
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}

            {/* Typing indicator */}
            {aiLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: aquaLight }}>
                  <Bot size={14} style={{ color: midnightTeal }} />
                </div>
                <div className="px-4 py-3 flex items-center gap-2 bg-white border border-gray-200"
                  style={{ borderRadius: "18px 18px 18px 4px" }}>
                  <Loader2 size={14} className="animate-spin" style={{ color: aquaText }} />
                  <span className="text-sm md:text-base text-gray-400">
                    BabyCentre AI is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested */}
          {messages.length === 1 && (
            <div className="px-5 pb-4">
              <p className="text-sm text-gray-400 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "What should I eat in first trimester?",
                  "When should I feel baby kick?",
                  "How do I care for a newborn?",
                  "What are danger signs in pregnancy?",
                  "How often should I breastfeed?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-sm px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                    style={{
                      background: aquaLight,
                      color: midnightTeal,
                      border: `1px solid ${aquaText}40`,
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex gap-3 items-end rounded-2xl px-4 py-3 bg-gray-100 border border-gray-200">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask BabyCentre AI anything..."
                rows={1}
                className="flex-1 bg-transparent text-base md:text-lg outline-none resize-none placeholder:text-gray-400"
                style={{ color: midnightTeal, maxHeight: "100px" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || aiLoading}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
                style={{
                  background: input.trim() ? midnightTeal : "#E5E7EB",
                  color: "#FFFFFF",
                }}
              >
                ↑
              </button>
            </div>
            <p className="text-sm text-gray-400 text-center mt-2">
              AI responses are for general guidance only.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BabyCentreAI;