import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { groqApi } from "../../Features/Apis/babyCentreAIAPI";
import { Bot, User, Send, Loader2, Sparkles } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

// ── ChatBubble ────────────────────────────────────────────────

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: isUser ? "#86d9e1" : "rgba(134,217,225,0.15)",
          color: isUser ? "#002e33" : "#86d9e1",
        }}
      >
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>
      <div
        className="max-w-[80%] px-4 py-3 text-sm leading-relaxed"
        style={{
          background: isUser ? "#86d9e1" : "rgba(255,255,255,0.06)",
          color: isUser ? "#002e33" : "rgba(255,255,255,0.85)",
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
      content: `Hi ${user?.firstName || "Mama"} 👋 I'm MamaCare AI. Ask me anything about pregnancy, postnatal care, newborn care, or child development!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput]       = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef              = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to Groq AI
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

  // Send on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "#001e22", color: "white" }}
    >
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-10">

        {/* ── Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Sparkles size={20} style={{ color: "#86d9e1" }} />
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              BabyCentre AI
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Your AI Health Companion
          </h1>
          <p className="text-white/40 mt-1">
            Ask anything about pregnancy, postnatal care, newborns or child development.
          </p>
        </header>

        {/* ── Chat Window */}
        <div
          className="flex flex-col rounded-3xl overflow-hidden"
          style={{
            background: "rgba(134,217,225,0.04)",
            border: "1px solid rgba(134,217,225,0.15)",
            minHeight: "600px",
          }}
        >
          {/* Chat header bar */}
          <div
            className="px-5 py-4 flex items-center gap-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(134,217,225,0.15)" }}
            >
              <Bot size={20} style={{ color: "#86d9e1" }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">MamaCare AI</p>
              <p className="text-xs text-white/30">
                Powered by Groq · Always consult your doctor
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#a8d5a2" }}
              />
              <span className="text-xs text-white/30">Online</span>
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
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(134,217,225,0.15)" }}
                >
                  <Bot size={14} style={{ color: "#86d9e1" }} />
                </div>
                <div
                  className="px-4 py-3 flex items-center gap-2"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "18px 18px 18px 4px",
                  }}
                >
                  <Loader2
                    size={14}
                    className="animate-spin"
                    style={{ color: "#86d9e1" }}
                  />
                  <span className="text-xs text-white/40">
                    MamaCare AI is thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested questions — only shown before first user message */}
          {messages.length === 1 && (
            <div className="px-5 pb-4">
              <p className="text-xs text-white/30 mb-2">Try asking:</p>
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
                    className="text-xs px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                    style={{
                      background: "rgba(134,217,225,0.08)",
                      color: "#86d9e1",
                      border: "1px solid rgba(134,217,225,0.2)",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div
            className="px-4 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="flex gap-3 items-end rounded-2xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask MamaCare AI anything..."
                rows={1}
                className="flex-1 bg-transparent text-white text-sm outline-none resize-none placeholder:text-white/30"
                style={{ maxHeight: "100px" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || aiLoading}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
                style={{
                  background: input.trim() ? "#86d9e1" : "rgba(134,217,225,0.2)",
                  color: "#002e33",
                }}
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-xs text-white/20 text-center mt-2">
              AI responses are for general guidance only. Always consult your healthcare provider.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BabyCentreAI;